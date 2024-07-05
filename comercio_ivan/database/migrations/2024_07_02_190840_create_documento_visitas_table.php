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
        Schema::create('inspectores.documento_visitas', function (Blueprint $table) {
            $table->id();
            // foreigns
            $table->integer('visita_id');
            $table->foreign('visita_id', 'visita_id_foreign_key')->references('id')->on('inspectores.visitas');
            // campos
            $table->string('documento_ruta');
            // timestamps
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspectores.documento_visitas');
    }
};
