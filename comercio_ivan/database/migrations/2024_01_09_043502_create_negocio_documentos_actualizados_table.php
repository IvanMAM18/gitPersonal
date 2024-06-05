<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNegocioDocumentosActualizadosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('negocio_documento_actualizados', function (Blueprint $table) {
            $table->id();
            $table->integer('negocio_id');
            $table->string('docto');
            $table->string('ruta');
            $table->integer('tramite_id');
            $table->integer('año_refrendo');
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
        Schema::dropIfExists('negocio_documento_actualizados');
    }
}
