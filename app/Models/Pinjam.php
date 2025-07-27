<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Pinjam extends Model
{
    use HasFactory;

    protected $table = 'pinjam';
    protected $primaryKey = 'pinjamID';

    protected $fillable = [
        'userID',
        'kendaraanID',
        'tglPinjam',
        'tglKembali',
    ];

    protected $casts = [
        'tglPinjam' => 'date',
        'tglKembali' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userID','userID');
    }

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraanID','kendaraanID');
    }

    public function isActive()
    {
        return $this -> tglPinjam <= now() &&
            ($this -> tglKembali !== null || $this ->tglKembali>=now());
    }

    public function isOverdue()
    {
        return $this -> tglKembali !== null && $this->tglKembali < now() && $this ->isActive();
    }

    public function isReturned()
    {
        return $this->tglKembali !== null && $this ->tglKembali < now();
    }

    public function getDurationInDays()
    {
        if($this -> tglPinjam && $this->tglKembali){
            return $this -> tglPinjam->diffInDays($this ->tglKembali);
        }
        if($this -> tglPinjam){
            return $this->tglPinjam->diffInDays(now());
        }
        return 0;
    }

    public function scopeActive($query)
    {
        return $query->where('tglPinjam', '<=',now())
            ->where (function($q){
                $q->whereNull('tglKembali') ->orWhere('tglKembali','>=',now());
            });
    }

    public function scopeOverdue($query)
    {
        return $query->whereNotNull('tglKembali') ->where('tglKembali','<', now())
            ->active();
    }

    public function scopeCompleted($query)
    {
        return $query ->whereNotNull('tglKembali')
            ->where ('tglKembali','<',now());
    }

    public function scopeByUser($query,$userID)
    {
        return $query->where('userID',$userID);
    }

    public function scopeByKendaraan($query,$kendaraanID)
    {
        return $query->where('kendaraanID',$kendaraanID);
    }
}
