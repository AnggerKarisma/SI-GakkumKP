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
            $table->string('nostnk');
            $table->date('activeSTNK')->nullable();
            $table->date('activePT')->nullable();
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
