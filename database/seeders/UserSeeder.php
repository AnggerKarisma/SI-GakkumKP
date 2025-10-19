<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        // 3. Kosongkan tabel yang relevan.
        //    Penting untuk mengosongkan tabel 'anak' (pinjam) terlebih dahulu.
        DB::table('pinjam')->truncate();
        DB::table('users')->truncate();
        // Siapkan data pengguna dalam bentuk array
        $users = [
            // --- SUPER ADMINS (3 Users) ---
            [
                'nama' => 'Tri Setiawan, S.Hut. M.Ec.Dev,M.A',
                'NIP' => '198103232006041003',
                'password' => Hash::make('12345678'),
                'jabatan' => 'Kepala Sub Bagian TU',
                'unitKerja' => 'Balai',
                'role' => 'Super Admin',
            ],
            [
                'nama' => 'Erwin Ermawan, A.Md.Kom',
                'NIP' => '199907122022031003',
                'password' => Hash::make('12345678'),
                'jabatan' => 'Koordinator BMN',
                'unitKerja' => 'Balai',
                'role' => 'Super Admin',
            ],
            [
                'nama' => 'Bayu Saka, S.Pi.',
                'NIP' => '199408232024211016',
                'password' => Hash::make('12345678'),
                'jabatan' => 'Pengelola BMN',
                'unitKerja' => 'Balai',
                'role' => 'Super Admin',
            ],
            [
                'nama' => 'Syaiful, S.E.',
                'NIP' => '197701032024211003',
                'password' => Hash::make('12345678'),
                'jabatan' => 'Pengelola BMN',
                'unitKerja' => 'Balai',
                'role' => 'Super Admin',
            ],

            // --- ADMINS (5 Users) ---
            [
                'nama' => 'Nopryarijaya',
                'NIP' => '198011111999031001',
                'password' => Hash::make('12345678'),
                'jabatan' => 'Pengelola BMN',
                'unitKerja' => 'Sekwil I / Palangkaraya',
                'role' => 'Admin',
            ],
            [
                'nama' => 'Iwan Setyawan',
                'NIP' => '198403232003121004',
                'password' => Hash::make('12345678'),
                'jabatan' => 'Pengelola BMN',
                'unitKerja' => 'Sekwil II / Samarinda',
                'role' => 'Admin',
            ],
            [
                'nama' => 'Jumiyarso Setyo Prabowo',
                'NIP' => '198409222003121006',
                'password' => Hash::make('12345678'),
                'jabatan' => 'Pengelola BMN',
                'unitKerja' => 'Sekwil III / Pontianak',
                'role' => 'Admin',
            ],
        ];
            
        // Masukkan semua data ke dalam tabel 'users' sekaligus
        DB::table('users')->insert($users);
    }
}
