<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inspectores.inspeccions', function (Blueprint $table) {
            $table->id();
            // foreigns
            $table->integer('negocio_id');
            $table->foreign('negocio_id', 'negocio_id_foreign_key')->references('id')->on('public.negocios');
            // campos
            $table->string('tipo_negocio');
            $table->double('latitud', 13, 8);
            $table->double('longitud', 13, 8);
            $table->string('direccion');
            $table->string('nombre_del_negocio');
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
        Schema::dropIfExists('inspectores.inspeccions');
    }
};
