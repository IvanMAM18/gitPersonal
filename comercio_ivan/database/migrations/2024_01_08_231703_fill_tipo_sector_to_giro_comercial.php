<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class FillTipoSectorToGiroComercial extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('giro_comercial')->
            where('clave_scian', 'like', '31%')->
            orWhere('clave_scian', 'like', '32%')->
            orWhere('clave_scian', 'like', '33%')->
            orWhere('clave_scian', '511112')->
            orWhere('clave_scian', '511111')->
            orWhere('clave_scian', '511122')->
            orWhere('clave_scian', '511121')->
            orWhere('clave_scian', '511132')->
            orWhere('clave_scian', '511131')->
            orWhere('clave_scian', '511142')->
            orWhere('clave_scian', '511141')->
            orWhere('clave_scian', '511192')->
            update(
                [
                    'tipo_sector' => 'INDUSTRIA',
                ]
            );
        DB::table('giro_comercial')->
            where('clave_scian', 'like', '43%')->
            orWhere('clave_scian', 'like', '46%')->
            orWhere('clave_scian', '512120')->
            orWhere('clave_scian', '541870')->
            update(
                [
                    'tipo_sector' => 'COMERCIO',
                ]
            );
        DB::table('giro_comercial')->
            where('clave_scian', 'like', '52%')->
            orWhere('clave_scian', 'like', '53%')->
            orWhere('clave_scian', 'like', '54%')->
            orWhere('clave_scian', 'like', '56%')->
            orWhere('clave_scian', 'like', '61%')->
            orWhere('clave_scian', 'like', '62%')->
            orWhere('clave_scian', 'like', '71%')->
            orWhere('clave_scian', 'like', '72%')->
            orWhere('clave_scian', 'like', '81%')->
            orWhere('clave_scian', '115111')->
            update(
                [
                    'tipo_sector' => 'SERVICIOS',
                ]
            );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
