<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCobroCertificadoLicenciaToGiroComercial extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->boolean('cobro_programa_interno')->nullable()->default(false);
            $table->boolean('certificado_medio_ambiente')->nullable()->default(false);
            $table->boolean('licencia_alcohol')->nullable()->default(false);
        });
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->dropColumn('cobro_programa_interno');
            $table->dropColumn('certificado_medio_ambiente');
            $table->dropColumn('licencia_alcohol');
        });
    }
};
