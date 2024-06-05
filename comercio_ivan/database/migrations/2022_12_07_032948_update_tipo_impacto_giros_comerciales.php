<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTipoImpactoGirosComerciales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->dropColumn('tipo');
        });
        Schema::table('giro_comercial', function (Blueprint $table) {
            $table->enum('tipo', ['bajo_impacto', 'mediano_alto_impacto'])->default('bajo_impacto');
        });
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
