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
            $table->string('merk');
            $table->string('model');
            $table->enum('jenisKendaraan',['mobil','motor']);
            $table->string('penanggungjawab');
            $table->string('NUP');
            $table->enum('unitKerja',[
                'Balai',
                'Sekwil I / Palangka raya',
                'Sekwil II / Samarinda',
                'Sekwil III / Pontianak'
            ]);
            $table->enum('statKendaraan',['Stand by', 'Not Available', 'Maintenance']);
            $table->string('kondisi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kendaraan');
    }
};
