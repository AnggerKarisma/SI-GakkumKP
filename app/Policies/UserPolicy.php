<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Otorisasi untuk melihat daftar semua user.
     */
    public function viewAny(User $currentUser): bool
    {
        return $currentUser->hasAdminPrivileges();
    }

    /**
     * Otorisasi untuk memperbarui akun user lain.
     */
    public function update(User $currentUser, User $targetUser): bool
    {
        // 1. Tidak boleh mengedit diri sendiri melalui endpoint ini
        if ($currentUser->userID === $targetUser->userID) {
            return false;
        }

        // 2. Super Admin boleh mengedit siapa saja (selain dirinya sendiri)
        if ($currentUser->isSuperAdmin()) {
            return true;
        }

        // 3. Admin hanya boleh mengedit User, dan tidak boleh mengedit Admin lain atau Super Admin
        if ($currentUser->isAdmin() && $targetUser->isUser()) {
            return true;
        }

        return false;
    }

    /**
     * Otorisasi untuk menghapus akun user lain.
     */
    public function delete(User $currentUser, User $targetUser): bool
    {
        // Logika untuk menghapus sama dengan logika untuk update
        return $this->update($currentUser, $targetUser);
    }
}
