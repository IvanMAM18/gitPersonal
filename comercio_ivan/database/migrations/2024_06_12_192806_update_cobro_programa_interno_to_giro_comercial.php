<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCobroProgramaInternoToGiroComercial extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->dropColumn('cobro_programa_interno');
        });
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->boolean('cobro_programa_interno')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
