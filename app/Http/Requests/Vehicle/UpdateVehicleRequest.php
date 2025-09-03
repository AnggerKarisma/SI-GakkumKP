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
            'alamat' => 'sometimes|required|string|max:255',
            'merk' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'jenisKendaraan' => ['sometimes', 'required', Rule::in(['mobil', 'motor'])],
            'tahunPembuatan' => 'sometimes|required|integer|min:1900|max:' . date('Y'),
            'silinder' => 'sometimes|required|string|max:255',
            'warnaKB' => 'sometimes|required|string|max:255',
            'noRangka' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('kendaraan', 'noRangka')->ignore($kendaraanId, 'kendaraanID')],
            'noMesin' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('kendaraan', 'noMesin')->ignore($kendaraanId, 'kendaraanID')],
            'noBPKB' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('kendaraan', 'noBPKB')->ignore($kendaraanId, 'kendaraanID')],
            'warnaTNKB' => 'sometimes|required|string|max:255',
            'bahanBakar' => ['sometimes', 'required', Rule::in(['Bensin', 'Solar'])],
            'tahunRegistrasi' => 'sometimes|required|integer|min:1900|max:' . date('Y'),
            'berlakuSampai' => 'sometimes|required|date',
            'penanggungjawab' => 'sometimes|required|string|max:255',
            'NUP' => 'sometimes|required|string|max:255',
            'unitKerja' => ['sometimes', 'required', Rule::in(['Balai', 'Sekwil I / Palangka Raya', 'Sekwil II / Samarinda', 'Sekwil III / Pontianak'])],
            'Kkendaraan' => 'sometimes|required|string|max:255',
            'statKendaraan' => ['sometimes', 'required', Rule::in(['Stand by', 'Not Available', 'Maintenance'])],
        ];
    }
}
