<?php

namespace Database\Seeders;

use App\Models\EntidadRevision;
use App\Models\Estado;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EntidadRevisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('entidad_revision')->truncate();
        DB::table('estados')->truncate();

        EntidadRevision::create(['id' => 1, 'nombre' => 'Uso de suelo', 'departamento_id' => 1]);
        EntidadRevision::create(['id' => 2, 'nombre' => 'Protección civil', 'departamento_id' => 2]);
        EntidadRevision::create(['id' => 3, 'nombre' => 'Ecologia', 'departamento_id' => 3]);
        EntidadRevision::create(['id' => 4, 'nombre' => 'Servicios Publicos', 'departamento_id' => 4]);
        EntidadRevision::create(['id' => 5, 'nombre' => 'Comercio', 'departamento_id' => 5]);
        EntidadRevision::create(['id' => 6, 'nombre' => 'Alcoholes', 'departamento_id' => 6]);
        EntidadRevision::create(['id' => 7, 'nombre' => '', 'departamento_id' => 7]);

        Estado::create(['id' => 1, 'enviado' => 1, 'aprobado' => 0, 'rechazado' => 0, 'revision' => 0]);
        Estado::create(['id' => 2, 'enviado' => 0, 'aprobado' => 1, 'rechazado' => 0, 'revision' => 0]);
        Estado::create(['id' => 3, 'enviado' => 0, 'aprobado' => 0, 'rechazado' => 1, 'revision' => 0]);
        Estado::create(['id' => 4, 'enviado' => 0, 'aprobado' => 0, 'rechazado' => 0, 'revision' => 1]);
    }
}
