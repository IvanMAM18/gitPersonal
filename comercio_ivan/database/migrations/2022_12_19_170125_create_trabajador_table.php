<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrabajadorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trabajadores', function (Blueprint $table) {
            $table->id();
            $table->integer('persona_id')->nullable();
            $table->integer('departamento_id')->nullable();
            $table->integer('entidad_revisora_id')->nullable();
            $table->integer('rol_id');
            $table->string('numero_trabajador')->nullable();
            $table->string('nombre_usuario');
            $table->string('contrasena');
            $table->string('firma_path')->nullable();
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
        Schema::dropIfExists('trabajadores');
    }
}
