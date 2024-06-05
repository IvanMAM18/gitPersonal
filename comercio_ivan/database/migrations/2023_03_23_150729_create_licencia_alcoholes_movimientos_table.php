<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLicenciaAlcoholesMovimientosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('licencia_alcoholes_movimientos', function (Blueprint $table) {
            $table->id();
            $table->foreign('licencia_alcoholes_anterior_id', 'licencia_anterior_foreign_key')
                ->references('id')
                ->on('licencia_alcoholes');

            $table->unsignedBigInteger('licencia_alcoholes_anterior_id');

            $table->foreign('licencia_alcoholes_nueva_id', 'licencia_nueva_foreign_key')
                ->references('id')
                ->on('licencia_alcoholes');

            $table->unsignedBigInteger('licencia_alcoholes_nueva_id');
            $table->string('acta_de_sesion')->nullable();
            $table->string('observacion')->nullable();
            $table->unsignedBigInteger('trabajador_id')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('licencia_alcoholes_movimientos');
    }
}
