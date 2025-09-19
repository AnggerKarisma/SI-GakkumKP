<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pajak;
use App\Models\Kendaraan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Http\Requests\Tax\StoreTaxRequest;
use App\Http\Requests\Tax\UpdateTaxRequest;
use App\Http\Requests\Tax\BulkUpdateTaxRequest;

class TaxController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $currentUser = Auth::user();

        $query = Pajak::with('kendaraan:kendaraanID,merk,plat,jenisKendaraan,penanggungjawab');

        if ($currentUser->role !== 'Super Admin') {
            $query->whereHas('kendaraan', function ($q) use ($currentUser) {
                $q->where('unitKerja', $currentUser->unitKerja);
            });
        }

        $query->when($request->filled('status'), function ($q) use ($request) {
            return match ($request->status) {
                'expired' => $q->expired(),
                'expiring_soon' => $q->expiringSoon($request->get('days', 30)),
                default => $q,
            };
        });
        
        $query->when($request->filled('kendaraan_id'), function ($q) use ($request) {
            return $q->where('kendaraanID', $request->kendaraan_id);
        });

        $pajak = $query->get();
        
        return $this->jsonResponse('Data pajak berhasil diambil', $pajak);
    }

    public function store(StoreTaxRequest $request): JsonResponse
    {
        $this->authorize('create-tax', Pajak::class);
        
        $pajak = Pajak::updateOrCreate(
            ['kendaraanID' => $request->validated('kendaraanID')],
            $request->validated()
        );
        
        $message = $pajak->wasRecentlyCreated ? 'Pajak berhasil dibuat' : 'Pajak berhasil diperbarui';
        $statusCode = $pajak->wasRecentlyCreated ? 201 : 200;

        return $this->jsonResponse($message, $pajak, $statusCode);
    }

    public function show(Pajak $pajak): JsonResponse
    {
        $this->authorize('view-detail-tax', $pajak);

        return $this->jsonResponse('Detail pajak berhasil diambil', $pajak->load('kendaraan'));
    }

    public function update(UpdateTaxRequest $request, Pajak $pajak): JsonResponse
    {
        $this->authorize('update-tax', $pajak);

        $pajak->update($request->validated());

        return $this->jsonResponse('Pajak berhasil diperbarui', $pajak);
    }

    public function destroy(Pajak $pajak): JsonResponse
    {
        $this->authorize('delete-tax', $pajak);

        $pajak->delete();

        return $this->jsonResponse('Pajak berhasil dihapus');
    }

    public function getByKendaraan(Kendaraan $kendaraan): JsonResponse
    {
        // Menggunakan relasi untuk mengambil data pajak, lebih efisien.
        $pajak = $kendaraan->pajak()->firstOrFail();
        $this->authorize('view-detail-tax', $pajak);

        return $this->jsonResponse('Data pajak berhasil diambil', $pajak);
    }
    
    public function bulkUpdate(BulkUpdateTaxRequest $request): JsonResponse
    {
        $this->authorize('create', Pajak::class);

        $results = ['successful' => [], 'failed' => []];

        // Menggunakan DB::transaction() lebih aman dan bersih.
        DB::transaction(function () use ($request, &$results) {
            foreach ($request->validated('data') as $index => $item) {
                try {
                    $pajak = Pajak::updateOrCreate(['kendaraanID' => $item['kendaraanID']], $item);
                    $results['successful'][] = $pajak;
                } catch (Exception $e) {
                    $results['failed'][] = ['index' => $index, 'error' => $e->getMessage(), 'data' => $item];
                }
            }
        });

        $isSuccess = count($results['failed']) === 0;
        return $this->jsonResponse('Bulk update selesai', $results, 200, $isSuccess);
    }

    private function jsonResponse(string $message, $data = null, int $statusCode = 200, bool $success = true): JsonResponse
    {
        $response = [
            'success' => $success,
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $statusCode);
    }
}


