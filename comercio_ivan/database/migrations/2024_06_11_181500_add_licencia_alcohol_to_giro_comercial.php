<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLicenciaAlcoholToGiroComercial extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->boolean('licencia_alcohol_giro_comercial')->nullable();
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
            $table->dropColumn('licencia_alcohol_giro_comercial');
        });
    }
}
