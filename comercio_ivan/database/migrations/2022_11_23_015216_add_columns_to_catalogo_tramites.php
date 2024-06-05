<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToCatalogoTramites extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_tramites', function (Blueprint $table) {
            $table->boolean('pago')->nullable();
            $table->boolean('resolutivo')->nullable();
            $table->boolean('en_linea')->nullable();
            $table->enum('tipo', ['publico', 'interno'])->nullable();
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
            $table->dropColumn('pago');
            $table->dropColumn('resolutivo');
            $table->dropColumn('en_linea');
            $table->dropColumn('tipo');
        });
    }
}
