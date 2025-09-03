<?php

namespace App\Policies;

use App\Models\Pajak;
use App\Models\User;

class TaxPolicy
{
    /**
     * Siapa yang boleh melihat daftar pajak atau melakukan aksi umum.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAdminPrivileges();
    }

    /**
     * Siapa yang boleh melihat detail pajak.
     */
    public function view(User $user, Pajak $pajak): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }
        return $user->unitKerja === optional($pajak->kendaraan)->unitKerja;
    }

    /**
     * Siapa yang boleh membuat data pajak.
     */
    public function create(User $user): bool
    {
        return $user->hasAdminPrivileges();
    }

    /**
     * Siapa yang boleh memperbarui data pajak.
     */
    public function update(User $user, Pajak $pajak): bool
    {
        return $this->view($user, $pajak); // Aturan sama dengan melihat
    }

    /**
     * Siapa yang boleh menghapus data pajak.
     */
    public function delete(User $user, Pajak $pajak): bool
    {
        return $this->update($user, $pajak); // Aturan sama dengan update
    }
}

