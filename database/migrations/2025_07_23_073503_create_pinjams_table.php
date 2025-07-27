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
        Schema::create('pinjam', function (Blueprint $table) {
            $table->id('pinjamID');
            $table->unsignedBigInteger('userID');
            $table->unsignedBigInteger('kendaraanID');
            $table->date('tglPinjam')->nullable();
            $table->date('tglKembali')->nullable();
            $table->timestamps();

            $table->foreign('userID')->references('userID')->on('users')->onDelete('cascade');
            $table->foreign('kendaraanID')->references('kendaraanID')->on('kendaraan')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pinjam');
    }
};
