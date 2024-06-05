<?php

use Illuminate\Database\Migrations\Migration;

class FillTarifaProteccionCivil20242 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $now = now();

        DB::table('conceptos_detalles')->
            insert([
                [
                    'id' => 91,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector Comercial, Tarifa Grande',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 92,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector Servicios, Tarifa Grande',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 93,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector Industria, Tarifa Autoempleo',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],

                // PROGRAMA INTERNO
                [
                    'id' => 94,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector Comercial, Tarifa Grande',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 95,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector Servicios, Tarifa Grande',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 96,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector Industria, Tarifa Autoempleo',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ]);

        $conceptosDetalles = collect([
            91, 92, 93,
        ]);
        $conceptosDetallesProgramaInterno = collect([
            94, 95, 96,
        ]);

        $conceptosDetalles->each(function ($conceptoDetalleId) use ($now) {
            DB::table('conceptos_detalles_incisos')->
                insert([
                    [
                        'concepto_detalle_id' => $conceptoDetalleId,
                        'inciso' => 21705,
                        'formula' => 'UMA * VALOR',
                        'created_at' => $now,
                        'updated_at' => $now,
                        'opciones' => null,
                        'orden' => 1,
                    ],
                    [
                        'concepto_detalle_id' => $conceptoDetalleId,
                        'inciso' => 10809,
                        'formula' => 'ACCUM * 0.3',
                        'created_at' => $now,
                        'updated_at' => $now,
                        'opciones' => null,
                        'orden' => 3,
                    ],
                    [
                        'concepto_detalle_id' => $conceptoDetalleId,
                        'inciso' => 30501,
                        'formula' => '2',
                        'created_at' => $now,
                        'updated_at' => $now,
                        'opciones' => null,
                        'orden' => 4,
                    ],
                ]);
        });

        $conceptosDetallesProgramaInterno->each(function ($conceptoDetalleId) use ($now) {
            DB::table('conceptos_detalles_incisos')->
                insert([
                    [
                        'concepto_detalle_id' => $conceptoDetalleId,
                        'inciso' => 21705,
                        'formula' => 'UMA * VALOR',
                        'created_at' => $now,
                        'updated_at' => $now,
                        'opciones' => null,
                        'orden' => 1,
                    ],
                    [
                        'concepto_detalle_id' => $conceptoDetalleId,
                        'inciso' => 21902,
                        'formula' => 'UMA * TARIFA_PROGRAMA_INTERNO',
                        'created_at' => $now,
                        'updated_at' => $now,
                        'opciones' => null,
                        'orden' => 2,
                    ],
                    [
                        'concepto_detalle_id' => $conceptoDetalleId,
                        'inciso' => 10809,
                        'formula' => 'ACCUM * 0.3',
                        'created_at' => $now,
                        'updated_at' => $now,
                        'opciones' => null,
                        'orden' => 3,
                    ],
                    [
                        'concepto_detalle_id' => $conceptoDetalleId,
                        'inciso' => 30501,
                        'formula' => '2',
                        'created_at' => $now,
                        'updated_at' => $now,
                        'opciones' => null,
                        'orden' => 4,
                    ],
                ]);
        });

        DB::table('tarifa_proteccion_civil2024')->
            insert([
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'GRANDE',
                    'concepto_detalle_id' => '91',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'GRANDE',
                    'concepto_detalle_id' => '92',
                    'programa_interno' => false,
                ],
                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'AUTOEMPLEO',
                    'concepto_detalle_id' => '93',
                    'programa_interno' => false,
                ],

                // Programa interno
                [
                    'sector' => 'COMERCIO',
                    'tipo_tarifa' => 'GRANDE',
                    'concepto_detalle_id' => '94',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'SERVICIOS',
                    'tipo_tarifa' => 'GRANDE',
                    'concepto_detalle_id' => '95',
                    'programa_interno' => true,
                ],
                [
                    'sector' => 'INDUSTRIA',
                    'tipo_tarifa' => 'AUTOEMPLEO',
                    'concepto_detalle_id' => '96',
                    'programa_interno' => false,
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
