<?php

namespace App\Http\Requests\Tax;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaxRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Otorisasi ditangani di controller, jadi di sini kita set true.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     * Aturan ini disesuaikan dengan migrasi 'pajak' yang baru.
     */
    public function rules(): array
    {
        return [
            'kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID|unique:pajak,kendaraanID',
            'alamat' => 'required|string|max:255',
            'biaya' => 'nullable|numeric|min:0',
            'berlakuSampai' => 'required|date',
            'tahunPembuatan' => 'nullable|integer|min:1900|max:' . date('Y'),
            'silinder' => 'required|string|max:255',
            'warnaKB' => 'required|string|max:255',
            'noRangka' => 'required|string|max:255|unique:pajak,noRangka',
            'noMesin' => 'required|string|max:255|unique:pajak,noMesin',
            'noBPKB' => 'required|string|max:255|unique:pajak,noBPKB',
            'warnaTNKB' => 'required|string|max:255',
            'bahanBakar' => 'nullable|in:Bensin,Solar',
            'tahunRegistrasi' => 'nullable|integer|min:1900|max:' . date('Y'),
        ];
    }
}
