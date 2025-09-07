<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Pajak extends Model
{
    use HasFactory;

    protected $table = 'pajak';
    protected $primaryKey = 'pajakID';

    protected $fillable = [
        'kendaraanID',
        'nostnk',
        'alamat',
        'biaya',
        'tahunPembuatan',
        'silinder',
        'warnaKB',
        'noRangka',
        'noMesin',
        'noBPKB',
        'warnaTNKB',
        'bahanBakar',
        'tahunRegistrasi',
        'berlakuSampai',
    ];

    protected $casts = [
        'biaya' => 'decimal:2',
        'berlakuSampai' => 'date',
        'tahunPembuatan' => 'integer',
        'tahunRegistrasi' => 'integer',
    ];

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraanID', 'kendaraanID');
    }

    // --- LOGIKA UNTUK JATUH TEMPO PAJAK ---

    public function isExpired(): bool
    {
        return $this->berlakuSampai && $this->berlakuSampai < now();
    }

    public function isExpiringSoon(int $days = 30): bool
    {
        return $this->berlakuSampai &&
            $this->berlakuSampai >= now() &&
            $this->berlakuSampai <= now()->addDays($days);
    }

    // --- QUERY SCOPES (untuk digunakan di Controller) ---

    public function scopeExpired($query)
    {
        return $query->where('berlakuSampai', '<', now());
    }
    
    /**
     * Scope untuk memfilter pajak yang akan kedaluwarsa.
     */
    public function scopeExpiringSoon($query, int $days = 30)
    {
        $targetDate = now()->addDays($days);
        return $query->whereBetween('berlakuSampai', [now(), $targetDate]);
    }

    public function getTaxStatus()
    {
        $status = [
            'stnk'=>'valid',
        ];

        if($this->isExpired()){
            $status['stnk'] = 'expired';
        } elseif ($this->isExpiringSoon()){
            $status ['stnk'] = 'expiring_soon';
        }
        return $status;
    }
}

