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
                'nama' => 'Budiman',
                'NIP' => '0001',
                'password' => Hash::make('SuperAdmin1'),
                'jabatan' => 'Super Admin 1',
                'unitKerja' => 'Balai',
                'role' => 'Super Admin',
            ],
            [
                'nama' => 'Suparman',
                'NIP' => '0002',
                'password' => Hash::make('SuperAdmin2'),
                'jabatan' => 'Super Admin 2',
                'unitKerja' => 'Balai',
                'role' => 'Super Admin',
            ],
            [
                'nama' => 'Nurjannah',
                'NIP' => '0003',
                'password' => Hash::make('SuperAdmin3'),
                'jabatan' => 'Super Admin 3',
                'unitKerja' => 'Balai',
                'role' => 'Super Admin',
            ],

            // --- ADMINS (5 Users) ---
            [
                'nama' => 'Husna Fika',
                'NIP' => '001',
                'password' => Hash::make('admin123'),
                'jabatan' => 'Sekretaris',
                'unitKerja' => 'Sekwil II / Samarinda',
                'role' => 'Admin',
            ],
            [
                'nama' => 'Yanuar Bakti',
                'NIP' => '002',
                'password' => Hash::make('admin123'),
                'jabatan' => 'Kepala Balai',
                'unitKerja' => 'Balai',
                'role' => 'Admin',
            ],
            [
                'nama' => 'Naufal Raya',
                'NIP' => '003',
                'password' => Hash::make('admin123'),
                'jabatan' => 'Polisi Hutan',
                'unitKerja' => 'Sekwil I / Palangka Raya',
                'role' => 'Admin',
            ],
            [
                'nama' => 'Riko Sutanto',
                'NIP' => '004',
                'password' => Hash::make('admin123'),
                'jabatan' => 'Kepegawaian',
                'unitKerja' => 'Sekwil III / Pontianak',
                'role' => 'Admin',
            ],
            [
                'nama' => 'Surya Randika',
                'NIP' => '005',
                'password' => Hash::make('admin123'),
                'jabatan' => 'BMN',
                'unitKerja' => 'Balai',
                'role' => 'Admin',
            ],
            
            // --- USERS (7 Users) ---
            [
                'nama' => 'Budi Santoso',
                'NIP' => '01',
                'password' => Hash::make('user123'),
                'jabatan' => 'Staff',
                'unitKerja' => 'Sekwil I / Palangka Raya',
                'role' => 'User',
            ],
            [
                'nama' => 'Citra Lestari',
                'NIP' => '02',
                'password' => Hash::make('user123'),
                'jabatan' => 'Staff',
                'unitKerja' => 'Sekwil II / Samarinda',
                'role' => 'User',
            ],
            [
                'nama' => 'Doni Firmansyah',
                'NIP' => '03',
                'password' => Hash::make('user123'),
                'jabatan' => 'Polisi Hutan',
                'unitKerja' => 'Sekwil III / Pontianak',
                'role' => 'User',
            ],
            [
                'nama' => 'Eka Putri',
                'NIP' => '04',
                'password' => Hash::make('user123'),
                'jabatan' => 'Staff',
                'unitKerja' => 'Balai',
                'role' => 'User',
            ],
            [
                'nama' => 'Fajar Nugroho',
                'NIP' => '05',
                'password' => Hash::make('user123'),
                'jabatan' => 'Staff',
                'unitKerja' => 'Sekwil I / Palangka Raya',
                'role' => 'User',
            ],
             [
                'nama' => 'Gita Wulandari',
                'NIP' => '06',
                'password' => Hash::make('user123'),
                'jabatan' => 'Staff',
                'unitKerja' => 'Sekwil II / Samarinda',
                'role' => 'User',
            ],
             [
                'nama' => 'Hadi Prawira',
                'NIP' => '07',
                'password' => Hash::make('user123'),
                'jabatan' => 'Staff',
                'unitKerja' => 'Balai',
                'role' => 'User',
            ],
        ];

        // Masukkan semua data ke dalam tabel 'users' sekaligus
        DB::table('users')->insert($users);
    }
}
