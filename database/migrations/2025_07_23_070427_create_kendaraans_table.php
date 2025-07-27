<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kendaraan', function (Blueprint $table) {
            $table->id('kendaraanID');
            $table->string('namaKendaraan');
            $table->string('plat')->unique();
            $table->string('pemilik');
            $table->string('alamat');
            $table->string('merk');
            $table->string('model');
            $table->enum('jenisKendaraan',['mobil','motor']);
            $table->date('tahunPembuatan')->nullable();
            $table->string('silinder');
            $table->string('warnaKB');
            $table->string('noRangka');
            $table->string('noMesin');
            $table->string('noBPKB');
            $table->string('warnaTNKB');
            $table->enum('bahanBakar',['Bensin','Solar'])->nullable();
            $table->integer('tahunRegistrasi')->nullable();
            $table->date('berlakuSampai')->nullable();
            $table->string('penanggungjawab');
            $table->string('NUP');
            $table->enum('unitKerja',[
                'Balai',
                'Sekwil I / Palangka raya',
                'Sekwil II / Samarinda',
                'Sekwil II / Pontianak'
            ]);
            $table->enum('statKendaraan',['Stand By', 'Not Available', 'Maintenance']);
            $table->string('Kkendaraan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kendaraan');
    }
};
