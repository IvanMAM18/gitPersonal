<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableTarifaRecoleccionBasura extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tarifa_recoleccion_basura', function (Blueprint $table) {
            $table->id();
            $table->integer('giro_comercial_id');
            $table->string('periodo')->nullable();
            $table->string('volumen')->nullable();
            $table->double('valor_uma')->nullable();
            $table->string('descripcion')->nullable();
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
        Schema::dropIfExists('tarifa_recoleccion_basura');
    }
}
