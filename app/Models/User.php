<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $tabel = 'users';
    protected $primaryKey = 'userID';
    protected $fillable = [
        'nama',
        'NIP',
        'email',
        'password',
        'jabatan',
        'unitKerja',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function pinjams()
    {
        return $this->hasMany (pinjam :: class, 'userID','userID');
    }

    public function isSuperAdmin()
    {
        return $this ->role === 'Super Admin';
    }

    public function isAdmin()
    {
        return $this ->role === 'Admin';
    }

    public function isUser()
    {
        return $this ->role === 'User';
    }

    public function hasAdminPrivileges()
    {
        return in_array ($this -> role, ['Super Admin', 'Admin', 'User']);
    }   
}