<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCodigosPostalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('codigos_postales', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_postal')->nullable();
            $table->string('clave_colonia')->nullable();
            $table->string('nombre_localidad')->nullable();
            $table->string('tipo')->nullable();
            $table->string('clave_estado')->nullable();
            $table->integer('clave_estado_inegi')->nullable();
            $table->integer('clave_municipio')->nullable();
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
        Schema::dropIfExists('codigos_postales');
    }
}
