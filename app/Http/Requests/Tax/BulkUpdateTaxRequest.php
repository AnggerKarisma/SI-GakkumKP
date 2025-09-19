<?php

namespace App\Http\Requests\Tax;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateTaxRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'data' => 'required|array',
            'data.*.kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID',
            'data.*.alamat' => 'required|string|max:255',
            'data.*.biaya' => 'nullable|numeric|min:0',
            'data.*.berlakuSampai' => 'required|date',
            'data.*.tahunPembuatan' => 'nullable|integer|min:1900|max:' . date('Y'),
            'data.*.silinder' => 'required|string|max:255',
            'data.*.warnaKB' => 'required|string|max:255',
            'data.*.noRangka' => 'required|string|max:255',
            'data.*.noMesin' => 'required|string|max:255',
            'data.*.noBPKB' => 'required|string|max:255',
            'data.*.warnaTNKB' => 'required|string|max:255',
            'data.*.bahanBakar' => 'nullable|in:Bensin,Solar',
            'data.*.tahunRegistrasi' => 'nullable|integer|min:1900|max:' . date('Y'),
        ];
    }
}
