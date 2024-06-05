<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTarifaProteccionCivil2024Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tarifa_proteccion_civil2024', function (Blueprint $table) {
            $table->id();
            $table->string('sector')->nullable();
            $table->string('tipo_tarifa')->nullable();
            $table->foreignId('concepto_detalle_id');
            $table->boolean('programa_interno');
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
        Schema::dropIfExists('tarifa_proteccion_civil2024');
    }
}
