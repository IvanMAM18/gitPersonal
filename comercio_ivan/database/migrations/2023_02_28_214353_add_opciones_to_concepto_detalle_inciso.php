<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOpcionesToConceptoDetalleInciso extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('conceptos_detalles_incisos', function (Blueprint $table) {
            $table->text('opciones')->after('formula')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('conceptos_detalles_incisos', function (Blueprint $table) {
            $table->dropColumn('opciones');
        });
    }
}
