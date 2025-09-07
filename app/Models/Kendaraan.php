<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasFactory;
    
    protected $table = 'kendaraan';
    protected $primaryKey = 'kendaraanID';

    protected $fillable = [
        'namaKendaraan',
        'plat',
        'pemilik',
        'merk',
        'model',
        'jenisKendaraan',
        'penanggungjawab',
        'NUP',
        'unitKerja',
        'statKendaraan',
        'kondisi',
    ];
    

    public function pinjam()
    {
        return $this->hasMany(Pinjam::class, 'kendaraanID', 'kendaraanID');
    }

    public function pajak()
    {
        return $this->hasOne(Pajak::class, 'kendaraanID', 'kendaraanID');
    }

    public function isAvailable(): bool
    {
        return $this->statKendaraan === 'Stand by';
    }

    public function isNotAvailable(): bool
    {
        return $this->statKendaraan === 'Not Available';
    }

    public function isMaintenance(): bool
    {
        return $this->statKendaraan === 'Maintenance';
    }

    public function scopeByUnitKerja($query, $unitKerja)
    {
        return $query->where('unitKerja', $unitKerja);
    }

    public function scopeByJenisKendaraan($query, $jenis)
    {
        return $query->where('jenisKendaraan', $jenis);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('statKendaraan', $status);
    }

    public function currentBorrowing()
    {
        return $this->pinjams()->whereNull('tglKembaliAktual')->first();
    }

    public function isTaxExpired(): bool
    {
        return $this->pajak?->isExpired() ?? false;
    }
}
