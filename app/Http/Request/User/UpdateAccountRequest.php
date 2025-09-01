<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Semua user yang login boleh update akunnya sendiri
        return $this->user() != null;
    }

    public function rules(): array
    {
        return [
            'nama' => 'sometimes|required|string|max:255',
            'password' => 'nullable|string|min:6'
        ];
    }
}
