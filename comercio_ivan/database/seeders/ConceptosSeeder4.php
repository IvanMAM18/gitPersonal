<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptosSeeder4 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('conceptos')->whereIn('id', [1, 11])->update([
            'catalogo_tramites_id' => null,
        ]);
        DB::table('conceptos')->where('id', 10)->update([
            'opciones' => ['REQUIERE_MESES'],
        ]);
        DB::table('conceptos')->where('id', 11)->update([
            'opciones' => ['PROGRAMA_INTERNO'],
        ]);
    }
}
