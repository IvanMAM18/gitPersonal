<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptosDetallesIncisosSeeder3 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // ALCOHOLES - INCISOS - AGREGAR INCISO PARA ADEUDO Y RECARGO
        DB::table('conceptos_detalles_incisos')->where('formula', '(UMA * VALOR * MESES)')->update([
            'formula' => 'UMA * VALOR * MESES',
        ]);

        DB::table('conceptos_detalles_incisos')->where('formula', '(UMA * 0.05 * M2)')->update([
            'formula' => 'UMA * 0.05 * M2',
        ]);

        DB::table('conceptos_detalles_incisos')->where('formula', '(UMA * VALOR)')->update([
            'formula' => 'UMA * VALOR',
        ]);
    }
}
