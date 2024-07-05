<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AgregarCampoQuienActualizaNegocio extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('negocios', function (Blueprint $table) {
            $table->unsignedBigInteger('trabajador_modifica_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('negocios', function (Blueprint $table) {
            $table->dropColumn('trabajador_modifica_id');
        });
    }
}
