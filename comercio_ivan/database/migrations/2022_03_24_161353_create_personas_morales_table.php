<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonasMoralestable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('personas_morales', function (Blueprint $table) {
            $table->id();
            $table->string('razon_social');
            $table->string('rfc')->unique();
            $table->string('acta_constitutiva_path');
            $table->string('carta_de_situacion_fiscal');
            $table->integer('persona_id');
            $table->integer('direccion_id');
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
        Schema::dropIfExists('personas_morales');
    }
}
