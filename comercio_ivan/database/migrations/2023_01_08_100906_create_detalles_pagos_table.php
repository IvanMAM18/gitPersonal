<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDetallesPagosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('detalles_pagos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('pago_id');
            $table->unsignedInteger('inciso_id');
            $table->unsignedInteger('descuento_id');
            $table->decimal('descuento_importe', 12, 2);
            $table->decimal('importe', 12, 2);
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
        Schema::dropIfExists('detalles_pagos');
    }
}
