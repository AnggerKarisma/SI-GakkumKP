<?php

namespace App\Http\Requests\Tax;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaxRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pajakId = $this->pajak->pajakID;

        return [
            'nostnk' => 'sometimes|required|string|max:255',
            'alamat' => 'sometimes|required|string|max:255',
            'biaya' => 'sometimes|nullable|string|min:0',
            'berlakuSampai' => 'sometimes|required|date',
            'tahunPembuatan' => 'sometimes|nullable|integer|min:1900|max:' . date('Y'),
            'silinder' => 'sometimes|required|string|max:255',
            'warnaKB' => 'sometimes|required|string|max:255',
            'noRangka' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('pajak', 'noRangka')->ignore($pajakId, 'pajakID')],
            'noMesin' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('pajak', 'noMesin')->ignore($pajakId, 'pajakID')],
            'noBPKB' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('pajak', 'noBPKB')->ignore($pajakId, 'pajakID')],
            'warnaTNKB' => 'sometimes|required|string|max:255',
            'bahanBakar' => 'sometimes|nullable|in:Bensin,Solar',
            'tahunRegistrasi' => 'sometimes|nullable|integer|min:1900|max:' . date('Y'),
        ];
    }
}
