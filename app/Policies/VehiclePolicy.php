<?php

namespace App\Policies;

use App\Models\Kendaraan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class VehiclePolicy
{
    /**
     * Otorisasi untuk melihat detail kendaraan.
     */
    public function view(User $user, Kendaraan $kendaraan): bool
    {
        // User boleh melihat jika dia Super Admin, dari Balai, atau dari unit kerja yang sama dengan kendaraan.
        return $user->isSuperAdmin() 
            || $user->unitKerja === $kendaraan->unitKerja;
    }

    /**
     * Otorisasi untuk memperbarui kendaraan.
     */
    public function update(User $user, Kendaraan $kendaraan): bool
    {
        // Super Admin boleh mengedit apa saja.
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Admin hanya boleh mengedit kendaraan di unit kerjanya sendiri.
        if ($user->isAdmin() && $user->unitKerja === $kendaraan->unitKerja) {
            return true;
        }

        return false;
    }

    /**
     * Otorisasi untuk menghapus kendaraan.
     */
    public function delete(User $user, Kendaraan $kendaraan): bool
    {
        // Logikanya sama dengan update.
        return $this->update($user, $kendaraan);
    }
}
