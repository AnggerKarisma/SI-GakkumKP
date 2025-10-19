<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Otorisasi lebih detail akan ditangani oleh UserPolicy
        return $this->user() && $this->user()->hasAdminPrivileges();
    }

    public function rules(): array
    {
        return [
            'jabatan' => 'sometimes|required|string|max:255',
            // 'unitKerja' => ['sometimes', 'required', Rule::in(['Balai', 'Sekwil I / Palangka Raya', 'Sekwil II / Samarinda', 'Sekwil III / Pontianak'])],
            'role' => ['sometimes', 'required', Rule::in(['Admin', 'User'])]
        ];
    }
}
