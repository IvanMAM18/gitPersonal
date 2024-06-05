<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptosDetallesIncisosSeeder2 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // ALCOHOLES - INCISOS - AGREGAR INCISO PARA ADEUDO Y RECARGO

        DB::table('conceptos_detalles_incisos')->whereIn(
            'id',
            [161, 164, 167, 170, 173, 176, 179, 182, 185, 188, 191, 194, 197, 200, 203]
        )->update([
            'opciones' => null,
        ]);

        DB::table('conceptos_detalles_incisos')->whereIn(
            'id',
            [162, 165, 168, 171, 174, 177, 180, 183, 186, 189, 192, 195, 198, 201, 204]
        )->update([
            'orden' => 3,
            'formula' => 'ACCUM * 0.3',
        ]);

        DB::table('conceptos_detalles_incisos')->whereIn(
            'id',
            [163, 166, 169, 172, 175, 178, 181, 184, 187, 190, 193, 196, 199, 202, 205]
        )->update([
            'orden' => 5,
        ]);

        for ($i = 48; $i <= 60; $i++) {
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 22607,
                'formula' => 'VALOR_MANUAL_22607',
                'opciones' => '["VALOR_MANUAL"]',
                'orden' => '2',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 40115,
                'formula' => 'VALOR_MANUAL_40115',
                'opciones' => '["VALOR_MANUAL"]',
                'orden' => '4',
            ]);
        }
    }
}
