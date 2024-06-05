<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncisos2022Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incisos_2022', function (Blueprint $table) {
            $table->id();
            $table->string('inciso', 5)->nullable();
            $table->string('descp', 550)->nullable();
            $table->string('cri', 10)->nullable();
            $table->string('clave_sat', 10)->nullable();
            $table->string('descp_sat', 100)->nullable();
            $table->string('ur', 14)->nullable();
            $table->boolean('activ');
            $table->string('cuenta', 4)->nullable();
            $table->string('subcta', 3)->nullable();
            $table->string('ssubcta', 3)->nullable();
            $table->string('mjuridico', 550)->nullable();
            $table->string('ramo', 5)->nullable();
            $table->string('login', 8)->nullable();
            $table->boolean('ingresa')->nullable();
            $table->date('fec_alta')->nullable();
            $table->string('logmod', 8)->nullable();
            $table->date('fec_mod')->nullable();
            $table->boolean('manual')->nullable();
            $table->string('cta_nueva', 15)->nullable();
            $table->string('cta_ante', 15)->nullable();
            $table->integer('cobro_esp')->nullable();
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
        Schema::dropIfExists('incisos_2022');
    }
}
