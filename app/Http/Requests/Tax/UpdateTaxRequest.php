<?php

namespace App\Http\Requests\Tax;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaxRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Mengambil ID pajak dari route untuk aturan validasi 'unique'
        $pajakId = $this->pajak->pajakID;

        return [
            // 'sometimes' berarti field hanya akan divalidasi jika ada dalam request.
            'nostnk' => 'sometimes|required|string|max:255',
            'alamat' => 'sometimes|required|string|max:255',
            'biaya' => 'sometimes|nullable|numeric|min:0',
            'berlakuSampai' => 'sometimes|required|date',
            'tahunPembuatan' => 'sometimes|nullable|integer|min:1900|max:' . date('Y'),
            'silinder' => 'sometimes|required|string|max:255',
            'warnaKB' => 'sometimes|required|string|max:255',
            // Aturan 'unique' harus mengabaikan record yang sedang diupdate.
            'noRangka' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('pajak', 'noRangka')->ignore($pajakId, 'pajakID')],
            'noMesin' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('pajak', 'noMesin')->ignore($pajakId, 'pajakID')],
            'noBPKB' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('pajak', 'noBPKB')->ignore($pajakId, 'pajakID')],
            'warnaTNKB' => 'sometimes|required|string|max:255',
            'bahanBakar' => 'sometimes|nullable|in:Bensin,Solar',
            'tahunRegistrasi' => 'sometimes|nullable|integer|min:1900|max:' . date('Y'),
        ];
    }
}
