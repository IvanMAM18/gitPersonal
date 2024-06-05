<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptosDetallesIncisosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i <= 19; $i++) {
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 21705,
                'formula' => '(UMA * VALOR)',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 10809,
                'formula' => '(UMA * VALOR) * 0.3',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 30501,
                'formula' => '2',
            ]);
        }

        for ($i = 20; $i <= 24; $i++) {
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 22501,
                'formula' => '(UMA * VALOR)',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 10829,
                'formula' => '(UMA * VALOR) * 0.3',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 30501,
                'formula' => '2',
            ]);
        }

        for ($i = 25; $i <= 27; $i++) {
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 20508,
                'formula' => '(UMA * VALOR)',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 10831,
                'formula' => '(UMA * VALOR) * 0.3',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 30501,
                'formula' => '2',
            ]);
        }

        for ($i = 28; $i <= 28; $i++) {
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 21501,
                'formula' => '(UMA * VALOR)',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 10801,
                'formula' => '(UMA * VALOR) * 0.3',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 30501,
                'formula' => '2',
            ]);
        }
    }
}
