<?php

namespace App\Http\Requests\Tax;

use Illuminate\Foundation\Http\FormRequest;

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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nostnk' => 'sometimes|string|max:255',
            'activeSTNK' => 'sometimes|date|after_or_equal:today',
            'activePT' => 'sometimes|date|after_or_equal:today',
        ];
    }
}

