<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DeleteRegimenCapitalColumnFromDatosFacturacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('datos_facturacion', function (Blueprint $table) {
            $table->dropColumn('regimen_capital');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('datos_facturacion', function (Blueprint $table) {
            $table->string('regimen_capital')->nullable();
        });
    }
}
