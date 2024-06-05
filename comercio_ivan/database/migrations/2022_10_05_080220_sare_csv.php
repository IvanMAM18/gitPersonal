<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SareCsv extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sare_csv', function (Blueprint $table) {
            $table->id();
            $table->string('CLAVEMUN')->nullable();
            $table->string('FOLIO')->nullable();
            $table->string('CUENTAS')->nullable();
            $table->string('CURP')->nullable();
            $table->string('RFC')->nullable();
            $table->string('NOMBRE')->nullable();
            $table->string('APELLIDO1')->nullable();
            $table->string('APELLIDO2')->nullable();
            $table->string('ESTABLECIMIENTO')->nullable();
            $table->string('DIRECCION')->nullable();
            $table->string('ENTRE')->nullable();
            $table->string('YENTRE')->nullable();
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
        Schema::dropIfExists('sare_csv');
    }
}
