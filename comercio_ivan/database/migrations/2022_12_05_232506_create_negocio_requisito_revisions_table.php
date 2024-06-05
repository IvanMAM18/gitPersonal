<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNegocioRequisitoRevisionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('negocio_requisito_revision', function (Blueprint $table) {
            $table->id();
            $table->integer('revision_id');
            $table->integer('requisito_id');
            $table->integer('catalogo_id');
            $table->integer('estado_revision_id');
            $table->enum('status', ['PENDIENTE', 'ENVIADO', 'RECHAZADO', 'EN REVISION', 'APROBADO']);
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
        Schema::dropIfExists('negocio_requisito_revision');
    }
}
