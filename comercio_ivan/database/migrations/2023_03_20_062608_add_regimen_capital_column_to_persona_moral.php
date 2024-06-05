<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRegimenCapitalColumnToPersonaMoral extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('personas_morales', function (Blueprint $table) {
            $table->string('regimen_capital')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('personas_morales', function (Blueprint $table) {
            $table->dropColumn('regimen_capital');
        });
    }
}
