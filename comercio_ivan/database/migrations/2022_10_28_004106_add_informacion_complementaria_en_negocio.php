<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInformacionComplementariaEnNegocio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('negocios', function (Blueprint $table) {
            //$table->enum('tipo', ['bajo_impacto', 'mediano_impacto', 'alto_impacto'])->default('bajo_impacto');
            $table->string('tipo_anuncio')->nullable();
            $table->string('leyenda_anuncio')->nullable();
            $table->string('lugar_instalacion')->nullable();
            $table->string('sector')->nullable();
            $table->string('fecha_inicio_operaciones')->nullable();
            $table->integer('largo_anuncio')->nullable();
            $table->integer('ancho_anuncio')->nullable();
            $table->integer('inversion')->nullable();
            $table->integer('no_empleados_h')->nullable();
            $table->integer('no_empleados_m')->nullable();
            $table->boolean('empleados_cap_diferentes')->nullable();
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
            $table->dropColumn('tipo_anuncio');
            $table->dropColumn('leyenda_anuncio');
            $table->dropColumn('lugar_instalacion');
            $table->dropColumn('sector');
            $table->dropColumn('fecha_inicio_operaciones');
            $table->dropColumn('largo_anuncio');
            $table->dropColumn('ancho_anuncio');
            $table->dropColumn('inversion');
            $table->dropColumn('no_empleados_h');
            $table->dropColumn('no_empleados_m');
            $table->dropColumn('empleados_cap_diferentes');
        });
    }
}
