<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class AddVisorToRevisionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('revision', function ($table) {
            $table->dropColumn('status');
        });
        Schema::table('revision', function ($table) {
            $table->enum('status', ['PENDIENTE', 'ENVIADO', 'RECHAZADO', 'EN REVISION', 'APROBADO', 'VISOR'])->default('EN REVISION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('status');
    }
}
