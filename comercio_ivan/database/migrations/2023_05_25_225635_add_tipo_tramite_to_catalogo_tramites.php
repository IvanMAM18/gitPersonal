<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTipoTramiteToCatalogoTramites extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_tramites', function (Blueprint $table) {
            $table->enum('tipo_tramite', ['NEGOCIO', 'PERSONA'])->default('NEGOCIO');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('catalogo_tramites', function (Blueprint $table) {
            $table->dropColumn('tipo_tramite');
        });
    }
}
