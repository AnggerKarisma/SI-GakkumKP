<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pinjam;
use App\Models\User;
use App\Models\Kendaraan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Exception;

// Menggunakan Form Requests untuk validasi dan beberapa otorisasi
use App\Http\Requests\Pinjam\StoreBorrowRequest;
use App\Http\Requests\Pinjam\ReturnBorrowRequest;
use App\Http\Requests\Pinjam\GenerateReportRequest;

class BorrowController extends Controller
{
    /**
     * Menampilkan daftar data peminjaman.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Pinjam::class);
        $user = $request->user();

        $query = Pinjam::with(['user:userID,nama,NIP', 'kendaraan:kendaraanID,namaKendaraan,plat']);

        // Jika user biasa, hanya tampilkan data miliknya.
        if ($user->isUser()) {
            $query->where('userID', $user->userID);
        }

        if ($request->filled('status')) {
            $query->when($request->status === 'active', fn($q) => $q->active())
                  ->when($request->status === 'overdue', fn($q) => $q->overdue())
                  ->when($request->status === 'completed', fn($q) => $q->completed());
        }

        $pinjaman = $query->latest('tglPinjam')->paginate($request->get('per_page', 15));

        return response()->json(['success' => true, 'data' => $pinjaman]);
    }

    /**
     * Menyimpan data peminjaman baru.
     */
    public function store(StoreBorrowRequest $request): JsonResponse
    {
        $kendaraan = Kendaraan::find($request->validated('kendaraanID'));
        $this->authorize('create', [Pinjam::class, $kendaraan]);

        $pinjam = DB::transaction(function () use ($request, $kendaraan) {
            $newPinjam = Pinjam::create(array_merge(
                $request->validated(),
                ['userID' => $request->user()->userID]
            ));
            
            $kendaraan->update(['statKendaraan' => 'Not Available']);
            
            return $newPinjam;
        });

        return response()->json([
            'success' => true,
            'message' => 'Peminjaman berhasil dibuat',
            'data' => $pinjam->load(['user', 'kendaraan'])
        ], 201);
    }

    /**
     * Menampilkan detail satu data peminjaman.
     */
    public function show(Pinjam $pinjam): JsonResponse
    {
        $this->authorize('view', $pinjam);
        return response()->json(['success' => true, 'data' => $pinjam->load(['user', 'kendaraan'])]);
    }

    /**
     * Memproses pengembalian kendaraan.
     */
    public function returnVehicle(ReturnBorrowRequest $request, Pinjam $pinjam): JsonResponse
    {
        $this->authorize('returnVehicle', $pinjam);

        DB::transaction(function () use ($request, $pinjam) {
            $pinjam->update($request->validated());
            $pinjam->kendaraan->update(['statKendaraan' => 'Stand by']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Kendaraan berhasil dikembalikan',
            'data' => $pinjam
        ]);
    }
    
    /**
     * Menghapus data peminjaman.
     */
    public function destroy(Pinjam $pinjam): JsonResponse
    {
        $this->authorize('delete', $pinjam);

        DB::transaction(function () use ($pinjam) {
            if ($pinjam->isActive()) {
                $pinjam->kendaraan->update(['statKendaraan' => 'Stand by']);
            }
            $pinjam->delete();
        });

        return response()->json(['success' => true, 'message' => 'Data peminjaman berhasil dihapus']);
    }

    /**
     * Menampilkan statistik peminjaman.
     */
    public function getStatistics(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Pinjam::class); // Hanya admin yang boleh lihat statistik

        $query = Pinjam::query();
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tglPinjam', [$request->start_date, $request->end_date]);
        }

        $peminjamanSelesaiQuery = (clone $query)->completed();
        
        $stats = [
            'total_peminjaman' => (clone $query)->count(),
            'peminjaman_aktif' => (clone $query)->active()->count(),
            'peminjaman_overdue' => (clone $query)->overdue()->count(),
            'peminjaman_selesai' => (clone $peminjamanSelesaiQuery)->count(),
            'pengembalian_terlambat' => (clone $peminjamanSelesaiQuery)->lateReturned()->count(),
        ];
        
        return response()->json(['success' => true, 'data' => $stats]);
    }

    /**
     * Membuat laporan peminjaman dalam rentang tanggal.
     */
    public function generateReport(GenerateReportRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Pinjam::class);
        $validated = $request->validated();
        
        $query = Pinjam::with(['user', 'kendaraan'])
            ->whereBetween('tglPinjam', [$validated['start_date'], $validated['end_date']]);
        
        if (isset($validated['type']) && $validated['type'] !== 'all') {
            $query->{$validated['type']}();
        }

        $reportData = $query->latest('tglPinjam')->get();

        return response()->json(['success' => true, 'data' => $reportData]);
    }
}
