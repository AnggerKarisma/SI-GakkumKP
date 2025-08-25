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
        'alamat',
        'merk',
        'model',
        'jenisKendaraan',
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
        'biaya',
        'penanggungjawab',
        'NUP',
        'unitKerja',
        'statKendaraan',
        'Kkendaraan',
    ];
    
    protected $casts = [
        'tahunPembuatan' => 'integer',
        'berlakuSampai' => 'date',
        'tahunRegistrasi' => 'integer',
    ];

    public function pinjams()
    {
        return $this -> hasMany (Pinjam::class, 'kendaraanID','kendaraanID');
    }

    public function pajak()
    {
        return $this ->hasOne (Pajak::class, 'kendaraanID', 'kendaraanID');
    }

    public function isAvailable()
    {
        return $this -> statKendaraan === 'Stand by';
    }

    public function isNotAvailable()
    {
        return $this -> statKendaraan === 'Not Available';
    }

    public function isMaintenance() 
    {
        return $this -> statKendaraan === 'Maintenance';
    }

    public function scopeByUnitKerja($query,$unitKerja)
    {
        return $query->where('unitKerja', $unitKerja);
    }

    public function scopeByJenisKendaraan($query,$jenis)
    {
        return $query->where('jenisKendaraan', $jenis);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('statKendaraan',$status);
    }

    public function currentBorrowing()
    {
        return $this->pinjams() -> whereNull('tglKembaliAktual') ->first();
    }
}
