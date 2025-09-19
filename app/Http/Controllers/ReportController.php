<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Pinjam;
use App\Models\Kendaraan;

class ReportController extends Controller
{
    public function generateBorrowingReport(Request $request): JsonResponse
    {
        $user = Auth::user();

        $query = Pinjam::with(['user:userID,nama', 'kendaraan']);

        if ($user->role === 'Admin') {
            $vehicleIdsInUnit = Kendaraan::where('unitKerja', $user->unitKerja)->pluck('kendaraanID');
            $query->whereIn('kendaraanID', $vehicleIdsInUnit);
        } elseif ($user->role === 'User') {
            $query->where('userID', $user->userID);
        }

        $pinjaman = $query->latest('tglPinjam')->get();

        $reportData = $pinjaman->map(function ($item) {
            
            $status = 'Status Tidak Dikenal';
            if ($item->status_info['is_returned']) {
                $status = 'Dikembalikan';
            } elseif ($item->status_info['is_overdue']) {
                $status = 'Terlambat';
            } elseif ($item->status_info['is_active']) {
                $status = 'Dipinjam';
            }

            return [
                'nama_kendaraan' => $item->kendaraan->namaKendaraan,
                'plat' => $item->kendaraan->plat,
                'unit_kerja' => $item->kendaraan->unitKerja,
                'penanggung_jawab' => $item->kendaraan->penanggungjawab,
                'peminjam' => $item->user->nama,
                'tgl_pinjam' => $item->tglPinjam->format('Y-m-d'), 
                'tgl_jatuh_tempo' => $item->tglJatuhTempo->format('Y-m-d'),
                'tgl_kembali' => $item->tglKembaliAktual ? $item->tglKembaliAktual->format('Y-m-d') : null,
                'kondisi' => $item->kendaraan->kondisi,
                'status_pinjaman' => $status,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Data laporan berhasil diambil',
            'data' => $reportData
        ]);
    }
}
