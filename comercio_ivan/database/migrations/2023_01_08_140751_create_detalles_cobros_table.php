<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDetallesCobrosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('detalles_cobros', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('cobro_detalle_id')->nullable();
            $table->unsignedInteger('concepto_cobro_id');
            $table->unsignedInteger('inciso_id');
            $table->decimal('valor', 12, 2);
            $table->decimal('base', 12, 2);
            $table->string('formula');
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
        Schema::dropIfExists('detalles_cobros');
    }
}
