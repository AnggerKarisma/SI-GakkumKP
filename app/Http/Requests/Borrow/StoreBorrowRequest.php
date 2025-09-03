<?php

namespace App\Http\Requests\Pinjam;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Kendaraan;

class StoreBorrowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Otorisasi ditangani di controller.
    }

    public function rules(): array
    {
        return [
            'kendaraanID' => [
                'required',
                'integer',
                'exists:kendaraan,kendaraanID',
                // Custom rule untuk memeriksa ketersediaan
                function ($attribute, $value, $fail) {
                    $kendaraan = Kendaraan::find($value);
                    if ($kendaraan && !$kendaraan->isAvailable()) {
                        $fail('Kendaraan tidak tersedia untuk dipinjam saat ini.');
                    }
                },
            ],
            'tglPinjam' => 'required|date|after_or_equal:today',
            'tglJatuhTempo' => 'required|date|after:tglPinjam',
            'keterangan' => 'nullable|string|max:500',
        ];
    }
}
