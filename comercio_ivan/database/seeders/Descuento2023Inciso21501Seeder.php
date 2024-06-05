<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Descuento2023Inciso21501Seeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('descuentos')->insert([
            'descripcion' => 'DESCUENTO 2023 DEL 40% SIN ADEUDO Y 30% CON ADEUDO',
            'inciso_id' => '126',
            'created_at' => \Carbon\Carbon::now(),
            'updated_at' => \Carbon\Carbon::now(),
        ]);
        DB::update('update conceptos_detalles_incisos set formula = ? where id = 83', ['ACCUM * 0.3']);
    }
}
