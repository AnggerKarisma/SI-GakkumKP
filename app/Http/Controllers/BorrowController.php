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
use TCPDF;

// Menggunakan Form Requests untuk validasi dan beberapa otorisasi
use App\Http\Requests\Borrow\StoreBorrowRequest;
use App\Http\Requests\Borrow\ReturnBorrowRequest;
use App\Http\Requests\Borrow\GenerateReportRequest;

class BorrowController extends Controller
{
    /**
     * Menampilkan daftar data peminjaman.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('get-borrow-index', Pinjam::class);
        $user = $request->user();

        $query = Pinjam::with(['user:userID,nama,NIP', 'kendaraan:kendaraanID,namaKendaraan,plat,unitKerja']);

        // Jika user biasa, hanya tampilkan data miliknya.
        if ($user->isUser()) {
            $query->where('userID', $user->userID);
        }

        if ($request->filled('status')) {
            $query->when($request->status === 'active', fn($q) => $q->active())
                  ->when($request->status === 'overdue', fn($q) => $q->overdue())
                  ->when($request->status === 'completed', fn($q) => $q->completed());
        }

        $pinjaman = $query->get();

        return response()->json(['success' => true, 'data' => $pinjaman]);
    }

    /**
     * Menyimpan data peminjaman baru.
     */
    public function store(StoreBorrowRequest $request): JsonResponse
    {
        $validatedData = $request->validated();
        $kendaraan = Kendaraan::find($validatedData['kendaraanID']);

        $this->authorize('borrow-vehicle', $kendaraan);

        $dataToCreate = array_merge(
            $validatedData,
            ['userID' => $request->user()->userID]
        );

        $pinjam = DB::transaction(function () use ($dataToCreate, $kendaraan) {
            $newPinjam = Pinjam::create($dataToCreate);
            
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
    public function returnVehicle(Request $request, Pinjam $pinjam): JsonResponse
    {
        $this->authorize('return', $pinjam);

        DB::transaction(function () use ($pinjam) {
            $pinjam->update(['tglKembaliAktual' => now()]);
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
        $this->authorize('get-borrow-index', Pinjam::class); // Hanya admin yang boleh lihat statistik

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
    public function generateReport(GenerateReportRequest $request)
    {
        try {
            $this->authorize('get-borrow-index', Pinjam::class);
            $validated = $request->validated();
            
            $query = Pinjam::with(['user', 'kendaraan'])
                ->whereBetween('tglPinjam', [$validated['start_date'], $validated['end_date']]);
            
            if (isset($validated['type']) && $validated['type'] !== 'all') {
                $query->{$validated['type']}();
            }

            $reportData = $query->latest('tglPinjam')->get();

            // Buat PDF
            $pdf = new TCPDF();
            $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
            $pdf->SetMargins(10, 15, 10);
            $pdf->SetCellPadding(1);
            $pdf->AddPage('L'); // Landscape
            $pdf->SetFont('helvetica', 'B', 13);
            $pdf->Cell(0, 10, 'Laporan Peminjaman Kendaraan', 0, 1, 'C');
            
            $pdf->SetFont('helvetica', '', 9);
            $pdf->Cell(0, 5, 'Periode: ' . $validated['start_date'] . ' s/d ' . $validated['end_date'], 0, 1, 'C');
            $pdf->Ln(3);

            // Definisi lebar kolom
            $colWidth = [
                'no' => 7,
                'nama_kendaraan' => 40,
                'plat' => 18,
                'unit_kerja' => 34,
                'peminjam' => 46,
                'tgl_pinjam' => 20,
                'tgl_jatuh_tempo' => 20,
                'tgl_kembali' => 20,
                'status' => 34
            ];
            
            $tableWidth = array_sum($colWidth);
            $pageWidth = $pdf->GetPageWidth();
            $startX = ($pageWidth - $tableWidth) / 2;

            // Header Tabel
            $pdf->SetX($startX);
            $pdf->SetFont('helvetica', 'B', 8);
            $pdf->SetFillColor(41, 84, 159);
            $pdf->SetTextColor(255, 255, 255);
            
            $pdf->Cell($colWidth['no'], 7, 'NO', 1, 0, 'C', true);
            $pdf->Cell($colWidth['nama_kendaraan'], 7, 'Nama Kendaraan', 1, 0, 'C', true);
            $pdf->Cell($colWidth['plat'], 7, 'Plat', 1, 0, 'C', true);
            $pdf->Cell($colWidth['unit_kerja'], 7, 'Unit Kerja', 1, 0, 'C', true);
            $pdf->Cell($colWidth['peminjam'], 7, 'Peminjam', 1, 0, 'C', true);
            $pdf->Cell($colWidth['tgl_pinjam'], 7, 'Tgl Pinjam', 1, 0, 'C', true);
            $pdf->Cell($colWidth['tgl_jatuh_tempo'], 7, 'Jatuh Tempo', 1, 0, 'C', true);
            $pdf->Cell($colWidth['tgl_kembali'], 7, 'Tgl Kembali', 1, 0, 'C', true);
            $pdf->Cell($colWidth['status'], 7, 'Status', 1, 1, 'C', true);

            // Data Tabel
            $pdf->SetFont('helvetica', '', 6.5);
            $pdf->SetTextColor(0, 0, 0);
            $no = 1;
            
            foreach ($reportData as $item) {
                $pdf->SetX($startX);
                
                // Tentukan status
                if ($item->isReturned()) {
                    $status = $item->isLateReturn() ? 'Terlambat' : 'Selesai';
                } elseif ($item->isOverdue()) {
                    $status = 'Belum Kembali (Terlambat)';
                } else {
                    $status = 'Aktif';
                }
                
                $pdf->Cell($colWidth['no'], 6, $no++, 1, 0, 'C');
                $pdf->Cell($colWidth['nama_kendaraan'], 6, $item->kendaraan->namaKendaraan ?? '-', 1, 0, 'L');
                $pdf->Cell($colWidth['plat'], 6, $item->kendaraan->plat ?? '-', 1, 0, 'C');
                $pdf->Cell($colWidth['unit_kerja'], 6, $item->kendaraan->unitKerja ?? '-', 1, 0, 'L');
                $pdf->Cell($colWidth['peminjam'], 6, $item->user->nama ?? '-', 1, 0, 'L');
                $pdf->Cell($colWidth['tgl_pinjam'], 6, date('d/m/Y', strtotime($item->tglPinjam)), 1, 0, 'C');
                $pdf->Cell($colWidth['tgl_jatuh_tempo'], 6, date('d/m/Y', strtotime($item->tglJatuhTempo)), 1, 0, 'C');
                $pdf->Cell($colWidth['tgl_kembali'], 6, $item->tglKembaliAktual ? date('d/m/Y', strtotime($item->tglKembaliAktual)) : '-', 1, 0, 'C');
                $pdf->Cell($colWidth['status'], 6, $status, 1, 1, 'C');
            }

            // Footer
            $pdf->Ln(5);
            $pdf->SetFont('helvetica', '', 8);
            $pdf->Cell(0, 5, 'Total Data: ' . count($reportData), 0, 1, 'L');
            $pdf->Cell(0, 5, 'Tanggal Cetak: ' . now()->format('d/m/Y H:i:s'), 0, 1, 'L');

            // Generate PDF content
            $pdfContent = $pdf->Output('', 'S');

            // Return as response
            return response($pdfContent, 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="laporan-peminjaman-' . now()->format('Y-m-d-His') . '.pdf"')
                ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');
        } catch (Exception $e) {
            \Log::error('Generate Report Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error generating report: ' . $e->getMessage()
            ], 500);
        }
    }
}
