<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSareDenueJoinTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sare_denue_join', function (Blueprint $table) {
            $table->id();
            $table->string('FOLIO')->nullable();
            $table->string('NOMBRE')->nullable();
            $table->string('APELLIDO1')->nullable();
            $table->string('APELLIDO2')->nullable();
            $table->string('ESTABLECIMIENTO')->nullable();
            $table->string('DIRECCION')->nullable();
            $table->string('ENTRE')->nullable();
            $table->string('YENTRE')->nullable();
            $table->string('ENCONTRADOS')->nullable();
            $table->string('SARE_FOLIO')->nullable();
            $table->string('LICENCIA_2022')->nullable();
            $table->double('LATITUDE', 13, 9)->nullable();
            $table->double('LONGITUDE', 13, 9)->nullable();
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
        Schema::dropIfExists('sare_denue_join');
    }
}
