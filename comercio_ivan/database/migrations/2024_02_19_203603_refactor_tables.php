<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RefactorTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tramites', function (Blueprint $table) {
            $table->string('tramitable_type')->nullable()->default(null)->after('id');
            $table->integer('tramitable_id')->nullable()->default(null)->after('id');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tramites', function (Blueprint $table) {
            $table->dropColumn('tramitable_type');
            $table->dropColumn('tramitable_id');
        });
    }
}
