<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateLicenciaAlcoholToGiroComercial extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->dropColumn('licencia_alcohol_giro_comercial');
        });
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->boolean('licencia_alcohol_giro_comercial')->nullable();
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
