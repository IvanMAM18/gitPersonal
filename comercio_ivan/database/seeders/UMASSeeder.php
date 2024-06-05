<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UMASSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('umas')->truncate();
        DB::table('umas')->insert([
            'año' => '2020',
            'diario' => 86.88,
            'mensual' => 2641.15,
            'anual' => 31693.80,
        ]);
        DB::table('umas')->insert([
            'año' => '2021',
            'diario' => 89.62,
            'mensual' => 2724.45,
            'anual' => 32693.40,
        ]);
        DB::table('umas')->insert([
            'año' => '2022',
            'diario' => 96.22,
            'mensual' => 2925.09,
            'anual' => 35101.08,
        ]);
    }
}
