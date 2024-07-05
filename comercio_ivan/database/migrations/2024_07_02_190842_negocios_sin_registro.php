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
        Schema::create('inspectores.negocios_sin_registro', function (Blueprint $table) {
            $table->id();
            // campos
            $table->string('direccion');
            $table->double('latitude', 13, 3);
            $table->double('longitude', 13, 3);
            $table->boolean('venta_alcohol');
            $table->string('nombre_del_negocio');
            $table->string('giros');
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
        Schema::dropIfExists('inspectores.negocios_sin_registro');
    }
};
