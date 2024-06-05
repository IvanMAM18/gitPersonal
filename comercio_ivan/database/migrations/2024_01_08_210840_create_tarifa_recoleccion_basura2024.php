<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTarifaRecoleccionBasura2024 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tarifa_recoleccion_basura2024', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion')->nullable();
            $table->string('volumen')->nullable();
            $table->string('sector')->nullable();
            $table->string('tipo_tarifa')->nullable();
            $table->decimal('valor_anual', 12, 2);
            $table->decimal('valor', 12, 6);
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
        Schema::dropIfExists('tarifa_recoleccion_basura2024');
    }
}
