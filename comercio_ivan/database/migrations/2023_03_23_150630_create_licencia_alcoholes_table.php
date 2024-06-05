<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLicenciaAlcoholesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('licencia_alcoholes', function (Blueprint $table) {
            $table->id();
            $table->string('clave')->nullable();
            $table->string('folio')->nullable();
            $table->string('tipo')->nullable();
            $table->string('tipo_abreviado')->nullable();
            $table->string('movimientos')->nullable();
            $table->string('licencia_alcohol')->nullable();
            $table->boolean('vigente')->default(0);
            $table->unsignedBigInteger('trabajador_id')->nullable();
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
        Schema::dropIfExists('licencia_alcoholes');
    }
}
