<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewValuesOnColumnImpactoGiroComercialToNegociosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Schema::table('negocios', function (Blueprint $table) {
        //     $table->enum('impacto_giro_comercial', ['bajo_impacto', 'mediano_alto_impacto'])->default('bajo_impacto')->nullable(false)->after('tarifa_recoleccion_id');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('negocios', function (Blueprint $table) {
            // $table->dropColumn('impacto_giro_comercial');
        });
    }
}
