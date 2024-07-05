<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inspectores.visitas', function (Blueprint $table) {
            $table->id();

            $table->integer('inspeccion_id')->unsigned();
            $table->foreign('inspeccion_id', 'inspeccion_id_foreign_key')->references('id')->on('inspectores.inspeccions');

            $table->integer('trabajador_id')->unsigned();
            $table->foreign('trabajador_id', 'trabajador_id_foreign_key')->references('id')->on('public.trabajadores');

            $table->integer('tipo_visita_id')->unsigned();
            $table->foreign('tipo_visita_id', 'tipo_visita_id_foreign_key')->references('id')->on('inspectores.tipos_visita');

            $table->string('observaciones', 2000);
            $table->double('latitud', 13, 8);
            $table->double('longitud', 13, 8);
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspectores.visitas');
    }
};
