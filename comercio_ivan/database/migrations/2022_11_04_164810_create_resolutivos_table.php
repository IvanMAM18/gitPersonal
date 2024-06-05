<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResolutivosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resolutivos', function (Blueprint $table) {
            $table->id();
            $table->timestamp('fecha_expedicion')->nullable();
            $table->timestamp('fecha_expiracion')->nullable();
            $table->integer('tipo_de_registro');
            $table->integer('servidor_publico');
            $table->json('detalles')->nullable();
            $table->string('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resolutivos');
    }
}
