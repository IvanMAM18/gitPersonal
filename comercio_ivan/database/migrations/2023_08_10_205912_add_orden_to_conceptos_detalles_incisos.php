<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOrdenToConceptosDetallesIncisos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('conceptos_detalles_incisos', function (Blueprint $table) {
            $table->smallInteger('orden')->default(1)->after('formula');
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
            $table->dropColumn('orden');
        });
    }
}
