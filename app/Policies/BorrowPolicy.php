<?php

namespace App\Policies;

use App\Models\Pinjam;
use App\Models\User;
use App\Models\Kendaraan;

class BorrowPolicy
{
    /**
     * Siapa yang boleh melihat daftar peminjaman.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Siapa yang boleh melihat detail satu peminjaman.
     */
    public function view(User $user, Pinjam $pinjam): bool
    {
        if ($user->hasAdminPrivileges()) {
            return true;
        }
        return $user->userID === $pinjam->userID; // User hanya boleh lihat miliknya.
    }

    /**
     * Siapa yang boleh membuat peminjaman baru.
     */
    // public function create(User $user, Kendaraan $kendaraan): bool
    // {
    //     if ($user->isSuperAdmin()) {
    //     return true;
    // }
    //     return $user->unitKerja === $kendaraan->unitKerja;
    // }

    /**
     * Siapa yang boleh memproses pengembalian kendaraan.
     */
    public function returnVehicle(User $user, Pinjam $pinjam): bool
    {
        return$user->userID === $pinjam->userID && !$pinjam->isReturned();
    }

    /**
     * Siapa yang boleh menghapus data peminjaman.
     */
    public function delete(User $user, Pinjam $pinjam): bool
    {
        // Hanya admin yang bisa menghapus.
        return $user->hasAdminPrivileges();
    }
}

