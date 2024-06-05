<?php

namespace Database\Seeders;

use App\Models\CodigoPostal;
use Illuminate\Database\Seeder;

class CodigosPostalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CodigoPostal::query()->truncate();
        $codigos_postales = [];

        if (($open = fopen(resource_path('/data/codigos_postales.csv'), 'r')) !== false) {

            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $codigos_postales[] = $data;
            }

            fclose($open);
        }

        for ($i = 1; $i < count($codigos_postales); $i++) {

            CodigoPostal::create([
                'codigo_postal' => $codigos_postales[$i][1],
                'clave_colonia' => $codigos_postales[$i][2],
                'nombre_localidad' => $codigos_postales[$i][3],
                'clave_estado' => $codigos_postales[$i][4],
                'clave_estado_inegi' => $codigos_postales[$i][5],
                'clave_municipio' => $codigos_postales[$i][6],
                'tipo' => $codigos_postales[$i][7],
            ]);
        }
    }
}
