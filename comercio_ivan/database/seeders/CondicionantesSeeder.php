<?php

namespace Database\Seeders;

use App\Models\CondicionanteEntidad;
use App\Models\Condicionantes;
use Illuminate\Database\Seeder;

class CondicionantesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CondicionanteEntidad::query()->truncate();
        Condicionantes::query()->truncate();

        $condicionantes = [];

        if (($open = fopen(resource_path('/data/condicionantes_medio_ambiente.csv'), 'r')) !== false) {

            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $condicionantes[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($condicionantes); $i++) {
            //id: 3,
            // nombre: "Ecologia",
            $c = Condicionantes::create([
                'nombre' => $condicionantes[$i][0],
                'descripcion' => $condicionantes[$i][0],
            ]);
            CondicionanteEntidad::create([
                'entidad_revisora_id' => 3,
                'condicionante_id' => $c->id,
            ]);
        }

        $condicionantes = [];

        if (($open = fopen(resource_path('/data/condicionantes_proteccion_civil.csv'), 'r')) !== false) {

            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $condicionantes[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($condicionantes); $i++) {
            // id: 2,
            // nombre: "Protección civil",
            $c = Condicionantes::create([
                'nombre' => $condicionantes[$i][0],
                'descripcion' => $condicionantes[$i][0],
            ]);
            CondicionanteEntidad::create([
                'entidad_revisora_id' => 2,
                'condicionante_id' => $c->id,
            ]);
        }
        $condicionantes = [];

        if (($open = fopen(resource_path('/data/condicionantes_uso_suelo.csv'), 'r')) !== false) {

            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $condicionantes[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($condicionantes); $i++) {
            // id: 2,
            // nombre: "Protección civil",
            $c = Condicionantes::create([
                'nombre' => $condicionantes[$i][0],
                'descripcion' => $condicionantes[$i][0],
            ]);
            CondicionanteEntidad::create([
                'entidad_revisora_id' => 1,
                'condicionante_id' => $c->id,
            ]);
        }
    }
}
