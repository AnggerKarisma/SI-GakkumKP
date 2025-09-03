<?php

namespace App\Http\Requests\Pinjam;

use Illuminate\Foundation\Http\FormRequest;

class ReturnBorrowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tglKembaliAktual' => 'required|date|after_or_equal:tglPinjam',
            'keterangan' => 'nullable|string|max:500',
        ];
    }
}
