<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Nonaktifkan foreign key checks untuk truncate
        Schema::disableForeignKeyConstraints();
        DB::table('pajak')->truncate();
        Schema::enableForeignKeyConstraints();

        $pajakData = [
            // --- Pajak untuk 10 Mobil ---
            ['kendaraanID' => 1,  'alamat' => 'Jl. Pahlawan No. 12, Samarinda', 'biaya' => 3200000.00, 'tahunPembuatan' => 2022, 'silinder' => '2400cc', 'warnaKB' => 'Hitam', 'noRangka' => 'MHF123ABR001', 'noMesin' => '2GD1234567', 'noBPKB' => 'BPKB-SMD-001', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Solar', 'tahunRegistrasi' => 2022, 'berlakuSampai' => '2026-03-15'],
            ['kendaraanID' => 2,  'alamat' => 'Jl. Gajah Mada No. 8, Pontianak', 'biaya' => 4500000.00, 'tahunPembuatan' => 2021, 'silinder' => '2500cc', 'warnaKB' => 'Putih', 'noRangka' => 'MHF567CDR002', 'noMesin' => '4D56123456', 'noBPKB' => 'BPKB-PTK-002', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Solar', 'tahunRegistrasi' => 2021, 'berlakuSampai' => '2025-11-20'],
            ['kendaraanID' => 3,  'alamat' => 'Jl. Imam Bonjol No. 3, Balikpapan', 'biaya' => 2100000.00, 'tahunPembuatan' => 2020, 'silinder' => '1500cc', 'warnaKB' => 'Silver', 'noRangka' => 'MHF910EFR003', 'noMesin' => '1NRVE12345', 'noBPKB' => 'BPKB-BPP-003', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2020, 'berlakuSampai' => '2025-08-10'], 
            ['kendaraanID' => 4,  'alamat' => 'Jl. Pahlawan No. 14, Samarinda', 'biaya' => 3100000.00, 'tahunPembuatan' => 2019, 'silinder' => '2500cc', 'warnaKB' => 'Abu-abu', 'noRangka' => 'MHF887GHR004', 'noMesin' => '4JK1123456', 'noBPKB' => 'BPKB-SMD-004', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Solar', 'tahunRegistrasi' => 2019, 'berlakuSampai' => '2026-01-05'],
            ['kendaraanID' => 5,  'alamat' => 'Jl. Gajah Mada No. 10, Pontianak', 'biaya' => 3500000.00, 'tahunPembuatan' => 2023, 'silinder' => '2200cc', 'warnaKB' => 'Merah', 'noRangka' => 'MHF112IJR005', 'noMesin' => 'P4AT123456', 'noBPKB' => 'BPKB-PTK-005', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Solar', 'tahunRegistrasi' => 2023, 'berlakuSampai' => '2026-06-25'],
            ['kendaraanID' => 6,  'alamat' => 'Jl. Imam Bonjol No. 5, Balikpapan', 'biaya' => 1900000.00, 'tahunPembuatan' => 2018, 'silinder' => '1400cc', 'warnaKB' => 'Putih', 'noRangka' => 'MHF334KLR006', 'noMesin' => 'K14B123456', 'noBPKB' => 'BPKB-BPP-006', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2018, 'berlakuSampai' => '2025-10-01'], 
            ['kendaraanID' => 7,  'alamat' => 'Jl. A. Yani No. 1, Palangka Raya', 'biaya' => 4800000.00, 'tahunPembuatan' => 2022, 'silinder' => '2400cc', 'warnaKB' => 'Hitam', 'noRangka' => 'MHF556MNR007', 'noMesin' => '2GD1234568', 'noBPKB' => 'BPKB-PLK-007', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Solar', 'tahunRegistrasi' => 2022, 'berlakuSampai' => '2027-02-18'],
            ['kendaraanID' => 8,  'alamat' => 'Jl. Gajah Mada No. 12, Pontianak', 'biaya' => 2300000.00, 'tahunPembuatan' => 2020, 'silinder' => '1500cc', 'warnaKB' => 'Silver', 'noRangka' => 'MHF778OPR008', 'noMesin' => '2NRVE12345', 'noBPKB' => 'BPKB-PTK-008', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2020, 'berlakuSampai' => '2025-12-30'],
            ['kendaraanID' => 9,  'alamat' => 'Jl. Imam Bonjol No. 7, Balikpapan', 'biaya' => 2800000.00, 'tahunPembuatan' => 2021, 'silinder' => '1500cc', 'warnaKB' => 'Merah', 'noRangka' => 'MHF990QRR009', 'noMesin' => 'L15B112345', 'noBPKB' => 'BPKB-BPP-009', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2021, 'berlakuSampai' => '2026-04-11'],
            ['kendaraanID' => 10, 'alamat' => 'Jl. Pahlawan No. 16, Samarinda', 'biaya' => 3000000.00, 'tahunPembuatan' => 2023, 'silinder' => '1500cc', 'warnaKB' => 'Putih', 'noRangka' => 'MHF101STR010', 'noMesin' => 'L15CT12345', 'noBPKB' => 'BPKB-SMD-010', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2023, 'berlakuSampai' => '2026-07-22'],
            ['kendaraanID' => 11, 'alamat' => 'Jl. Pahlawan No. 22, Samarinda', 'biaya' => 350000.00, 'tahunPembuatan' => 2022, 'silinder' => '150cc', 'warnaKB' => 'Merah', 'noRangka' => 'MTR223UVR011', 'noMesin' => 'K561234567', 'noBPKB' => 'BPKB-SMD-011', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2022, 'berlakuSampai' => '2026-05-14'],
            ['kendaraanID' => 12, 'alamat' => 'Jl. A. Yani No. 3, Palangka Raya', 'biaya' => 450000.00, 'tahunPembuatan' => 2023, 'silinder' => '155cc', 'warnaKB' => 'Biru', 'noRangka' => 'MTR445WXR012', 'noMesin' => 'B6H1234567', 'noBPKB' => 'BPKB-PLK-012', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2023, 'berlakuSampai' => '2026-08-30'],
            ['kendaraanID' => 13, 'alamat' => 'Jl. Gajah Mada No. 14, Pontianak', 'biaya' => 380000.00, 'tahunPembuatan' => 2021, 'silinder' => '150cc', 'warnaKB' => 'Hijau', 'noRangka' => 'MTR667YZR013', 'noMesin' => 'LX15012345', 'noBPKB' => 'BPKB-PTK-013', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2021, 'berlakuSampai' => '2026-02-02'],
            ['kendaraanID' => 14, 'alamat' => 'Jl. Pahlawan No. 24, Samarinda', 'biaya' => 280000.00, 'tahunPembuatan' => 2020, 'silinder' => '125cc', 'warnaKB' => 'Hitam', 'noRangka' => 'MTR121ZAR014', 'noMesin' => 'JF61123456', 'noBPKB' => 'BPKB-SMD-014', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2020, 'berlakuSampai' => '2025-11-11'],
            ['kendaraanID' => 15, 'alamat' => 'Jl. Imam Bonjol No. 9, Balikpapan', 'biaya' => 320000.00, 'tahunPembuatan' => 2019, 'silinder' => '150cc', 'warnaKB' => 'Merah', 'noRangka' => 'MTR343BCR015', 'noMesin' => 'G420123456', 'noBPKB' => 'BPKB-BPP-015', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2019, 'berlakuSampai' => '2025-09-25'],
            ['kendaraanID' => 16, 'alamat' => 'Jl. Gajah Mada No. 16, Pontianak', 'biaya' => 480000.00, 'tahunPembuatan' => 2023, 'silinder' => '155cc', 'warnaKB' => 'Biru', 'noRangka' => 'MTR565DER016', 'noMesin' => 'B6H1234568', 'noBPKB' => 'BPKB-PTK-016', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2023, 'berlakuSampai' => '2026-10-18'],
            ['kendaraanID' => 17, 'alamat' => 'Jl. Imam Bonjol No. 11, Balikpapan', 'biaya' => 470000.00, 'tahunPembuatan' => 2022, 'silinder' => '160cc', 'warnaKB' => 'Hitam Doff', 'noRangka' => 'MTR787FGR017', 'noMesin' => 'KF48123456', 'noBPKB' => 'BPKB-BPP-017', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2022, 'berlakuSampai' => '2026-09-09'],
            ['kendaraanID' => 18, 'alamat' => 'Jl. A. Yani No. 5, Palangka Raya', 'biaya' => 550000.00, 'tahunPembuatan' => 2023, 'silinder' => '150cc', 'warnaKB' => 'Kuning', 'noRangka' => 'MTR909HIR018', 'noMesin' => 'MA3B123456', 'noBPKB' => 'BPKB-PLK-018', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2023, 'berlakuSampai' => '2027-01-20'],
            ['kendaraanID' => 19, 'alamat' => 'Jl. Gajah Mada No. 18, Pontianak', 'biaya' => 460000.00, 'tahunPembuatan' => 2022, 'silinder' => '160cc', 'warnaKB' => 'Putih', 'noRangka' => 'MTR131JKR019', 'noMesin' => 'KF48123457', 'noBPKB' => 'BPKB-PTK-019', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2022, 'berlakuSampai' => '2026-11-04'],
            ['kendaraanID' => 20, 'alamat' => 'Jl. Imam Bonjol No. 13, Balikpapan', 'biaya' => 390000.00, 'tahunPembuatan' => 2020, 'silinder' => '175cc', 'warnaKB' => 'Hitam', 'noRangka' => 'MTR141LMR020', 'noMesin' => 'EJ17512345', 'noBPKB' => 'BPKB-BPP-020', 'warnaTNKB' => 'Hitam', 'bahanBakar' => 'Bensin', 'tahunRegistrasi' => 2020, 'berlakuSampai' => '2025-07-07'],
        ];

        DB::table('pajak')->insert($pajakData);
    }
}
