<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTarifaProgramasInternos2024 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tarifa_programas_internos2024', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion')->nullable();
            $table->integer('min_trabajadores')->nullable();
            $table->decimal('valor', 12, 2);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tarifa_programas_internos2024');
    }
}
