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
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;

class BorrowController extends Controller
{
   public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID',
            'tglPinjam' => 'required|date|after_or_equal:today',
            'tglJatuhTempo' => 'required|date|after:tglPinjam',
            'keterangan' => 'nullable|string|max:500',
        ], [
            'kendaraanID.required' => 'ID Kendaraan wajib diisi',
            'kendaraanID.exists' => 'Kendaraan tidak ditemukan',
            'tglPinjam.required' => 'Tanggal pinjam wajib diisi',
            'tglPinjam.after_or_equal' => 'Tanggal pinjam tidak boleh di masa lalu',
            'tglJatuhTempo.required' => 'Tanggal jatuh tempo wajib diisi',
            'tglJatuhTempo.after' => 'Tanggal jatuh tempo harus setelah tanggal pinjam'
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
            $userPeminjam = Auth::user();
            $kendaraan = Kendaraan::find($request->kendaraanID);

            if ($userPeminjam->unitKerja !== $kendaraan->unitKerja) {
                throw new Exception('Peminjam tidak dapat meminjam kendaraan dari unit kerja yang berbeda.');
            }
            
            if ($kendaraan->statKendaraan !== 'Stand by') {
                throw new Exception('Kendaraan tidak tersedia untuk dipinjam.');
            }

            $activeBorrow = Pinjam::where('kendaraanID', $request->kendaraanID)
                                  ->active()
                                  ->first();
            
            if ($activeBorrow) {
                throw new Exception('Kendaraan sedang dipinjam oleh user lain.');
            }

            $pinjam = Pinjam::create([
                'userID' => $userPeminjam->userID,
                'kendaraanID' => $request->kendaraanID,
                'tglPinjam' => $request->tglPinjam,
                'tglJatuhTempo' => $request->tglJatuhTempo,
                'keterangan' => $request->keterangan,
            ]);

            $kendaraan->update(['statKendaraan' => 'Not Available']);
            $pinjam->load(['user', 'kendaraan']);

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
            ], 403); 
        }
    }

    public function returnVehicle(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'tglKembaliAktual' => 'required|date|after_or_equal:today',
            'keterangan' => 'nullable|string|max:500',
        ], [
            'tglKembaliAktual.required' => 'Tanggal kembali aktual wajib diisi',
            'tglKembaliAktual.after_or_equal' => 'Tanggal kembali tidak boleh di masa lalu'
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
                throw new Exception('Data peminjaman tidak ditemukan.');
            }

            if ($pinjam->tglKembaliAktual !== null) {
                throw new Exception('Kendaraan sudah dikembalikan sebelumnya.');
            }

            $pinjam->update([
                'tglKembaliAktual' => $request->tglKembaliAktual,
                'keterangan' => $request->keterangan ?? $pinjam->keterangan
            ]);

            $kendaraan = Kendaraan::find($pinjam->kendaraanID);
            $kendaraan->update(['statKendaraan' => 'Stand by']);

            $pinjam->load(['user', 'kendaraan']);
            $pinjam->duration_days = $pinjam->getDurationInDays();
            $pinjam->status_info = [
                'is_active' => $pinjam->isActive(),
                'is_overdue' => $pinjam->isOverdue(),
                'is_returned' => $pinjam->isReturned(),
                'is_late_return' => $pinjam->isLateReturn(),
                'late_return_days' => $pinjam->getLateReturnDays()
            ];

            DB::commit();

            $message = $pinjam->isLateReturn() 
                ? "Kendaraan berhasil dikembalikan (Terlambat {$pinjam->getLateReturnDays()} hari)"
                : "Kendaraan berhasil dikembalikan tepat waktu";

            return response()->json([
                'success' => true,
                'message' => $message,
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
    
    public function getStatistics(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ], [
            'end_date.after_or_equal' => 'Tanggal akhir harus setelah atau sama dengan tanggal mulai',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        try {
            $baseQuery = Pinjam::query();

            if ($request->filled('start_date') && $request->filled('end_date')) {
                $baseQuery->whereBetween('tglPinjam', [$request->start_date, $request->end_date]);
            }
            $totalPeminjaman = Pinjam::count();
            $peminjamanAktif = Pinjam::active()->count();
            $peminjamanOverdue = Pinjam::overdue()->count();
            $peminjamanSelesai = Pinjam::completed()->count();
            $pengembalianTerlambat = Pinjam::lateReturned()->count();

            $statistics = [
                'total_peminjaman' => $totalPeminjaman,
                'peminjaman_aktif' => $peminjamanAktif,
                'peminjaman_overdue' => $peminjamanOverdue,
                'peminjaman_selesai' => $peminjamanSelesai,
                'pengembalian_terlambat' => $pengembalianTerlambat,
                'persentase_overdue' => $totalPeminjaman > 0 ? round(($peminjamanOverdue / $totalPeminjaman) * 100, 2) : 0,
                'persentase_terlambat' => $peminjamanSelesai > 0 ? round(($pengembalianTerlambat / $peminjamanSelesai) * 100, 2) : 0,
            ];

            if ($request->filled('start_date') && $request->filled('end_date')) {
                $statistics['period'] = [
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                ];
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Statistik peminjaman berhasil diambil',
                'data' => $statistics
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $query = Pinjam::with(['user', 'kendaraan']);
            if ($request->has('status')) {
                $query->when($request->status === 'active', fn($q) => $q->active())
                      ->when($request->status === 'overdue', fn($q) => $q->overdue())
                      ->when($request->status === 'completed', fn($q) => $q->completed());
            }
            $perPage = $request->integer('per_page', 10);
            $pinjam = $query->latest('created_at')->paginate($perPage);

            $pinjam->through(function ($item) {
                return $item->setAttribute('duration_days', $item->getDurationInDays())
                           ->setAttribute('status_info', [
                               'is_active' => $item->isActive(),
                               'is_overdue' => $item->isOverdue(),
                               'is_returned' => $item->isReturned(),
                               'overdue_days' => $item->getOverdueDays()
                           ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Data peminjaman berhasil diambil',
                'data' => $pinjam->items(),
                'pagination' => [
                    'current_page' => $pinjam->currentPage(),
                    'per_page' => $pinjam->perPage(),
                    'total' => $pinjam->total(),
                    'last_page' => $pinjam->lastPage()
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($pinjamId): JsonResponse
    {
        try {
            $pinjam = Pinjam ::findOrFail($pinjamId);
            $pinjam->load(['user', 'kendaraan']);
        
            $pinjam->duration_days = $pinjam->tglPinjam ? $pinjam->getDurationInDays() : 0;
        
            $pinjam->status_info = collect([
                'is_active' => $pinjam->tglPinjam ? $pinjam->isActive() : false,
                'is_overdue' => $pinjam->isOverdue(),
                'is_returned' => $pinjam->isReturned(),
                'overdue_days' => $pinjam->getOverdueDays()
            ])->when($pinjam->isReturned(), function ($collection) use ($pinjam) {
                return $collection->merge([
                    'is_late_return' => $pinjam->isLateReturn(),
                    'late_return_days' => $pinjam->getLateReturnDays()
                ]);
            })->toArray();

            return response()->json([
                'success' => true,
                'message' => 'Detail peminjaman berhasil diambil',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByUser($userID): JsonResponse
    {
        try {
            $user = User ::findOrFail($userID);

            $pinjam = $user->pinjams()
                ->with(['user', 'kendaraan'])
                ->latest('created_at')
                ->get()
                ->map(function ($item) {
                    return $item->setAttribute('duration_days', $item->getDurationInDays())
                               ->setAttribute('status_info', [
                                   'is_active' => $item->isActive(),
                                   'is_overdue' => $item->isOverdue(),
                                   'is_returned' => $item->isReturned(),
                                   'overdue_days' => $item->getOverdueDays()
                               ]);
                });

            return response()->json([
                'success' => true,
                'message' => 'Data peminjaman user berhasil diambil',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data peminjaman user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByKendaraan($kendaraanId): JsonResponse
    {
        try {
            $kendaraan = Kendaraan ::findOrFail($kendaraanId);
            $pinjam = $kendaraan->pinjams()
                ->with(['user', 'kendaraan'])
                ->latest('created_at')
                ->get()
                ->map(function ($item) {
                    return $item->setAttribute('duration_days', $item->getDurationInDays())
                               ->setAttribute('status_info', [
                                   'is_active' => $item->isActive(),
                                   'is_overdue' => $item->isOverdue(),
                                   'is_returned' => $item->isReturned(),
                                   'overdue_days' => $item->getOverdueDays()
                               ]);
                });

            return response()->json([
                'success' => true,
                'message' => 'Data peminjaman kendaraan berhasil diambil',
                'data' => $pinjam
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data peminjaman kendaraan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

   public function updateKendaraanStatus(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID',
            'status' => 'required|string|in:Maintenance,Stand by',
            'reason' => 'required_if:status,Maintenance|nullable|string|max:500'
        ], [
            'kendaraanID.required' => 'ID Kendaraan wajib diisi',
            'kendaraanID.exists' => 'Kendaraan tidak ditemukan',
            'status.required' => 'Status wajib diisi',
            'status.in' => 'Status harus berupa: Maintenance atau Stand by',
            'reason.required_if' => 'Alasan maintenance wajib diisi'
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                $kendaraan = Kendaraan::find($validated['kendaraanID']);
                $hasActiveBorrow = Pinjam::where('kendaraanID', $validated['kendaraanID'])
                                        ->active()
                                        ->exists();
                
                if ($hasActiveBorrow && $validated['status'] === 'Maintenance') {
                    throw new Exception('Tidak dapat mengubah ke maintenance. Kendaraan sedang dipinjam. Kembalikan kendaraan terlebih dahulu.');
                }

                if ($hasActiveBorrow && $validated['status'] === 'Stand by') {
                    throw new Exception('Kendaraan sedang dipinjam. Status akan otomatis berubah saat dikembalikan.');
                }

                $kendaraan->update([
                    'statKendaraan' => $validated['status'],
                ]);

                $message = $validated['status'] === 'Maintenance' 
                    ? 'Kendaraan berhasil diset ke status maintenance'
                    : 'Status kendaraan berhasil dikembalikan ke Stand by';

                return response()->json([
                    'success' => true,
                    'message' => $message,
                    'data' => $kendaraan
                ]);
            });

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate status kendaraan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function generateReport(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'nullable|string|in:all,active,overdue,completed'
        ], [
            'start_date.required' => 'Tanggal mulai wajib diisi',
            'end_date.required' => 'Tanggal akhir wajib diisi',
            'end_date.after_or_equal' => 'Tanggal akhir harus setelah atau sama dengan tanggal mulai',
            'type.in' => 'Tipe laporan harus berupa: all, active, overdue, atau completed'
        ]);

        try {
            $query = Pinjam::with(['user', 'kendaraan'])
                ->whereBetween('tglPinjam', [$validated['start_date'], $validated['end_date']]);

            $type = $validated['type'] ?? 'all';
            $query->when($type === 'active', fn($q) => $q->active())
                  ->when($type === 'overdue', fn($q) => $q->overdue())
                  ->when($type === 'completed', fn($q) => $q->completed());

            $pinjam = $query->latest('tglPinjam')
                ->get()
                ->map(function ($item) {
                    $statusInfo = [
                        'is_active' => $item->isActive(),
                        'is_overdue' => $item->isOverdue(),
                        'is_returned' => $item->isReturned(),
                        'overdue_days' => $item->getOverdueDays()
                    ];

                    if ($item->isReturned()) {
                        $statusInfo['is_late_return'] = $item->isLateReturn();
                        $statusInfo['late_return_days'] = $item->getLateReturnDays();
                    }

                    return $item->setAttribute('duration_days', $item->getDurationInDays())
                                ->setAttribute('status_info', $statusInfo);
                });
            $summary = [
                'period' => [
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date']
                ],
                'total_peminjaman' => $pinjam->count(),
                'peminjaman_aktif' => $pinjam->where('status_info.is_active', true)->count(),
                'peminjaman_overdue' => $pinjam->where('status_info.is_overdue', true)->count(),
                'peminjaman_selesai' => $pinjam->where('status_info.is_returned', true)->count(),
                'pengembalian_terlambat' => $pinjam->where('status_info.is_late_return', true)->count(),
            ];
            $dataForPdf = [
                'title' => 'Laporan Peminjaman Kendaraan',
                'date' => date('d/m/Y'),
                'summary' => $summary,
                'details' => $pinjam
            ];

            $pdf = Pdf::loadView('reports.peminjaman_pdf', $dataForPdf);

            $fileName = 'laporan-peminjaman-' . $validated['start_date'] . '-sampai-' . $validated['end_date'] . '.pdf';

            return $pdf->download($fileName);

        } catch (Exception $e) {
                return response()->json([
                'success' => false,
                'message' => 'Gagal membuat laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function destroy(Pinjam $pinjam): JsonResponse
    {
        try {
            return DB::transaction(function () use ($pinjam) {
                if ($pinjam->isActive()) {
                    $pinjam->kendaraan->update(['statKendaraan' => 'Stand by']);
                }

                $pinjam->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Data peminjaman berhasil dihapus'
                ]);
            });

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function setMaintenance(Request $request, int $kendaraanId): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
            'estimated_completion' => 'nullable|date|after:today'
        ], [
            'reason.required' => 'Alasan maintenance wajib diisi',
            'reason.max' => 'Alasan maintenance maksimal 500 karakter',
            'estimated_completion.after' => 'Estimasi selesai harus setelah hari ini'
        ]);

        try {
            return DB::transaction(function () use ($validated, $kendaraanId) {
                $kendaraan = Kendaraan::find($kendaraanId);
                
                if (!$kendaraan) {
                    throw new Exception('Kendaraan tidak ditemukan.');
                }
                
                $hasActiveBorrow = Pinjam::where('kendaraanID', $kendaraanId)
                                        ->active()
                                        ->exists();
                
                if ($hasActiveBorrow) {
                    throw new Exception('Tidak dapat mengubah ke maintenance. Kendaraan sedang dipinjam. Kembalikan kendaraan terlebih dahulu.');
                }

                if ($kendaraan->statKendaraan === 'Maintenance') {
                    throw new Exception('Kendaraan sudah dalam status maintenance.');
                }

                $kendaraan->update([
                    'statKendaraan' => 'Maintenance',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Kendaraan berhasil diset ke status maintenance',
                    'data' => [
                        'kendaraan' => $kendaraan,
                        'maintenance_info' => [
                            'reason' => $validated['reason'],
                            'start_date' => now()->toDateString(),
                            'estimated_completion' => $validated['estimated_completion'] ?? null
                        ]
                    ]
                ]);
            });

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status kendaraan ke maintenance',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function completeMaintenance(Request $request, int $kendaraanId): JsonResponse
    {
        $validated = $request->validate([
            'completion_notes' => 'nullable|string|max:500',
            'maintenance_cost' => 'nullable|numeric|min:0'
        ], [
            'completion_notes.max' => 'Catatan penyelesaian maksimal 500 karakter',
            'maintenance_cost.numeric' => 'Biaya maintenance harus berupa angka',
            'maintenance_cost.min' => 'Biaya maintenance tidak boleh negatif'
        ]);

        try {
            return DB::transaction(function () use ($validated, $kendaraanId) {
                $kendaraan = Kendaraan::find($kendaraanId);
                
                if (!$kendaraan) {
                    throw new Exception('Kendaraan tidak ditemukan.');
                }

                if ($kendaraan->statKendaraan !== 'Maintenance') {
                    throw new Exception('Kendaraan tidak dalam status maintenance.');
                }

                $kendaraan->update([
                    'statKendaraan' => 'Stand by',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Maintenance berhasil diselesaikan. Kendaraan kembali tersedia untuk dipinjam.',
                    'data' => [
                        'kendaraan' => $kendaraan,
                        'maintenance_completion' => [
                            'completion_date' => now()->toDateString(),
                            'completion_notes' => $validated['completion_notes'] ?? null,
                            'maintenance_cost' => $validated['maintenance_cost'] ?? null
                        ]
                    ]
                ]);
            });

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyelesaikan maintenance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMaintenanceList(): JsonResponse
    {
        try {
            $kendaraan = Kendaraan::where('statKendaraan', 'Maintenance')
                ->with(['pinjam' => function($query) {
                    $query->latest('created_at')->limit(1);
                }])
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Daftar kendaraan maintenance berhasil diambil',
                'data' => $kendaraan
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil daftar kendaraan maintenance',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}