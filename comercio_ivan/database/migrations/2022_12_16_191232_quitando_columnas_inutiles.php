<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class QuitandoColumnasInutiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // al final Ashley utilizó estos campos
        // Schema::table('estados_revision', function ($table) {
        //     $table->dropColumn('requisito_revision_id');
        // });
        // Schema::table('requisito_revision', function ($table) {
        //     $table->dropColumn('revision_id');
        // });
        // Schema::table('negocio_requisito_revision', function ($table) {
        //     $table->dropColumn('revision_id');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
