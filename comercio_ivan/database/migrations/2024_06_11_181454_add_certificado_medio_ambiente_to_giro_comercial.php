<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCertificadoMedioAmbienteToGiroComercial extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->string('certificado_medio_ambiente')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->dropColumn('certificado_medio_ambiente');
        });
    }
}
