<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNewTramitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::rename('tramites', 'tramites_comercio');
        Schema::table('tramites_comercio', function (Blueprint $table) {
            $table->renameColumn('catalogo_tramite_id', 'tramite_id');
        });
        Schema::create('tramites', function (Blueprint $table) {
            $table->id();
            $table->integer('catalogo_tramites_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tramites_comercio');
    }
}
