<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Pinjam extends Model
{
    use HasFactory;

    // --- BAGIAN INI TIDAK BERUBAH DARI VERSI LAMA ---
    protected $table = 'pinjam';
    protected $primaryKey = 'pinjamID';

    protected $fillable = [
        'userID',
        'kendaraanID',
        'tglPinjam',
        'tglJatuhTempo',     
        'tglKembaliAktual',  
        'keterangan',
    ];

    protected $casts = [
        'tglPinjam' => 'date',
        'tglJatuhTempo' => 'date',
        'tglKembaliAktual' => 'date',
    ];

    protected $appends = ['status_info', 'duration_days'];


    public function user()
    {
        return $this->belongsTo(User::class, 'userID', 'userID');
    }

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraanID', 'kendaraanID');
    }

    protected function statusInfo(): Attribute
    {
        return Attribute::make(get: function () {
            $info = [
                'is_active' => $this->isActive(),
                'is_overdue' => $this->isOverdue(),
                'is_returned' => $this->isReturned(),
                'overdue_days' => $this->getOverdueDays()
            ];

            if ($info['is_returned']) {
                $info['is_late_return'] = $this->isLateReturn();
                $info['late_return_days'] = $this->getLateReturnDays();
            }
            
            return $info;
        });
    }


    protected function durationDays(): Attribute
    {
        return Attribute::make(get: fn () => $this->getDurationInDays());
    }
    
    public function isActive()
    {
        return $this->tglPinjam <= now() && $this->tglKembaliAktual === null;
    }

    public function isOverdue()
    {
        return $this->tglJatuhTempo && 
            $this->tglJatuhTempo < now() && 
            $this->tglKembaliAktual === null;
    }

    public function isReturned()
    {
        return $this->tglKembaliAktual !== null;
    }

    public function isLateReturn()
    {
        return $this->tglKembaliAktual !== null && 
            $this->tglJatuhTempo !== null &&
            $this->tglKembaliAktual > $this->tglJatuhTempo;
    }

    public function getDurationInDays()
    {
         if ($this->tglPinjam && $this->tglKembaliAktual) {
            return $this->tglPinjam->diffInDays($this->tglKembaliAktual);
        }
    
        if ($this->tglPinjam) {
            return $this->tglPinjam->diffInDays(now());
        }
        return 0;
    }

    public function getOverdueDays()
    {
       if (!$this->tglJatuhTempo || !$this->isOverdue()) {
            return 0;
        }
        return $this->tglJatuhTempo->diffInDays(now());
    }

    public function getLateReturnDays()
    {
        if (!$this->tglJatuhTempo || !$this->tglKembaliAktual || !$this->isLateReturn()) {
            return 0;
        }
        return $this->tglJatuhTempo->diffInDays($this->tglKembaliAktual);
    }
    
    public function scopeActive($query)
    {
        return $query->where('tglPinjam', '<=', now())
                    ->whereNull('tglKembaliAktual');
    }

    public function scopeOverdue($query)
    {
        return $query->where('tglJatuhTempo', '<', now())
                    ->whereNull('tglKembaliAktual');
    }

    public function scopeCompleted($query)
    {
        return $query->whereNotNull('tglKembaliAktual');
    }

    public function scopeLateReturned($query)
    {
        return $query->whereNotNull('tglKembaliAktual')
                    ->whereColumn('tglKembaliAktual', '>', 'tglJatuhTempo');
    }

    public function scopeByUser($query, $userID)
    {
        return $query->where('userID', $userID);
    }

    public function scopeByKendaraan($query, $kendaraanID)
    {
        return $query->where('kendaraanID', $kendaraanID);
    }
}

