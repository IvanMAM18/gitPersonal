<?php

namespace Database\Seeders;

use App\Models\GiroComercial;
use Illuminate\Database\Seeder;

class AddColumnsGirosComercialesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
//        GiroComercial::query()->truncate();

        $giros = [];

        if (($open = fopen(resource_path('/data/giros.csv'), 'r')) !== false) {

            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $giros[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($giros); $i++) {

            GiroComercial::updateOrCreate([
                'clave_scian' => $giros[$i][0],
            ],[
                'cobro_programa_interno' => filter_var($giros[$i][6], FILTER_VALIDATE_BOOLEAN),
                'certificado_medio_ambiente' => filter_var($giros[$i][7], FILTER_VALIDATE_BOOLEAN),
                'licencia_alcohol' => filter_var($giros[$i][8], FILTER_VALIDATE_BOOLEAN),
            ]);
        }

//        return GiroComercial::all();
    }
}

