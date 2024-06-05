<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNegocioIdAndEntidadRevisoraIdToResolutivos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('resolutivos', function (Blueprint $table) {
            $table->integer('negocio_id')->nullable();
            $table->integer('entidad_revisora_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('resolutivos', function (Blueprint $table) {
            $table->dropColumn('negocio_id');
            $table->dropColumn('entidad_revisora_id');
        });
    }
}
