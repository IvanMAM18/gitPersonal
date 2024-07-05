<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateValidarProgramaInternoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('validar_programa_interno', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('negocio_id');
            $table->unsignedBigInteger('trabajador_id');
            $table->text('observacion')->nullable();
            $table->year('anio');
            $table->boolean('validar_programa_interno')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('negocio_id')->references('id')->on('negocios')->onDelete('cascade');
            $table->foreign('trabajador_id')->references('id')->on('users')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('validar_programa_interno');
    }
}
