<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDatosFacturacionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('datos_facturacion', function (Blueprint $table) {
            $table->id();
            $table->integer('persona_id')->nullable();
            $table->integer('persona_moral_id')->nullable();
            $table->integer('direccion_id')->nullable();
            $table->integer('regimen_fiscal')->nullable();
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
        Schema::dropIfExists('datos_facturacion');
    }
}
