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

        Schema::create('inspectores.activity_logs', function (Blueprint $table) {
            $table->id();
            $table->integer('trabajador_id');
            $table->foreign('trabajador_id', 'trabajador_id_foreign_key')->references('id')->on('public.trabajadores');
            $table->string('accion');
            $table->string('tabla');
            $table->integer('registro_afectado_id');
            $table->string('ip');
            $table->json('metadata');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspectores.activity_logs');
    }
};
