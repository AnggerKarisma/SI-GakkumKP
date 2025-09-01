<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Hanya user dengan hak akses admin yang boleh membuat akun baru.
        return $this->user() && $this->user()->hasAdminPrivileges();
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'NIP' => 'required|string|max:255|unique:users,NIP',
            'password' => 'required|string|min:6',
            'jabatan' => 'required|string|max:255',
            'unitKerja' => ['required', Rule::in(['Balai', 'Sekwil I / Palangka Raya', 'Sekwil II / Samarinda', 'Sekwil III / Pontianak'])],
            'role' => ['required', Rule::in(['Admin', 'User'])]
        ];
    }
}
