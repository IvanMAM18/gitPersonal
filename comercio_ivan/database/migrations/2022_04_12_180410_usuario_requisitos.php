<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UsuarioRequisitos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usuario_requisitos', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->enum('tipo_usuario', ['fisica', 'moral']);
            $table->integer('requisito_id');
            $table->string('archivo_path');
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
        Schema::dropIfExists('usuario_requisitos');
    }
}
