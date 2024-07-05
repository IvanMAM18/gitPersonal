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
        Schema::create('catalogo_tramite_condicionantes', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('catalogo_tramite_id');
            $table->unsignedInteger('condicionante_id');
            $table->foreign('catalogo_tramite_id', 'catalogo_tramite_id_foreign_key')->references('id')->on('catalogo_tramites');
            $table->foreign('condicionante_id', 'condicionante_id_foreign_key')->references('id')->on('condicionantes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalogo_tramite_condicionantes');
    }
};
