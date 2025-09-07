<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Hanya Super Admin dan Admin yang boleh membuat kendaraan baru.
     */
    public function authorize(): bool
    {
        // $this->user() akan mengambil user yang sedang login.
        return $this->user() && $this->user()->hasAdminPrivileges();
    }

    /**
     * Get the validation rules that apply to the request.
     * Semua logika validasi dari controller dipindahkan ke sini.
     */
    public function rules(): array
    {
        return [
            'namaKendaraan' => 'required|string|max:255',
            'plat' => 'required|string|max:255|unique:kendaraan,plat',
            'pemilik' => 'required|string|max:255',
            'merk'=> 'required|string|max:255',
            'model'=> 'required|string|max:255',
            'jenisKendaraan' => ['required', Rule::in(['mobil', 'motor'])],
            'penanggungjawab' => 'required|string|max:255',
            'NUP' => 'required|string|max:255',
            'unitKerja' => ['required', Rule::in(['Balai', 'Sekwil I / Palangka Raya', 'Sekwil II / Samarinda', 'Sekwil III / Pontianak'])],
            'kondisi' => 'required|string|max:255',
        ];
    }
}
