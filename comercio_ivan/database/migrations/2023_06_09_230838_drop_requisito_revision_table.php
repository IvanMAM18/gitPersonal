<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropRequisitoRevisionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('requisito_revision');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('requisito_revision', function (Blueprint $table) {
            $table->id();
            $table->integer('revision_id');
            $table->integer('requisito_id');
            $table->integer('catalogo_id');
            $table->integer('status')->default(0);
            $table->integer('estado_revision_id')->nullable();
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }
}
