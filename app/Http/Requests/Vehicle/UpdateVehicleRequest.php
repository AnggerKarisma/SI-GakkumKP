<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
{

    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasAdminPrivileges();
    }

    public function rules(): array
    {
        $kendaraanId = $this->kendaraan->kendaraanID;
        $validUnitKerja = [
            'Balai',
            'Sekwil I / Palangka Raya',
            'Sekwil II / Samarinda', 
            'Sekwil III / Pontianak'
        ];

        return [
            'namaKendaraan' => 'sometimes|required|string|max:255',
            'plat' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('kendaraan', 'plat')->ignore($kendaraanId, 'kendaraanID')],
            'pemilik' => 'sometimes|required|string|max:255',
            'merk' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'jenisKendaraan' => ['sometimes', 'required', Rule::in(['mobil', 'motor'])],
            'penanggungjawab' => 'sometimes|required|string|max:255',
            'NUP' => 'sometimes|required|string|max:255',
            'kondisi' => 'sometimes|required|string|max:255',
            'statKendaraan' => ['sometimes', 'required', Rule::in(['Stand by', 'Not Available', 'Maintenance'])],
        ];
    }
}
