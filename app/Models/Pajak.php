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
        'activeSTNK',
        'activePT',
    ];

    protected $casts = [
        'activeSTNK' => 'date',
        'activePT' => 'date',
    ];

    public function kendaraan()
    {
        return $this-> belongsTo (Kendaraan::class, 'kendaraanID','kendaraanID');
    }

    public function isStnkExpired()
    {
        return $this->activeSTNK !== null && $this ->activeSTNK < now();
    }

    public function isStnkExpiringSoon($days = 30)
    {
        return $this ->activeSTNK !== null &&
            $this ->activeSTNK->diffInDays(now()) <= $days &&
            $this ->activeSTNK >= now();
    }

    public function isPtExpired()
    {
        return $this->activePT !== null && $this-> activePT < now();
    }

    public function isPtExpiringSoon($days=30)
    {
        return $this->activePT !== null && 
            $this->activePT ->diffInDays(now()) <= $days &&
            $this->activePT ->now();
    }

    public function getDaysUntilStnkExpires()
    {
        if($this->activeSTNK === null){
            return null;
        }
        return now()->diffInDays($this->activeSTNK, false);
    }

    public function scopeExpiredStnk($query)
    {
        return $query->whereNotNull('activeSTNK')
            ->where('activeSTNK','<', now());
    }

    public function scopeExpiredPt($query)
    {
        return $query->whereNotNull('activePT')
            ->where('activePT','<',now());
    }

    public function scopeExpiringSoon($query, $days=30)
    {
        return $query->whereNotNull ('activePT')-> whereBetween('activePT',[now(), now()->addDays($days)]);
    }

    public function getTaxStatus()
    {
        $status = [
            'stnk'=>'valid',
            'pt' => 'valid'
        ];

        if($this->isStnkExpired()){
            $status['stnk'] = 'expaired';
        } elseif ($this->isStnkExpiringSoon()){
            $status ['stnk'] = 'expiring_soon';
        }
        return $status;
    }
}

