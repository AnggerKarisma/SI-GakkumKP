<?php

namespace App\Http\Controllers;

use App\Models\Pinjam;
use App\Models\User;
use App\Models\Kendaraan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Exception;

class PinjamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Pinjam::with(['user', 'kendaraan']);

            if ($request->has('status')) {
                switch ($request->status) {
                    case 'active':
                        $query->active();
                        break;
                    case 'overdue':
                        $query->overdue();
                        break;
                    case 'completed':
                        $query->completed();
                        break;
                }
            }
            if ($request->has('user_id')) {
                $query->byUser($request->user_id);
            }

            if ($request->has('kendaraan_id')) {
                $query->byKendaraan($request->kendaraan_id);
            }

            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('tglPinjam', [$request->start_date, $request->end_date]);
            }

            $sortBy = $request->get('sort_by', 'tglPinjam');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $perPage = $request->get('per_page', 15);
            $pinjam = $query->paginate($perPage);

            $pinjam->getCollection()->transform(function ($item) {
                $item->duration_days = $item->getDurationInDays();
                $item->status_info = [
                    'is_active' => $item->isActive(),
                    'is_overdue' => $item->isOverdue(),
                    'is_returned' => $item->isReturned()
                ];
                return $item;
            });

            return response()->json([
                'success' => true,
                'message' => 'Data peminjaman berhasil diambil',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'userID' => 'required|integer|exists:user,userID',
            'kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID',
            'tglPinjam' => 'required|date|after_or_equal:today',
        ], [
            'userID.required' => 'ID User wajib diisi',
            'userID.exists' => 'User tidak ditemukan',
            'kendaraanID.required' => 'ID Kendaraan wajib diisi',
            'kendaraanID.exists' => 'Kendaraan tidak ditemukan',
            'tglPinjam.required' => 'Tanggal pinjam wajib diisi',
            'tglPinjam.after_or_equal' => 'Tanggal pinjam tidak boleh di masa lalu'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $kendaraan = Kendaraan::find($request->kendaraanID);
            
            if ($kendaraan->statKendaraan !== 'Stand by') {
                throw new Exception('Kendaraan tidak tersedia untuk dipinjam.');
            }

            $pinjam = Pinjam::create([
                'userID' => $request->userID,
                'kendaraanID' => $request->kendaraanID,
                'tglPinjam' => $request->tglPinjam,
            ]);

            $kendaraan->update(['statKendaraan' => 'Not Available']);

            $pinjam->load(['user', 'kendaraan']);
            
            $pinjam->duration_days = $pinjam->getDurationInDays();
            $pinjam->status_info = [
                'is_active' => $pinjam->isActive(),
                'is_overdue' => $pinjam->isOverdue(),
                'is_returned' => $pinjam->isReturned()
            ];

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Peminjaman berhasil dibuat',
                'data' => $pinjam
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $pinjam = Pinjam::with(['user', 'kendaraan'])->findOrFail($id);
            
            $pinjam->duration_days = $pinjam->getDurationInDays();
            $pinjam->status_info = [
                'is_active' => $pinjam->isActive(),
                'is_overdue' => $pinjam->isOverdue(),
                'is_returned' => $pinjam->isReturned()
            ];

            return response()->json([
                'success' => true,
                'message' => 'Data peminjaman berhasil diambil',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Peminjaman tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function returnVehicle(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'tglKembali' => 'required|date|after_or_equal:today',
        ], [
            'tglKembali.required' => 'Tanggal kembali wajib diisi',
            'tglKembali.after_or_equal' => 'Tanggal kembali tidak boleh di masa lalu'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $pinjam = Pinjam::find($id);
            
            if (!$pinjam) {
                throw new Exception('ID Pinjam tidak ditemukan.');
            }

            if ($pinjam->tglKembali !== null) {
                throw new Exception('Kendaraan sudah dikembalikan sebelumnya.');
            }

            $oldTglKembali = $pinjam->tglKembali;
            $pinjam->update(['tglKembali' => $request->tglKembali]);

            if ($request->tglKembali !== null && $oldTglKembali === null) {
                $kendaraan = Kendaraan::find($pinjam->kendaraanID);
                $kendaraan->update(['statKendaraan' => 'Stand by']);
            }

            $pinjam->load(['user', 'kendaraan']);
            
            $pinjam->duration_days = $pinjam->getDurationInDays();
            $pinjam->status_info = [
                'is_active' => $pinjam->isActive(),
                'is_overdue' => $pinjam->isOverdue(),
                'is_returned' => $pinjam->isReturned()
            ];

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pengembalian berhasil.',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan pengembalian',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateKendaraanStatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID',
            'status_baru' => 'required|in:Maintenance,Stand by',
        ], [
            'kendaraanID.required' => 'ID Kendaraan wajib diisi',
            'kendaraanID.exists' => 'Kendaraan tidak ditemukan',
            'status_baru.required' => 'Status baru wajib diisi',
            'status_baru.in' => 'Status harus Maintenance atau Stand by'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $kendaraan = Kendaraan::find($request->kendaraanID);
            
            if (!$kendaraan) {
                throw new Exception('Kendaraan tidak ditemukan.');
            }

            $currentStatus = $kendaraan->statKendaraan;
            
            if ($request->status_baru === 'Maintenance' && $currentStatus === 'Not Available') {
                throw new Exception('Kendaraan dalam status Dipinjam, Tidak dapat melakukan Maintenance.');
            }

            $kendaraan->update(['statKendaraan' => $request->status_baru]);
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Status kendaraan berhasil diubah menjadi {$request->status_baru}",
                'data' => [
                    'kendaraan' => $kendaraan,
                    'old_status' => $currentStatus,
                    'new_status' => $request->status_baru
                ]
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status kendaraan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function generateReport(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:user,userID',
            'tgl_mulai' => 'required|date',
            'tgl_selesai' => 'required|date|after_or_equal:tgl_mulai',
        ], [
            'user_id.required' => 'ID User wajib diisi',
            'user_id.exists' => 'User tidak ditemukan',
            'tgl_mulai.required' => 'Tanggal mulai wajib diisi',
            'tgl_selesai.required' => 'Tanggal selesai wajib diisi',
            'tgl_selesai.after_or_equal' => 'Tanggal selesai harus setelah atau sama dengan tanggal mulai'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::find($request->user_id);
            $role = $user->role;
            $unitKerja = $user->unitKerja;

            $query = Pinjam::with(['user', 'kendaraan'])
                ->whereBetween('tglPinjam', [$request->tgl_mulai, $request->tgl_selesai])
                ->orderBy('tglPinjam', 'desc');

            if ($role === 'Super Admin' || $unitKerja === 'Balai') {
                $pinjam = $query->get();
                
                $reportData = $pinjam->map(function ($item) {
                    return [
                        'pinjamID' => $item->pinjamID,
                        'tglPinjam' => $item->tglPinjam,
                        'tglKembali' => $item->tglKembali,
                        'peminjam' => $item->user->nama,
                        'unit_kerja_peminjam' => $item->user->unitKerja,
                        'namaKendaraan' => $item->kendaraan->namaKendaraan,
                        'plat' => $item->kendaraan->plat,
                        'unit_kerja_kendaraan' => $item->kendaraan->unitKerja,
                        'duration_days' => $item->getDurationInDays(),
                        'status_info' => [
                            'is_active' => $item->isActive(),
                            'is_overdue' => $item->isOverdue(),
                            'is_returned' => $item->isReturned()
                        ]
                    ];
                });
            } else {
                $pinjam = $query->whereHas('kendaraan', function ($q) use ($unitKerja) {
                    $q->where('unitKerja', $unitKerja);
                })->get();

                $reportData = $pinjam->map(function ($item) {
                    return [
                        'pinjamID' => $item->pinjamID,
                        'tglPinjam' => $item->tglPinjam,
                        'tglKembali' => $item->tglKembali,
                        'peminjam' => $item->user->nama,
                        'namaKendaraan' => $item->kendaraan->namaKendaraan,
                        'plat' => $item->kendaraan->plat,
                        'duration_days' => $item->getDurationInDays(),
                        'status_info' => [
                            'is_active' => $item->isActive(),
                            'is_overdue' => $item->isOverdue(),
                            'is_returned' => $item->isReturned()
                        ]
                    ];
                });
            }

            $statistics = [
                'total_peminjaman' => $reportData->count(),
                'peminjaman_aktif' => $reportData->where('status_info.is_active', true)->count(),
                'peminjaman_terlambat' => $reportData->where('status_info.is_overdue', true)->count(),
                'peminjaman_selesai' => $reportData->where('status_info.is_returned', true)->count(),
                'rata_rata_durasi' => $reportData->avg('duration_days'),
                'periode_laporan' => [
                    'mulai' => $request->tgl_mulai,
                    'selesai' => $request->tgl_selesai
                ],
                'generated_by' => [
                    'user_id' => $user->userID,
                    'nama' => $user->nama,
                    'role' => $user->role,
                    'unit_kerja' => $user->unitKerja
                ]
            ];

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil dibuat',
                'data' => [
                    'report_data' => $reportData,
                    'statistics' => $statistics
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getActive(): JsonResponse
    {
        try {
            $pinjam = Pinjam::with(['user', 'kendaraan'])
                ->active()
                ->orderBy('tglPinjam', 'desc')
                ->get();

            $pinjam->transform(function ($item) {
                $item->duration_days = $item->getDurationInDays();
                $item->status_info = [
                    'is_active' => $item->isActive(),
                    'is_overdue' => $item->isOverdue(),
                    'is_returned' => $item->isReturned()
                ];
                return $item;
            });

            return response()->json([
                'success' => true,
                'message' => 'Data peminjaman aktif berhasil diambil',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data peminjaman aktif',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getOverdue(): JsonResponse
    {
        try {
            $pinjam = Pinjam::with(['user', 'kendaraan'])
                ->overdue()
                ->orderBy('tglKembali', 'asc')
                ->get();

            $pinjam->transform(function ($item) {
                $item->duration_days = $item->getDurationInDays();
                $item->overdue_days = $item->tglKembali ? now()->diffInDays($item->tglKembali) : 0;
                $item->status_info = [
                    'is_active' => $item->isActive(),
                    'is_overdue' => $item->isOverdue(),
                    'is_returned' => $item->isReturned()
                ];
                return $item;
            });

            return response()->json([
                'success' => true,
                'message' => 'Data peminjaman terlambat berhasil diambil',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data peminjaman terlambat',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByUser(int $userId): JsonResponse
    {
        try {
            $pinjam = Pinjam::with(['user', 'kendaraan'])
                ->byUser($userId)
                ->orderBy('tglPinjam', 'desc')
                ->get();

            $pinjam->transform(function ($item) {
                $item->duration_days = $item->getDurationInDays();
                $item->status_info = [
                    'is_active' => $item->isActive(),
                    'is_overdue' => $item->isOverdue(),
                    'is_returned' => $item->isReturned()
                ];
                return $item;
            });

            return response()->json([
                'success' => true,
                'message' => 'Riwayat peminjaman user berhasil diambil',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil riwayat peminjaman user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByKendaraan(int $kendaraanId): JsonResponse
    {
        try {
            $pinjam = Pinjam::with(['user', 'kendaraan'])
                ->byKendaraan($kendaraanId)
                ->orderBy('tglPinjam', 'desc')
                ->get();

            $pinjam->transform(function ($item) {
                $item->duration_days = $item->getDurationInDays();
                $item->status_info = [
                    'is_active' => $item->isActive(),
                    'is_overdue' => $item->isOverdue(),
                    'is_returned' => $item->isReturned()
                ];
                return $item;
            });

            return response()->json([
                'success' => true,
                'message' => 'Riwayat peminjaman kendaraan berhasil diambil',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil riwayat peminjaman kendaraan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $pinjam = Pinjam::findOrFail($id);
            if ($pinjam->tglKembali === null) {
                $kendaraan = Kendaraan::find($pinjam->kendaraanID);
                $kendaraan->update(['statKendaraan' => 'Stand by']);
            }

            $pinjam->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data peminjaman berhasil dihapus'
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
