<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConceptosDetallesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('conceptos_detalles', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('concepto_id');
            $table->string('descripcion', 512)->nullable();
            $table->string('formula')->nullable();
            $table->decimal('valor', 12, 2)->nullable();
            $table->boolean('usar_valor_recoleccion_basura')->default(false);
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
        Schema::dropIfExists('conceptos_detalles');
    }
}
