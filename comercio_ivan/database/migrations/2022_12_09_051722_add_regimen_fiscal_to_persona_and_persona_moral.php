<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRegimenFiscalToPersonaAndPersonaMoral extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('regimen_fiscal')->nullable();
        });
        Schema::table('personas_morales', function (Blueprint $table) {
            $table->string('regimen_fiscal')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('regimen_fiscal');
        });
        Schema::table('personas_morales', function (Blueprint $table) {
            $table->dropColumn('regimen_fiscal');
        });
    }
}
