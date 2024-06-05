<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeAnchoLargoToNegocios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('negocios', function (Blueprint $table) {
            $table->decimal('ancho_anuncio', 12, 2)->nullable()->change();
            $table->decimal('largo_anuncio', 12, 2)->nullable()->change();
            $table->decimal('inversion', 12, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('negocios', function (Blueprint $table) {
            $table->integer('largo_anuncio')->nullable()->change();
            $table->integer('ancho_anuncio')->nullable()->change();
            $table->integer('inversion')->nullable()->change();
        });
    }
}
