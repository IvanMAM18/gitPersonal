<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusEnviadoToNegocios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('negocios', function ($table) {
            $table->dropColumn('status');
        });
        Schema::table('negocios', function ($table) {
            $table->enum('status', ['VISTO BUENO', 'RECHAZADO', 'PAGADO', 'EN REVISION', 'ENVIADO'])->default('ENVIADO');
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
            //
        });
    }
}
