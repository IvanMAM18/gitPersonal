<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inspectores.multas', function (Blueprint $table) {
            $table->id();
            $table->integer('visita_id');
            $table->foreign('visita_id', 'visita_id_foreign_key')->references('id')->on('inspectores.visitas');
            $table->integer('aviso_de_entero_id');
            $table->foreign('aviso_de_entero_id', 'aviso_de_entero_id_foreign_key')->references('id')->on('public.avisos_entero');
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
            $table->integer('trabajador_id');
            $table->foreign('trabajador_id', 'trabajador_id_foreign_key')->references('id')->on('public.trabajadores');
            $table->integer('negocio_id');
            $table->foreign('negocio_id', 'negocio_id_foreign_key')->references('id')->on('public.negocios');
            $table->string('tipo'); // negocio_comercio, negocio_sin_registro
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspectores.multas');
    }
};
