<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Exception;
// Import kelas-kelas baru
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserDetailRequest;
use App\Http\Requests\User\UpdateUserCoreRequest;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // --- Metode Publik untuk Registrasi ---

    public function register(Request $request)
    {
        return $this->createUser($request, 'User');
    }

    public function registerSA(Request $request)
    {
        // Sebaiknya route ini hanya bisa diakses di awal setup atau dari CLI
        return $this->createUser($request, 'Super Admin');
    }
    
    // --- Metode Autentikasi ---

    public function login(Request $request)
    {
        $request->validate([
            'NIP' => 'required|string',
            'password' => 'required|string|min:6'
        ]);

        $user = User::where('NIP', $request->NIP)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'NIP atau password salah'], 401);
        }

        $token = $user->createToken('auth-token', [$user->role])->plainTextToken;   

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logout berhasil']);
    }
    
    // --- Manajemen Profil & Akun ---
    
    public function getProfile()
    {
        return response()->json(['success' => true, 'data' => Auth::user()]);
    }
    
    public function getOtherProfile (User $user)
    {
        $this->authorize('viewAny', $user);

        return response()->json([
            'success' => true,
            'message' => 'Detail user berhasil diambil',
            'data' => $user
        ], 200);
    }

    public function updateUserCoreData(UpdateUserCoreRequest $request)
    {
        $user = Auth::user();
        $validatedData = $request->validated();

        if (!empty($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($validatedData);

        return response()->json(['success' => true, 'message' => 'Core Data berhasil diupdate', 'data' => $user]);
    }

    public function getAllUsers()
    {
        $this->authorize('viewAny', User::class);
        $users = User::select('userID', 'nama', 'NIP', 'jabatan', 'unitKerja', 'role')->get();
        return response()->json(['success' => true, 'data' => $users]);
    }

    // --- Aksi Khusus Admin ---
    
    public function createAccountByAdmin(StoreUserRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['password'] = Hash::make($validatedData['password']);
        
        $user = User::create($validatedData);

        return response()->json(['success' => true, 'message' => 'Akun berhasil dibuat', 'data' => $user], 201);
    }

    public function updateUserDetail(UpdateUserDetailRequest $request, User $user)
    {
        $this->authorize('update', $user);
        
        try {
            // 1. Lakukan update dan simpan hasilnya di sebuah variabel
            $isUpdated = $user->update($request->validated());

            // 2. Periksa secara eksplisit apakah update berhasil
            if (!$isUpdated) {
                // Jika gagal, lempar exception agar ditangkap oleh blok catch.
                throw new Exception('Gagal memperbarui data akun di database.');
            }

            // Muat ulang data user untuk memastikan data yang dikembalikan adalah yang terbaru.
            $user->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Akun berhasil diupdate',
                'data' => $user
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui akun.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function deleteAccount(User $user)
    {
        $this->authorize('delete', $user);

        $user->delete();

        return response()->json(['success' => true, 'message' => 'Akun berhasil dihapus']);
    }

    // --- Metode Privat Helper untuk Registrasi ---
    
    /**
     * Metode internal untuk menangani logika pembuatan user.
     */
    private function createUser(Request $request, string $role)
    {
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'NIP' => 'required|string|max:255|unique:users,NIP',
            'password' => 'required|string|min:6',
            'jabatan' => 'required|string|max:255',
            'unitKerja' => ['required', Rule::in(['Balai', 'Sekwil I / Palangka Raya', 'Sekwil II / Samarinda', 'Sekwil III / Pontianak'])]
        ]);
        
        try {
            $validatedData['password'] = Hash::make($validatedData['password']);
            $validatedData['role'] = $role;
            
            $user = User::create($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'User berhasil didaftarkan',
                'data' => $user
            ], 201);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal mendaftarkan user: ' . $e->getMessage()], 500);
        }
    }
}
