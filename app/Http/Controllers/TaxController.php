<?php

namespace App\Http\Controllers;

use App\Models\Pajak;
use App\Models\Kendaraan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Exception;

class TaxController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Pajak::with('kendaraan');

            if ($request->has('status')) {
                switch ($request->status) {
                    case 'expired_stnk':
                        $query->expiredStnk();
                        break;
                    case 'expired_pt':
                        $query->expiredPt();
                        break;
                    case 'expiring_soon':
                        $days = $request->get('days', 30);
                        $query->expiringSoon($days);
                        break;
                }
            }

            if ($request->has('kendaraan_id')) {
                $query->where('kendaraanID', $request->kendaraan_id);
            }

            $perPage = $request->get('per_page', 15);
            $pajak = $query->paginate($perPage);

            $pajak->getCollection()->transform(function ($item) {
                $item->status = $item->getTaxStatus();
                $item->days_until_stnk_expires = $item->getDaysUntilStnkExpires();
                return $item;
            });

            return response()->json([
                'success' => true,
                'message' => 'Data pajak berhasil diambil',
                'data' => $pajak
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pajak',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID',
            'nostnk' => 'required|string|max:255',
            'activeSTNK' => 'required|date|after_or_equal:today',
            'activePT' => 'required|date|after_or_equal:today',
        ], [
            'kendaraanID.required' => 'ID Kendaraan wajib diisi',
            'kendaraanID.exists' => 'Kendaraan tidak ditemukan',
            'nostnk.required' => 'Nomor STNK wajib diisi',
            'activeSTNK.required' => 'Tanggal aktif STNK wajib diisi',
            'activeSTNK.after_or_equal' => 'Tanggal aktif STNK tidak boleh di masa lalu',
            'activePT.required' => 'Tanggal aktif PT wajib diisi',
            'activePT.after_or_equal' => 'Tanggal aktif PT tidak boleh di masa lalu',
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

            $pajak = Pajak::updateOrCreate(
                ['kendaraanID' => $request->kendaraanID],
                [
                    'nostnk' => $request->nostnk,
                    'activeSTNK' => $request->activeSTNK,
                    'activePT' => $request->activePT,
                ]
            );

            $pajak->load('kendaraan');

            $pajak->status = $pajak->getTaxStatus();
            $pajak->days_until_stnk_expires = $pajak->getDaysUntilStnkExpires();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $pajak->wasRecentlyCreated ? 'Pajak berhasil dibuat' : 'Pajak berhasil diperbarui',
                'data' => $pajak
            ], $pajak->wasRecentlyCreated ? 201 : 200);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data pajak',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $pajak = Pajak::with('kendaraan')->findOrFail($id);
            
            $pajak->status = $pajak->getTaxStatus();
            $pajak->days_until_stnk_expires = $pajak->getDaysUntilStnkExpires();

            return response()->json([
                'success' => true,
                'message' => 'Data pajak berhasil diambil',
                'data' => $pajak
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pajak tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'kendaraanID' => 'sometimes|integer|exists:kendaraan,kendaraanID',
            'nostnk' => 'sometimes|string|max:255',
            'activeSTNK' => 'sometimes|date|after_or_equal:today',
            'activePT' => 'sometimes|date|after_or_equal:today',
        ], [
            'kendaraanID.exists' => 'Kendaraan tidak ditemukan',
            'activeSTNK.after_or_equal' => 'Tanggal aktif STNK tidak boleh di masa lalu',
            'activePT.after_or_equal' => 'Tanggal aktif PT tidak boleh di masa lalu',
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

            $pajak = Pajak::findOrFail($id);

            if ($request->has('kendaraanID') && $request->kendaraanID != $pajak->kendaraanID) {
                $kendaraan = Kendaraan::find($request->kendaraanID);
                if (!$kendaraan) {
                    throw new Exception('Kendaraan tidak ditemukan.');
                }
            }
            $pajak->update($request->only(['kendaraanID', 'nostnk', 'activeSTNK', 'activePT']));
            
            $pajak->load('kendaraan');

            $pajak->status = $pajak->getTaxStatus();
            $pajak->days_until_stnk_expires = $pajak->getDaysUntilStnkExpires();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pajak berhasil diperbarui',
                'data' => $pajak
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data pajak',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $pajak = Pajak::findOrFail($id);
            $pajak->delete();

            return response()->json([
                'success' => true,
                'message' => 'Pajak berhasil dihapus'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data pajak',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByKendaraan(int $kendaraanId): JsonResponse
    {
        try {
            $pajak = Pajak::with('kendaraan')
                ->where('kendaraanID', $kendaraanId)
                ->first();

            if (!$pajak) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pajak untuk kendaraan ini tidak ditemukan'
                ], 404);
            }
            $pajak->status = $pajak->getTaxStatus();
            $pajak->days_until_stnk_expires = $pajak->getDaysUntilStnkExpires();

            return response()->json([
                'success' => true,
                'message' => 'Data pajak berhasil diambil',
                'data' => $pajak
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pajak',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getExpired(Request $request): JsonResponse
    {
        try {
            $type = $request->get('type', 'both'); 
            $query = Pajak::with('kendaraan');

            switch ($type) {
                case 'stnk':
                    $query->expiredStnk();
                    break;
                case 'pt':
                    $query->expiredPt();
                    break;
                default:
                    $query->where(function ($q) {
                        $q->expiredStnk()->orWhere(function ($subQ) {
                            $subQ->expiredPt();
                        });
                    });
            }

            $pajak = $query->get();

            $pajak->transform(function ($item) {
                $item->status = $item->getTaxStatus();
                $item->days_until_stnk_expires = $item->getDaysUntilStnkExpires();
                return $item;
            });

            return response()->json([
                'success' => true,
                'message' => 'Data pajak kadaluarsa berhasil diambil',
                'data' => $pajak
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pajak kadaluarsa',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getExpiringSoon(Request $request): JsonResponse
    {
        try {
            $days = $request->get('days', 30);
            
            $pajak = Pajak::with('kendaraan')
                ->expiringSoon($days)
                ->get();

            $pajak->transform(function ($item) {
                $item->status = $item->getTaxStatus();
                $item->days_until_stnk_expires = $item->getDaysUntilStnkExpires();
                return $item;
            });

            return response()->json([
                'success' => true,
                'message' => "Data pajak yang akan kadaluarsa dalam {$days} hari berhasil diambil",
                'data' => $pajak
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pajak yang akan kadaluarsa',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|array',
            'data.*.kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID',
            'data.*.nostnk' => 'required|string|max:255',
            'data.*.activeSTNK' => 'required|date|after_or_equal:today',
            'data.*.activePT' => 'required|date|after_or_equal:today',
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

            $results = [];
            $errors = [];

            foreach ($request->data as $index => $item) {
                try {
                    $kendaraan = Kendaraan::find($item['kendaraanID']);
                    if (!$kendaraan) {
                        throw new Exception("Kendaraan dengan ID {$item['kendaraanID']} tidak ditemukan.");
                    }

                    $pajak = Pajak::updateOrCreate(
                        ['kendaraanID' => $item['kendaraanID']],
                        [
                            'nostnk' => $item['nostnk'],
                            'activeSTNK' => $item['activeSTNK'],
                            'activePT' => $item['activePT'],
                        ]
                    );

                    $pajak->load('kendaraan');
                    $pajak->status = $pajak->getTaxStatus();
                    $results[] = $pajak;

                } catch (Exception $e) {
                    $errors[] = [
                        'index' => $index,
                        'error' => $e->getMessage(),
                        'data' => $item
                    ];
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Bulk update selesai',
                'data' => [
                    'successful' => $results,
                    'failed' => $errors,
                    'total_processed' => count($request->data),
                    'successful_count' => count($results),
                    'failed_count' => count($errors)
                ]
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Bulk update gagal',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}