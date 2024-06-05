<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConceptosCobros2017Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('conceptos_cobros_2017', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('id_concepto');
            $table->unsignedInteger('id_cveingreso');
            $table->string('area');
            $table->string('tramite');
            $table->string('descripcion');
            $table->string('tipo_persona')->nullable();
            $table->string('concepto_lh')->nullable();
            $table->string('unidad')->nullable();
            $table->boolean('activ');
            $table->string('estado')->nullable();
            $table->string('observaciones')->nullable();
            $table->integer('rangomax')->nullable();
            $table->integer('rangomin')->nullable();
            $table->string('homoclave')->nullable();
            $table->string('ccorto')->nullable();
            $table->string('sccorto')->nullable();
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
        Schema::dropIfExists('conceptos_cobros_2017');
    }
}
