<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Exception;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'NIP' => 'required|string|max:255|unique:users,NIP',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'jabatan' => 'required|string|max:255',
            'unitKerja' => 'required|in:Balai,Sekwil I / Palangka raya,Sekwil II / Samarinda,Sekwil III / Pontianak'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Semua kolom harus diisi.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $requiredFields = ['nama', 'NIP', 'email', 'password', 'jabatan', 'unitKerja'];
            foreach ($requiredFields as $field) {
                if (empty($request->$field)) {
                    DB::rollback();
                    return response()->json([
                        'success' => false,
                        'message' => 'Semua kolom harus diisi.'
                    ], 400);
                }
            }

            $user = User::create([
                'nama' => $request->nama,
                'NIP' => $request->NIP,
                'email' => $request->email,
                'password' => Hash::make($request->password), 
                'jabatan' => $request->jabatan,
                'unitKerja' => $request->unitKerja,
                'role' => 'User' 
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User berhasil didaftarkan',
                'data' => [
                    'userID' => $user->userID,
                    'nama' => $user->nama,
                    'NIP' => $user->NIP,
                    'email' => $user->email,
                    'jabatan' => $user->jabatan,
                    'unitKerja' => $user->unitKerja,
                    'role' => $user->role
                ]
            ], 201);

        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mendaftarkan user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function registerSA(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'NIP' => 'required|string|max:255|unique:users,NIP',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'jabatan' => 'required|string|max:255',
            'unitKerja' => 'required|in:Balai,Sekwil I / Palangka raya,Sekwil II / Samarinda,Sekwil III / Pontianak'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Semua kolom harus diisi.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $requiredFields = ['nama', 'NIP', 'email', 'password', 'jabatan', 'unitKerja'];
            foreach ($requiredFields as $field) {
                if (empty($request->$field)) {
                    DB::rollback();
                    return response()->json([
                        'success' => false,
                        'message' => 'Semua kolom harus diisi.'
                    ], 400);
                }
            }

            $user = User::create([
                'nama' => $request->nama,
                'NIP' => $request->NIP,
                'email' => $request->email,
                'password' => Hash::make($request->password), 
                'jabatan' => $request->jabatan,
                'unitKerja' => $request->unitKerja,
                'role' => 'Super Admin' 
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Super Admin berhasil didaftarkan',
                'data' => [
                    'userID' => $user->userID,
                    'nama' => $user->nama,
                    'NIP' => $user->NIP,
                    'email' => $user->email,
                    'jabatan' => $user->jabatan,
                    'unitKerja' => $user->unitKerja,
                    'role' => $user->role
                ]
            ], 201);

        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mendaftarkan user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        if (empty($request->NIP)) {
            return response()->json([
                'success' => false,
                'message' => 'NIP tidak boleh kosong.'
            ], 400);
        }

        if (strlen($request->password) < 6) {
            return response()->json([
                'success' => false,
                'message' => 'panjang password minimal 6 karakter'
            ], 400);
        }

        try {
            $user = User::where('NIP', $request->NIP)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'NIP atau password salah'
                ], 401);
            }

            Auth::login($user);
            
            $token = $user->createToken('auth-token', [$user->getAttribute('role')])->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil',
                'user' => [
                    'userID' => $user->userID,
                    'nama' => $user->nama,
                    'NIP' => $user->NIP,
                    'email' => $user->email,
                    'jabatan' => $user->jabatan,
                    'unitKerja' => $user->unitKerja,
                    'role' => $user->role
                ],
                'token' => $token
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        if (Auth::check()) {
            $request->user()->currentAccessToken()->delete();
            Auth::logout();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ], 200);
    }

    public function createAccountByAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'NIP' => 'required|string|max:255|unique:users,NIP',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'jabatan' => 'required|string|max:255',
            'unitKerja' => 'required|in:Balai,Sekwil I / Palangka raya,Sekwil II / Samarinda,Sekwil III / Pontianak',
            'role' => 'required|in:Admin,User'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentUser = Auth::user();
        
        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terautentikasi'
            ], 401);
        }

        try {
            if ($currentUser->isAdmin() && $request->role === 'Admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak: Admin tidak dapat membuat akun Admin lain.'
                ], 403);
            }

            if ($currentUser->isAdmin() && $currentUser->unitKerja !== $request->unitKerja) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak: Admin hanya dapat membuat user di unit kerjanya.'
                ], 403);
            }

            if (!$currentUser->isSuperAdmin() && !$currentUser->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak: Hanya Admin atau Super Admin yang dapat membuat Akun.'
                ], 403);
            }

            $newUser = User::create([
                'nama' => $request->nama,
                'NIP' => $request->NIP,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'jabatan' => $request->jabatan,
                'unitKerja' => $request->unitKerja,
                'role' => $request->role
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Akun berhasil dibuat',
                'data' => [
                    'userID' => $newUser->userID,
                    'nama' => $newUser->nama,
                    'NIP' => $newUser->NIP,
                    'email' => $newUser->email,
                    'jabatan' => $newUser->jabatan,
                    'unitKerja' => $newUser->unitKerja,
                    'role' => $newUser->role
                ]
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat akun: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'nullable|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentUser = Auth::user();
        
        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terautentikasi'
            ], 401);
        }

        try {
            
            $updateData = ['email' => $request->email];
            
            if (!empty($request->password)) {
                $updateData['password'] = Hash::make($request->password);
            }

            $currentUser->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diupdate',
                'data' => [
                    'userID' => $currentUser->userID,
                    'nama' => $currentUser->nama,
                    'NIP' => $currentUser->NIP,
                    'email' => $currentUser->email,
                    'jabatan' => $currentUser->jabatan,
                    'unitKerja' => $currentUser->unitKerja,
                    'role' => $currentUser->role
                ]
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal update profil: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateAccount(Request $request, $targetUserId)
    {
        $validator = Validator::make($request->all(), [
            'jabatan' => 'required|string|max:255',
            'unitKerja' => 'required|in:Balai,Sekwil I / Palangka Raya,Sekwil II / Samarinda,Sekwil III / Pontianak',
            'role' => 'required|in:Admin,User'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentUser = Auth::user();
        $targetUser = User::find($targetUserId);

        if (!$currentUser || !$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        try {
            if ($currentUser->userID == $targetUser->userID) {
                return response()->json([
                    'success' => false,
                    'message' => 'tidak dapat mengelola akun sendiri.'
                ], 403);
            }

            if ($currentUser->isAdmin() && ($targetUser->isAdmin() || $targetUser->isSuperAdmin())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses Ditolak.'
                ], 403);
            }

            if (!$currentUser->isSuperAdmin() && !$currentUser->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak'
                ], 403);
            }

            $targetUser->update([
                'jabatan' => $request->jabatan,
                'unitKerja' => $request->unitKerja,
                'role' => $request->role
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Akun berhasil diupdate',
                'data' => [
                    'userID' => $targetUser->userID,
                    'nama' => $targetUser->nama,
                    'NIP' => $targetUser->NIP,
                    'email' => $targetUser->email,
                    'jabatan' => $targetUser->jabatan,
                    'unitKerja' => $targetUser->unitKerja,
                    'role' => $targetUser->role
                ]
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate akun: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteAccount($targetUserId)
    {
        $currentUser = Auth::user();
        $targetUser = User::find($targetUserId);

        if (!$currentUser || !$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        try {
            if ($currentUser->userID == $targetUser->userID) {
                return response()->json([
                    'success' => false,
                    'message' => 'tidak dapat mengelola akun sendiri.'
                ], 403);
            }
            if ($currentUser->isAdmin() && ($targetUser->isAdmin() || $targetUser->isSuperAdmin())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses Ditolak.'
                ], 403);
            }
            if (!$currentUser->isSuperAdmin() && !$currentUser->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak'
                ], 403);
            }

            $targetUser->delete();

            return response()->json([
                'success' => true,
                'message' => 'Akun berhasil dihapus'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus akun: ' . $e->getMessage()
            ], 500);
        }
    }

    public function showAllAccounts()
    {
        $currentUser = Auth::user();
        
        if (!$currentUser || !$currentUser->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak'
            ], 403);
        }

        try {
            $accounts = User::select('nama', 'email', 'unitKerja')->get();

            return response()->json([
                'success' => true,
                'message' => 'Data akun berhasil diambil',
                'data' => $accounts
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data akun: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getProfile()
    {
        $currentUser = Auth::user();
        
        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terautentikasi'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data profil berhasil diambil',
            'data' => [
                'userID' => $currentUser->userID,
                'nama' => $currentUser->nama,
                'NIP' => $currentUser->NIP,
                'email' => $currentUser->email,
                'jabatan' => $currentUser->jabatan,
                'unitKerja' => $currentUser->unitKerja,
                'role' => $currentUser->role
            ]
        ], 200);
    }

    public function getAllUsers()
    {
        $currentUser = Auth::user();
        
        if (!$currentUser || !$currentUser->hasAdminPrivileges()) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak'
            ], 403);
        }

        try {
            $users = User::select('userID', 'nama', 'NIP', 'email', 'jabatan', 'unitKerja', 'role')
                         ->get();

            return response()->json([
                'success' => true,
                'message' => 'Data users berhasil diambil',
                'data' => $users
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data users: ' . $e->getMessage()
            ], 500);
        }
    }
}