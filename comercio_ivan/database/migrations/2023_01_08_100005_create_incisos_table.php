<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncisosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incisos', function (Blueprint $table) {
            $table->id();
            $table->integer('inciso');
            $table->string('descripcion')->nullable();
            $table->string('clave_sat')->nullable();
            $table->string('descripcion_sat')->nullable();
            $table->string('cri')->nullable();
            $table->string('marco_juridico')->nullable();
            $table->string('formula')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('incisos');
    }
}
