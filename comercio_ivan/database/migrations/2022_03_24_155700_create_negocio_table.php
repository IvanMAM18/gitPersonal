<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNegocioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('negocios', function (Blueprint $table) {
            $table->id();
            $table->integer('direccion_id');
            $table->integer('tipo_de_negocio_id');
            $table->integer('persona_id');
            $table->integer('persona_moral_id')->nullable();
            $table->string('nombre_del_negocio');
            $table->integer('categoria_id');
            $table->string('estatus');
            $table->integer('giro_comercial_id')->default(0);
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('negocios');
    }
}
