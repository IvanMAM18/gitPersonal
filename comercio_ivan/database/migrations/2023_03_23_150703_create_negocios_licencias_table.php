<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNegociosLicenciasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('negocios_licencias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trabajador_id')->nullable();
            $table->unsignedBigInteger('negocio_propietario_id');
            $table->foreign('negocio_propietario_id')->references('id')->on('negocios');
            $table->unsignedBigInteger('negocio_operador_id');
            $table->foreign('negocio_operador_id')->references('id')->on('negocios');
            $table->foreign('licencia_id')->references('id')->on('licencia_alcoholes');
            $table->unsignedBigInteger('licencia_id');
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
        Schema::dropIfExists('negocios_licencias');
    }
}
