<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTramiteIdOnRevisionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('revision', function (Blueprint $table) {
            $table->integer('tramite_id')->nullable()->after('negocio_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('revision', function (Blueprint $table) {
            $table->dropColumn('tramite_id');
        });
    }
}
