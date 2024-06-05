<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeObservacionesColumnToEstadosRevision extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Schema::table('estados_revision', function (Blueprint $table) {
        //     $table->dropColumn('observaciones');

        // });
        // Schema::table('estados_revision', function (Blueprint $table) {
        //    // $table->dropColumn('observaciones');
        //    // $table->dropColumn('observaciones_backup');
        //     $table->longText('observaciones')->after("requisito_revision_id")->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::table('estados_revision', function (Blueprint $table) {
        //     $table->dropColumn('observaciones_backup');
        // });
    }
}
