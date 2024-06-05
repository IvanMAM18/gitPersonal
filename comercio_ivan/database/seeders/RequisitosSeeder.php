<?php

namespace Database\Seeders;

use App\Models\Requisito;
use App\Models\RequisitoEntidad;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RequisitosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RequisitoEntidad::query()->truncate();
        Requisito::query()->truncate();

        $requisitos = [];

        if (($open = fopen(resource_path('/data/requisitos_medio_ambiente.csv'), 'r')) !== false) {

            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $requisitos[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($requisitos); $i++) {
            //id: 3,
            // nombre: "Ecologia",
            $r = Requisito::create([
                'nombre' => Str::slug($requisitos[$i][0], '-'),
                'descripcion' => $requisitos[$i][0],
            ]);
            RequisitoEntidad::create([
                'entidad_revisora_id' => 3,
                'catalogo_requisito_id' => $r->id,
            ]);
        }

        $requisitos = [];

        if (($open = fopen(resource_path('/data/requisitos_proteccion_civil.csv'), 'r')) !== false) {

            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $requisitos[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($requisitos); $i++) {
            // id: 2,
            // nombre: "Protección civil",
            $r = Requisito::create([
                'nombre' => Str::slug($requisitos[$i][0], '-'),
                'descripcion' => $requisitos[$i][0],
            ]);
            RequisitoEntidad::create([
                'entidad_revisora_id' => 2,
                'catalogo_requisito_id' => $r->id,
            ]);
        }
        $requisitos = [];

        if (($open = fopen(resource_path('/data/requisitos_uso_suelo.csv'), 'r')) !== false) {

            while (($data = fgetcsv($open, 1000, ',')) !== false) {
                $requisitos[] = $data;
            }

            fclose($open);
        }
        for ($i = 1; $i < count($requisitos); $i++) {
            // id: 1,
            // nombre: "Uso de suelo",
            $r = Requisito::create([
                'nombre' => Str::slug($requisitos[$i][0], '-'),
                'descripcion' => $requisitos[$i][0],
            ]);
            RequisitoEntidad::create([
                'entidad_revisora_id' => 1,
                'catalogo_requisito_id' => $r->id,
            ]);
        }
        // fijos
        Requisito::create([
            'nombre' => 'identificacion-frontal',
            'codigo' => 'identificacion-frontal',
            'descripcion' => 'Identificacion oficial (frontal)',
        ]);
        Requisito::create([
            'nombre' => 'identificacion-trasera',
            'codigo' => 'identificacion-trasera',
            'descripcion' => 'Identificacion oficial (trasera)',
        ]);
        Requisito::create([
            'nombre' => 'comprobante-de-domicilio',
            'codigo' => 'comprobante-de-domicilio',
            'descripcion' => 'Comprobante de domicilio',
        ]);
        Requisito::create([
            'nombre' => 'constancia-de-situacion-fiscal',
            'codigo' => 'constancia-de-situacion-fiscal',
            'descripcion' => 'Constancia de situación fiscal',
        ]);
        Requisito::create([
            'nombre' => 'pasaporte',
            'codigo' => 'pasaporte',
            'descripcion' => 'Pasaporte',
        ]);

    }
}
