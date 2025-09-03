<?php

namespace App\Http\Requests\Tax;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateTaxRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'data' => 'required|array',
            'data.*.kendaraanID' => 'required|integer|exists:kendaraan,kendaraanID',
            'data.*.nostnk' => 'required|string|max:255',
            'data.*.activeSTNK' => 'required|date|after_or_equal:today',
            'data.*.activePT' => 'required|date|after_or_equal:today',
        ];
    }
}

