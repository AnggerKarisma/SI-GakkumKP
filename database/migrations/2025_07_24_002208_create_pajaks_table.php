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
        Schema::create('pajak', function (Blueprint $table) {
            $table->id('pajakID');
            $table->unsignedBigInteger('kendaraanID')->unique();
            $table->string('alamat');
            $table->decimal('biaya', 12, 2)->nullable();
            $table->integer('tahunPembuatan')->nullable();
            $table->string('silinder');
            $table->string('warnaKB');
            $table->string('noRangka')->unique();
            $table->string('noMesin')->unique();
            $table->string('noBPKB')->unique();
            $table->string('warnaTNKB');
            $table->enum('bahanBakar',['Bensin','Solar'])->nullable();
            $table->integer('tahunRegistrasi')->nullable();
            $table->date('berlakuSampai')->nullable();
            $table->timestamps();

            $table->foreign('kendaraanID')->references('kendaraanID')->on('kendaraan')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pajak');
    }
};
