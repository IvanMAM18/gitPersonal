<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class FillConceptosDetallesIncisosProt2024 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $now = now();
        $conceptosDetalles = collect([
            65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
        ]);
        $conceptosDetallesProgramaInterno = collect([
            78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
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
                        'inciso' => 21915,
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
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $conceptosDetalles = collect([
            65, 66, 67, 68, 69, 70, 71, 72, 73,
            74, 75, 76, 77, 78, 79, 80, 81, 82,
            83, 84, 85, 86, 87, 88, 89, 90,
        ]);

        DB::table('conceptos_detalles_incisos')->
            whereIn('concepto_detalle_id', $conceptosDetalles)->
            delete();
    }
}
