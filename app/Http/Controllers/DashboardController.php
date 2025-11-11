<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Models\Pinjam;
use App\Models\Pajak;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function getDashboardStats()
    {
        $user = Auth::user();

        $unitKerjaFilter = ($user->role !== 'Super Admin') ? $user->unitKerja : null;

        // 1. Kueri untuk jumlah Kendaraan (Mobil & Motor) per unit kerja
        $vehicleQuery = Kendaraan::query();
        if ($unitKerjaFilter) {
            $vehicleQuery->where('unitKerja', 'LIKE', $unitKerjaFilter . '%');
        }
        $vehicleCounts = $vehicleQuery->select('jenisKendaraan', 'unitKerja', DB::raw('count(*) as total'))
            ->groupBy('jenisKendaraan', 'unitKerja')
            ->get();

        // 2. Kueri untuk jumlah Akun per unit kerja
        $userQuery = User::query();
        if ($unitKerjaFilter) {
            $userQuery->where('unitKerja', 'LIKE', $unitKerjaFilter . '%');
        }
        $userCounts = $userQuery->select('unitKerja', DB::raw('count(*) as total'))
            ->groupBy('unitKerja')
            ->get();
        
        // 3. Kueri untuk status kendaraan (Tersedia, Dipinjam, Rusak) per jenis
        $statusQuery = Kendaraan::query();
        if ($unitKerjaFilter) {
            $statusQuery->where('unitKerja', 'LIKE', $unitKerjaFilter . '%');
        }
        $statusCounts = $statusQuery->select('jenisKendaraan', 'statKendaraan', DB::raw('count(*) as total'))
            ->groupBy('jenisKendaraan', 'statKendaraan')
            ->get();

        // 4. Kueri untuk data Pajak yang akan jatuh tempo
        $expiringTaxes = $this->getExpiringTaxes($unitKerjaFilter);
        $expiredTaxes = $this->getExpiredTaxes($unitKerjaFilter);

        return response()->json([
            'success' => true,
            'data' => [
                'vehicle_counts' => $this->formatCounts($vehicleCounts, 'jenisKendaraan', 'unitKerja'),
                'user_counts' => $this->formatCounts($userCounts, null, 'unitKerja'),
                'status_counts' => $this->formatStatusCounts($statusCounts),
                'expiring_taxes' => $expiringTaxes,
                'expired_taxes' => $expiredTaxes,
            ]
        ]);
    }

    // Helper untuk memformat data hitungan
    private function formatCounts($collection, $primaryKey, $secondaryKey)
    {
        $result = [];
        foreach ($collection as $item) {
            $unit = explode(' / ', $item->$secondaryKey)[0]; // Ambil nama unit kerja saja
            if ($primaryKey) {
                $result[$item->$primaryKey][$unit] = $item->total;
            } else {
                $result[$unit] = $item->total;
            }
        }

        // Hitung total untuk setiap grup
        foreach ($result as $key => &$group) {
            if (is_array($group)) {
                $group['Total'] = array_sum($group);
            }
        }
        if (!$primaryKey) {
            $result['Total'] = array_sum($result);
        }

        return $result;
    }
    
    // Helper untuk memformat data status
    private function formatStatusCounts($collection)
    {
        $result = ['mobil' => [], 'motor' => []];
        foreach ($collection as $item) {
            $result[$item->jenisKendaraan][$item->statKendaraan] = $item->total;
        }
        return $result;
    }

    // Helper untuk data pajak (tidak berubah)
    private function getExpiringTaxes($unitKerjaFilter)
    {
        $query = Pajak::with('kendaraan:kendaraanID,merk,plat')
                  ->where('berlakuSampai', '>=', now())
                  ->where('berlakuSampai', '<=', now()->addDays(30))
                  ->orderBy('berlakuSampai', 'asc');

        if ($unitKerjaFilter) {
            $query->whereHas('kendaraan', function($q) use ($unitKerjaFilter) {
                $q->where('unitKerja', 'LIKE', $unitKerjaFilter . '%');
            });
        }
        
        return $query->get(['kendaraanID', 'berlakuSampai']);
    }

    private function getExpiredTaxes($unitKerjaFilter)
    {
        $query = Pajak::with('kendaraan:kendaraanID,merk,plat')
                      ->where('berlakuSampai', '<', now())
                      ->orderBy('berlakuSampai', 'asc');
        
        if ($unitKerjaFilter) {
            $query->whereHas('kendaraan', function($q) use ($unitKerjaFilter) {
                $q->where('unitKerja', 'LIKE', $unitKerjaFilter . '%');
            });
        }
        
        return $query->get(['kendaraanID', 'berlakuSampai']);
    }
}

