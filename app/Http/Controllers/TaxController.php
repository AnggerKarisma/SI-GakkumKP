<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pajak;
use App\Models\Kendaraan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Exception;
// Menggunakan Form Requests untuk validasi yang bersih
use App\Http\Requests\Tax\StoreTaxRequest;
use App\Http\Requests\Tax\UpdateTaxRequest;
use App\Http\Requests\Tax\BulkUpdateTaxRequest;

class TaxController extends Controller
{
    // Tanpa constructor, otorisasi akan dipanggil manual di setiap metode.

    /**
     * Menampilkan daftar data pajak dengan berbagai filter.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Pajak::class);

        $query = Pajak::with('kendaraan:kendaraanID,namaKendaraan,plat,unitKerja');

        if ($request->filled('status')) {
            switch ($request->status) {
                case 'expired_stnk': $query->expiredStnk(); break;
                case 'expired_pt': $query->expiredPt(); break;
                case 'expiring_soon': $query->expiringSoon($request->get('days', 30)); break;
                case 'expired_all': $query->where(fn($q) => $q->expiredStnk()->orWhere->expiredPt()); break;
            }
        }
        
        if ($request->has('kendaraan_id')) {
            $query->where('kendaraanID', $request->kendaraan_id);
        }

        $pajak = $query->paginate($request->get('per_page', 15));
        
        return response()->json(['success' => true, 'message' => 'Data pajak berhasil diambil', 'data' => $pajak]);
    }

    /**
     * Menyimpan data pajak baru atau memperbaruinya.
     */
    public function store(StoreTaxRequest $request): JsonResponse
    {
        $this->authorize('create', Pajak::class);
        
        $validatedData = $request->validated();
        
        $pajak = Pajak::updateOrCreate(
            ['kendaraanID' => $validatedData['kendaraanID']],
            $validatedData
        );
        
        return response()->json([
            'success' => true,
            'message' => $pajak->wasRecentlyCreated ? 'Pajak berhasil dibuat' : 'Pajak berhasil diperbarui',
            'data' => $pajak
        ], $pajak->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Menampilkan detail satu data pajak.
     */
    public function show(Pajak $pajak): JsonResponse
    {
        $this->authorize('view', $pajak);

        return response()->json(['success' => true, 'data' => $pajak->load('kendaraan')]);
    }

    /**
     * Memperbarui data pajak yang sudah ada.
     */
    public function update(UpdateTaxRequest $request, Pajak $pajak): JsonResponse
    {
        $this->authorize('update', $pajak);

        $pajak->update($request->validated());

        return response()->json(['success' => true, 'message' => 'Pajak berhasil diperbarui', 'data' => $pajak]);
    }

    /**
     * Menghapus data pajak.
     */
    public function destroy(Pajak $pajak): JsonResponse
    {
        $this->authorize('delete', $pajak);

        $pajak->delete();

        return response()->json(['success' => true, 'message' => 'Pajak berhasil dihapus']);
    }

    /**
     * Mendapatkan data pajak berdasarkan Kendaraan.
     */
    public function getByKendaraan(Kendaraan $kendaraan): JsonResponse
    {
        $pajak = Pajak::where('kendaraanID', $kendaraan->kendaraanID)->firstOrFail();
        $this->authorize('view', $pajak);
        return response()->json(['success' => true, 'data' => $pajak]);
    }
    
    /**
     * Melakukan update/create data pajak secara massal.
     */
    public function bulkUpdate(BulkUpdateTaxRequest $request): JsonResponse
    {
        $this->authorize('create', Pajak::class);

        $results = [];
        $errors = [];
        
        DB::beginTransaction();
        try {
            foreach ($request->validated('data') as $index => $item) {
                try {
                    $pajak = Pajak::updateOrCreate(['kendaraanID' => $item['kendaraanID']], $item);
                    $results[] = $pajak;
                } catch (Exception $e) {
                    $errors[] = ['index' => $index, 'error' => $e->getMessage(), 'data' => $item];
                }
            }
            DB::commit();

            return response()->json([
                'success' => count($errors) === 0,
                'message' => 'Bulk update selesai',
                'data' => [
                    'successful' => $results,
                    'failed' => $errors,
                ]
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Bulk update gagal total.', 'error' => $e->getMessage()], 500);
        }
    }
}

