<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use App\Models\Pajak;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

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

    public function storeWithTax(Request $request)
    {
        // Validasi gabungan untuk data kendaraan dan pajak
        $validatedData = $request->validate([
            // Validasi untuk Kendaraan
            'namaKendaraan' => 'required|string|max:255',
            'plat' => 'required|string|unique:kendaraan,plat',
            'pemilik' => 'required|string',
            'merk' => 'required|string',
            'jenisKendaraan' => 'required|in:Mobil,Motor',
            'penanggungjawab' => 'required|string',
            'NUP' => 'required|string',
            'unitKerja' => 'required|string',
            'kondisi' => 'required|string',
            
            // Validasi untuk Pajak
            'alamat' => 'required|string',
            'biaya' => 'required|numeric|min:0',
            'tahunPembuatan' => 'required|digits:4',
            'silinder' => 'required|string',
            'warnaKB' => 'required|string',
            'noRangka' => 'required|string|unique:pajak,noRangka',
            'noMesin' => 'required|string|unique:pajak,noMesin',
            'noBPKB' => 'required|string|unique:pajak,noBPKB',
            'warnaTNKB' => 'required|string',
            'bahanBakar' => 'required|string',
            'tahunRegistrasi' => 'required|digits:4',
            'berlakuSampai' => 'required|date',
        ]);

        try {
            // Memulai transaksi database.
            // Semua operasi di dalam blok ini akan dibatalkan jika salah satunya gagal.
            $result = DB::transaction(function () use ($validatedData) {
                // 1. Buat data kendaraan
                $kendaraan = Kendaraan::create([
                    'namaKendaraan' => $validatedData['namaKendaraan'],
                    'plat' => $validatedData['plat'],
                    'pemilik' => $validatedData['pemilik'],
                    'merk' => $validatedData['merk'],
                    'jenisKendaraan' => $validatedData['jenisKendaraan'],
                    'penanggungjawab' => $validatedData['penanggungjawab'],
                    'NUP' => $validatedData['NUP'],
                    'unitKerja' => $validatedData['unitKerja'],
                    'statKendaraan' => 'Stand by', // Default status
                    'kondisi' => $validatedData['kondisi'],
                ]);

                // 2. Buat data pajak menggunakan ID kendaraan yang baru saja dibuat
                $pajak = Pajak::create([
                    'kendaraanID' => $kendaraan->kendaraanID,
                    'alamat' => $validatedData['alamat'],
                    'biaya' => $validatedData['biaya'],
                    'tahunPembuatan' => $validatedData['tahunPembuatan'],
                    'silinder' => $validatedData['silinder'],
                    'warnaKB' => $validatedData['warnaKB'],
                    'noRangka' => $validatedData['noRangka'],
                    'noMesin' => $validatedData['noMesin'],
                    'noBPKB' => $validatedData['noBPKB'],
                    'warnaTNKB' => $validatedData['warnaTNKB'],
                    'bahanBakar' => $validatedData['bahanBakar'],
                    'tahunRegistrasi' => $validatedData['tahunRegistrasi'],
                    'berlakuSampai' => $validatedData['berlakuSampai'],
                ]);

                return ['kendaraan' => $kendaraan];
            });

            return response()->json([
                'success' => true,
                'message' => 'Kendaraan dan pajak berhasil ditambahkan',
                'data' => $result
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Menangkap error validasi secara spesifik
            return response()->json([
                'success' => false,
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Menangkap semua error lainnya (misal: koneksi db, dll)
            return response()->json([
                'success' => false, 
                'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
            ], 500);
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
