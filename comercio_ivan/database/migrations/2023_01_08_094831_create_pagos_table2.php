<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagosTable2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('tramite_id');
            $table->unsignedInteger('servidor_publico_id');
            $table->enum('tipo', ['AVISO', 'WEB']);
            $table->string('autorizacion_bancaria');
            $table->string('referencia');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('descuento', 12, 2);
            $table->decimal('total', 12, 2);
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
        Schema::dropIfExists('pagos');
    }
}
