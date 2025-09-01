<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('kendaraan', function (Blueprint $table) {
            $table->dropColumn('biaya');
        });
    }

    public function down()
    {
        Schema::table('kendaraan', function (Blueprint $table) {
            $table->decimal('biaya', 15, 2)->nullable();
        });
    }

};
