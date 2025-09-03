<?php

namespace App\Http\Requests\Tax;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaxRequest extends FormRequest

{
    /**
     * Determine if the user is authorized to make this request.
     * Karena kita memanggil otorisasi manual di controller, di sini kita set true.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID|unique:pajak,kendaraanID',
            'nostnk' => 'required|string|max:255',
            'activeSTNK' => 'required|date|after_or_equal:today',
            'activePT' => 'required|date|after_or_equal:today',
        ];
    }
}

