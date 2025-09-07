<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Otorisasi lebih detail akan ditangani oleh VehiclePolicy di controller.
     * Di sini kita hanya memastikan user adalah admin.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasAdminPrivileges();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // $this->kendaraan akan mengambil model Kendaraan dari URL (Route Model Binding)
        $kendaraanId = $this->kendaraan->kendaraanID;

        return [
            'namaKendaraan' => 'sometimes|required|string|max:255',
            'plat' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('kendaraan', 'plat')->ignore($kendaraanId, 'kendaraanID')],
            'pemilik' => 'sometimes|required|string|max:255',
            'merk' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'jenisKendaraan' => ['sometimes', 'required', Rule::in(['mobil', 'motor'])],
            'penanggungjawab' => 'sometimes|required|string|max:255',
            'NUP' => 'sometimes|required|string|max:255',
            'unitKerja' => ['sometimes', 'required', Rule::in(['Balai', 'Sekwil I / Palangka Raya', 'Sekwil II / Samarinda', 'Sekwil III / Pontianak'])],
            'kondisi' => 'sometimes|required|string|max:255',
            'statKendaraan' => ['sometimes', 'required', Rule::in(['Stand by', 'Not Available', 'Maintenance'])],
        ];
    }
}
