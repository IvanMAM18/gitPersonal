<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAvisosEnterosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('avisos_entero', function (Blueprint $table) {
            $table->id();
            $table->integer('no_aviso');
            $table->unsignedInteger('tramite_id');
            $table->unsignedInteger('pago_id');
            $table->unsignedInteger('servidor_publico_id');
            $table->enum('estado', ['VIGENTE', 'EXPIRADO', 'PAGADO']);
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
        Schema::dropIfExists('avisos_entero');
    }
}
