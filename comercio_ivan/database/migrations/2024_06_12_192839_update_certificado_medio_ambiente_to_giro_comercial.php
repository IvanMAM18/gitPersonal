<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCertificadoMedioAmbienteToGiroComercial extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->dropColumn('certificado_medio_ambiente');
        });
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->enum('certificado_medio_ambiente', ['TRUE','FALSE'])->default('FALSE');
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
