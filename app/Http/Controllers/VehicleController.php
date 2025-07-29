<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Exception;

class VehicleController extends Controller
{
    public function index()
    {
        $currentUser = Auth::user();

        if (!$currentUser){
            return response()->json([
                'success' => 'false',
                'message' => 'user tidak terauntentikasi'
            ], 401);
        }

        try{
            if ($currentUser->isSuperAdmin() || $currentUser->unitKerja ==='balai'){
                $kendaraan = Kendaraan::all();
            } else {
                $kendaraan = Kendaraan::byUnitKerja($currentUser->unitKerja)->get();
            }

            return response()->json([
                'success' => true,
                'message' => 'Data Kendaraan Berhasil Diambil',
                'data' => $kendaraan
            ],200);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kendaraan'
            ], 500);
        }
    }

    public function show($kendaraanId)
    {
        $currentUser = Auth::user();

        if (!$currentUser){
            return response()->json([
                'success' => false,
                'message' => 'user tidak terauntentikasi'
            ], 401);
        }


        try{
            $kendaraan = Kendaraan::find($kendaraanId);

            if (!$kendaraan){
                return response() -> json([
                    'success' => false,
                    'message' => 'Kendaraan tidak ditemukan'
                ],401);
            }
            
            if(!$currentUser->isSuperAdmin()&&
                $currentUser->unitKerja !== 'balai' &&
                $currentUser->unitKerja !== $kendaraan->unitKerja){
                    return response() ->json([
                        'success' => false,
                        'message' => 'Akses ditolak'
                    ], 401);
            }
            return response()->json([
                'success' => true,
                'message' => 'detail kendaraan berhasil diambil',
                'data' => $kendaraan
            ], 200);
        } catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail kendaraan:' . $e->getMessage()
            ], 500);
        }
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'namaKendaraan' => 'rquired|string|max:255',
            'plat' => 'required| string|max:255|unique:kendaraan.plat',
            'pemilik' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'merk'=> 'required|string|max:255',
            'model'=> 'required|string|max:255',
            'jenisKendaraan' => 'required|in:mobil,motor',
            'tahunPembuatan' => 'required|integer|min:1900|max:' . date('Y'),
            'silinder' => 'required|string|max:255',
            'warnaKB' => 'required|string|max:255',
            'noRangka' => 'required|string|max:255|unique:kendaraan.noRangka',
            'noMesin' => 'required|string|max:255|unique:kendaraan.noMesin',
            'noBPKB' => 'required|string|max:255|unique:kendaraan.noBPKB',
            'warnaTNKB' => 'required|string|max:255',
            'bahanBakar'=> 'required|in: Bensin, Solar',
            'tahunRegistrasi' => 'required|integer|min:1900|max:' . date('Y'),
            'berlakuSampai' => 'required|date|after:today',
            'biaya' => 'required|string|max:255',
            'penanggungjawab' => 'required|string|max:255',
            'NUP' => 'required|string|max:255',
            'unitKerja' => 'required|in: Balai, Sekwil I / Palangka raya, Sekwil II / Samarinda, Sekwil III / Pontianak',
            'Kkendaraan' => 'required|string|max:255'
        ]);
        if ($validator->fails()){
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ],422);
        }
        $currentUser = Auth::user();

        if (!$currentUser){
            return response()->json([
                'success' => false,
                'message' => 'user tidak terauntentikasi'
            ], 401);
        }

        try{
            if(!$currentUser->isAdmin() && !$currentUser->isSuperAdmin()){
                return response()->json([
                'success'=> false,
                'message' => 'Akses Ditolak'
                ],401);
            }

            $kendaraan = Kendaraan::create([
                'namaKendaraaan'=> $request->namaKendaraan,
                'plat' => $request->plat,
                'pemilik' => $request->pemilik,
                'alamat' => $request->alamat,
                'merk' => $request->merk,
                'model' => $request->model,
                'jenisKendaraan' => $request->jenisKendaraan,
                'tahunPembuatan' => $request->tahunPembuatan,
                'silinder' => $request->silinder,
                'warnaKB' => $request->warnaKB,
                'noRangka' => $request->noRangka,
                'noMesin' => $request->noMesin,
                'noBPKB' => $request->noBPKB,
                'warnaTNKB' => $request->warnaTNKB,
                'bahanBakar' => $request->bahanBakar,
                'tahunRegistrasi' => $request->tahunRegistrasi,
                'berlakuSampai' => $request->berlakuSampai,
                'biaya' => $request->biaya,
                'penanggungjawab' => $request->penanggungjawab,
                'NUP' => $request->NUP,
                'unitKerja' => $request->unitKerja,
                'Kkendaraan' => $request->Kkendaraan,
                'statKendaraan' => 'Stand by' 
            ]);

            return response()->json([
                'success' => true,
                'message' => 'kendaraan berhasil ditambahkan',
                'data' =>$kendaraan
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal Menambahkan Kendaraan: ' . $e->getMessage()
            ],500);
        }
    }

    public function update(Request $request,$kendaraanId)
    {
        $validator = Validator::make($request->all(),[
            'namaKendaraan' => 'required|string|max:255',
            'plat' => 'required|string|max:255|unique:kendaraan,plat,' . $kendaraanId . ',kendaraanID',
            'pemilik' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'merk' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'jenisKendaraan' => 'required|in:mobil,motor',
            'tahunPembuatan' => 'required|integer|min:1900|max:' . date('Y'),
            'silinder' => 'required|string|max:255',
            'warnaKB' => 'required|string|max:255',
            'noRangka' => 'required|string|max:255|unique:kendaraan,noRangka,' . $kendaraanId . ',kendaraanID',
            'noMesin' => 'required|string|max:255|unique:kendaraan,noMesin,' . $kendaraanId . ',kendaraanID',
            'noBPKB' => 'required|string|max:255|unique:kendaraan,noBPKB,' . $kendaraanId . ',kendaraanID',
            'warnaTNKB' => 'required|string|max:255',
            'bahanBakar' => 'required|in:Bensin,Solar',
            'tahunRegistrasi' => 'required|integer|min:1900|max:' . date('Y'),
            'berlakuSampai' => 'required|date',
            'biaya' => 'required|string|max:255',
            'penanggungjawab' => 'required|string|max:255',
            'NUP' => 'required|string|max:255',
            'unitKerja' => 'required|in:Balai,Sekwil I / Palangka Raya,Sekwil II / Samarinda,Sekwil III / Pontianak',
            'Kkendaraan' => 'required|string|max:255',
            'statKendaraan' => 'nullable|in:Stand by,Not Available,Maintenance'
        ]);

        if($validator->fails()){
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentUser = Auth::user();
        $kendaraan = Kendaraan::find($kendaraanId);

        if (!$currentUser || !$kendaraan){
            return response()->json([
                'success' => false,
                'message' => 'user atau kendaraan tidak ditemukan.'
            ], 404);
        }

        try{
            if (!$currentUser->isAdmin() && !$isSuperAdmin()){
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak.'
                ], 403);
            }
        
            if ($currentUser->isAdmin() && $currentUser->unitKerja !== $kendaraan->unitKerja) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin hanya dapat mengubah kendaraan di unit kerjanya sendiri.'
                ], 403);
            }
             $kendaraan->update([
                'namaKendaraan' => $request->namaKendaraan,
                'plat' => $request->plat,
                'pemilik' => $request->pemilik,
                'alamat' => $request->alamat,
                'merk' => $request->merk,
                'model' => $request->model,
                'jenisKendaraan' => $request->jenisKendaraan,
                'tahunPembuatan' => $request->tahunPembuatan,
                'silinder' => $request->silinder,
                'warnaKB' => $request->warnaKB,
                'noRangka' => $request->noRangka,
                'noMesin' => $request->noMesin,
                'noBPKB' => $request->noBPKB,
                'warnaTNKB' => $request->warnaTNKB,
                'bahanBakar' => $request->bahanBakar,
                'tahunRegistrasi' => $request->tahunRegistrasi,
                'berlakuSampai' => $request->berlakuSampai,
                'biaya' => $request->biaya,
                'penanggungjawab' => $request->penanggungjawab,
                'NUP' => $request->NUP,
                'unitKerja' => $request->unitKerja,
                'Kkendaraan' => $request->Kkendaraan,
                'statKendaraan' => $request->statKendaraan ?? $kendaraan->statKendaraan
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data kendaraan berhasil diupdate',
                'data' => $kendaraan->fresh()
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate data kendaraan: ' . $e->getMessage()
            ], 500);
        }
    }
     public function destroy($kendaraanId)
    {
        $currentUser = Auth::user();
        $kendaraan = Kendaraan::find($kendaraanId);

        if (!$currentUser || !$kendaraan) {
            return response()->json([
                'success' => false,
                'message' => 'User atau kendaraan tidak ditemukan'
            ], 404);
        }

        try {
            if (!$currentUser->isAdmin() && !$currentUser->isSuperAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak.'
                ], 403);
            }
            if ($currentUser->isAdmin() && $currentUser->unitKerja !== $kendaraan->unitKerja) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin hanya dapat menghapus kendaraan di unit kerjanya sendiri.'
                ], 403);
            }

            $currentBorrowing = $kendaraan->currentBorrowing();
            if ($currentBorrowing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menghapus kendaraan yang sedang dipinjam.'
                ], 400);
            }
            if ($kendaraan->gambar_url) {
                $imagePath = str_replace('/storage/', '', $kendaraan->gambar_url);
                Storage::disk('public')->delete($imagePath);
            }

            $kendaraan->delete();

            return response()->json([
                'success' => true,
                'message' => 'Kendaraan berhasil dihapus'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus kendaraan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, $kendaraanId)
    {
        $validator = Validator::make($request->all(), [
            'statKendaraan' => 'required|in:Stand by,Not Available,Maintenance'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentUser = Auth::user();
        $kendaraan = Kendaraan::find($kendaraanId);

        if (!$currentUser || !$kendaraan) {
            return response()->json([
                'success' => false,
                'message' => 'User atau kendaraan tidak ditemukan'
            ], 404);
        }

        try {
            if (!$currentUser->isAdmin() && !$currentUser->isSuperAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak.'
                ], 403);
            }

            if ($currentUser->isAdmin() && $currentUser->unitKerja !== $kendaraan->unitKerja) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin hanya dapat mengubah status kendaraan di unit kerjanya sendiri.'
                ], 403);
            }

            $kendaraan->update([
                'statKendaraan' => $request->statKendaraan
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status kendaraan berhasil diupdate',
                'data' => [
                    'kendaraanID' => $kendaraan->kendaraanID,
                    'namaKendaraan' => $kendaraan->namaKendaraan,
                    'plat' => $kendaraan->plat,
                    'statKendaraan' => $kendaraan->statKendaraan
                ]
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate status kendaraan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function filter(Request $request)
    {
        $currentUser = Auth::user();
        
        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terautentikasi'
            ], 401);
        }

        try {
            $query = Kendaraan::query();

            if (!$currentUser->isSuperAdmin() && $currentUser->unitKerja !== 'Balai') {
                $query->byUnitKerja($currentUser->unitKerja);
            }
            if ($request->has('jenisKendaraan') && !empty($request->jenisKendaraan)) {
                $query->byJenisKendaraan($request->jenisKendaraan);
            }

            if ($request->has('statKendaraan') && !empty($request->statKendaraan)) {
                $query->byStatus($request->statKendaraan);
            }

            if ($request->has('unitKerja') && !empty($request->unitKerja)) {
                $query->byUnitKerja($request->unitKerja);
            }

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('namaKendaraan', 'like', "%{$search}%")
                      ->orWhere('plat', 'like', "%{$search}%")
                      ->orWhere('merk', 'like', "%{$search}%")
                      ->orWhere('model', 'like', "%{$search}%");
                });
            }

            $kendaraan = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'message' => 'Data kendaraan berhasil difilter',
                'data' => $kendaraan
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memfilter data kendaraan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAvailableVehicles()
    {
        $currentUser = Auth::user();
        
        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terautentikasi'
            ], 401);
        }

        try {
            $query = Kendaraan::byStatus('Stand by');

            if (!$currentUser->isSuperAdmin() && $currentUser->unitKerja !== 'Balai') {
                $query->byUnitKerja($currentUser->unitKerja);
            }

            $availableVehicles = $query->select('kendaraanID', 'namaKendaraan', 'plat', 'jenisKendaraan', 'merk', 'model', 'unitKerja')
                                     ->get();

            return response()->json([
                'success' => true,
                'message' => 'Data kendaraan tersedia berhasil diambil',
                'data' => $availableVehicles
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kendaraan tersedia: ' . $e->getMessage()
            ], 500);
        }
    }
}
