<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class FillTarifaProteccionCivil2024Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('tarifa_proteccion_civil2024')->
            insert([
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'AUTOEMPLEO',
                    'concepto_detalle_id' => '65',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'MICRO',
                    'concepto_detalle_id' => '66',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'PEQUEÑA',
                    'concepto_detalle_id' => '67',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'MEDIANA',
                    'concepto_detalle_id' => '68',
                    'programa_interno' => false,
                ],

                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'AUTOEMPLEO',
                    'concepto_detalle_id' => '69',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'MICRO',
                    'concepto_detalle_id' => '70',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'PEQUEÑA',
                    'concepto_detalle_id' => '71',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'MEDIANA',
                    'concepto_detalle_id' => '72',
                    'programa_interno' => false,
                ],

                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'MICRO',
                    'concepto_detalle_id' => '73',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'PEQUEÑA',
                    'concepto_detalle_id' => '74',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'MEDIANA',
                    'concepto_detalle_id' => '75',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'GRANDE',
                    'concepto_detalle_id' => '76',
                    'programa_interno' => false,
                ],
                [
                    'sector' => null,
                    'tipo_tarifa' => null,
                    'concepto_detalle_id' => '77',
                    'programa_interno' => false,
                ],

                // PROGRAMA INTERNO
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'AUTOEMPLEO',
                    'concepto_detalle_id' => '78',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'MICRO',
                    'concepto_detalle_id' => '79',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'PEQUEÑA',
                    'concepto_detalle_id' => '80',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'MEDIANA',
                    'concepto_detalle_id' => '81',
                    'programa_interno' => true,
                ],

                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'AUTOEMPLEO',
                    'concepto_detalle_id' => '82',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'MICRO',
                    'concepto_detalle_id' => '83',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'PEQUEÑA',
                    'concepto_detalle_id' => '84',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'MEDIANA',
                    'concepto_detalle_id' => '85',
                    'programa_interno' => true,
                ],

                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'MICRO',
                    'concepto_detalle_id' => '86',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'PEQUEÑA',
                    'concepto_detalle_id' => '87',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'MEDIANA',
                    'concepto_detalle_id' => '88',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'GRANDE',
                    'concepto_detalle_id' => '89',
                    'programa_interno' => true,
                ],
                [
                    'sector' => null,
                    'tipo_tarifa' => null,
                    'concepto_detalle_id' => '90',
                    'programa_interno' => true,
                ],
            ]);
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
