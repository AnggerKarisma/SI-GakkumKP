<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use Exception;
use App\Http\Requests\Vehicle\StoreVehicleRequest;
use App\Http\Requests\Vehicle\UpdateVehicleRequest;

class VehicleController extends Controller
{
    /**
     * Menampilkan daftar kendaraan berdasarkan hak akses user.
     */
    public function index()
    {
        $currentUser = Auth::user();
        
        try {
            // Logika query tetap di controller, karena ini tentang data APA yang ditampilkan, bukan SIAPA yang boleh melihat.
            if ($currentUser->isSuperAdmin()) {
                $kendaraan = Kendaraan::all();
            } else {
                $kendaraan = Kendaraan::byUnitKerja($currentUser->unitKerja)->get();
            }

            return response()->json([
                'success' => true,
                'message' => 'Data Kendaraan Berhasil Diambil',
                'data' => $kendaraan
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal mengambil data kendaraan'], 500);
        }
    }

    /**
     * Menampilkan detail satu kendaraan.
     * Menggunakan Route Model Binding (Kendaraan $kendaraan).
     */
    public function show(Kendaraan $kendaraan)
    {
        // Logika otorisasi dipindahkan ke VehiclePolicy
        $this->authorize('view-vehicle', $kendaraan);

        return response()->json([
            'success' => true,
            'message' => 'Detail kendaraan berhasil diambil',
            'data' => $kendaraan
        ], 200);
    }

    /**
     * Menyimpan kendaraan baru.
     * Menggunakan StoreVehicleRequest untuk validasi & otorisasi.
     */
    public function store(StoreVehicleRequest $request)
    {
        try {
            // Validasi sudah otomatis dijalankan oleh StoreVehicleRequest.
            // Jika validasi gagal, kode tidak akan pernah sampai ke sini.
            $validatedData = $request->validated();
            
            // Menambahkan status default
            $validatedData['statKendaraan'] = 'Stand by';

            $kendaraan = Kendaraan::create($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Kendaraan berhasil ditambahkan',
                'data' => $kendaraan
            ], 201);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal Menambahkan Kendaraan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Memperbarui data kendaraan.
     * Menggunakan UpdateVehicleRequest dan Route Model Binding.
     */
    public function update(UpdateVehicleRequest $request, Kendaraan $kendaraan)
    {
        $this->authorize('update-vehicle', $kendaraan);

        try {
            // Validasi dan otorisasi sudah otomatis dijalankan.
            $validatedData = $request->validated();

            $kendaraan->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Data kendaraan berhasil diupdate',
                'data' => $kendaraan->fresh() // Mengambil data terbaru dari DB
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal mengupdate data kendaraan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Menghapus kendaraan.
     * Menggunakan Route Model Binding.
     */
    public function destroy(Kendaraan $kendaraan)
    {
        // Logika otorisasi dipindahkan ke VehiclePolicy
        $this->authorize('delete-vehicle', $kendaraan);

        try {
            if ($kendaraan->currentBorrowing()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menghapus kendaraan yang sedang dipinjam.'
                ], 400); // 400 Bad Request lebih sesuai daripada 403 Forbidden
            }

            $kendaraan->delete();

            return response()->json(['success' => true, 'message' => 'Kendaraan berhasil dihapus'], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal menghapus kendaraan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Memperbarui status kendaraan.
     */
    public function updateStatus(Request $request, Kendaraan $kendaraan)
    {

        $this->authorize('update-vehicle', $kendaraan);

        $validator = Validator::make($request->all(), [
            'statKendaraan' => 'required|in:Stand by,Not Available,Maintenance'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }
        
        try {
            $kendaraan->update(['statKendaraan' => $request->statKendaraan]);

            return response()->json([
                'success' => true,
                'message' => 'Status kendaraan berhasil diupdate',
                'data' => $kendaraan
            ], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal mengupdate status: ' . $e->getMessage()], 500);
        }
    }
    
    // Fungsi filter dan getAvailableVehicles sudah cukup baik dan tidak perlu perubahan signifikan
    // selain menghapus blok pengecekan otentikasi yang kini ditangani middleware.
}
