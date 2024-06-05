<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCobros2017Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cobros_2017', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('id_cobro');
            $table->unsignedInteger('id_concepto');
            $table->string('area');
            $table->string('inciso', 5);
            $table->enum('base', ['UMA', 'FIJO', 'MANUAL', 'RANGO']);
            $table->integer('valor');
            $table->string('formula');
            $table->integer('valormin')->nullable();
            $table->integer('valormax')->nullable();
            $table->integer('valor2')->nullable();
            $table->string('nota')->default('');
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
        Schema::dropIfExists('cobros_2017');
    }
}
