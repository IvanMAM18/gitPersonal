<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCobroProgramaInternoToGiroComercial extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->string('cobro_programa_interno')->nullable();
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
            $table->dropColumn('cobro_programa_interno');
        });
    }
}
