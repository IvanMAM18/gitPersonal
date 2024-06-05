<?php

namespace Database\Seeders\Archive;

use App\Models\CatalogoTramite;
use Illuminate\Database\Seeder;

class TramiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CatalogoTramite::create([
            'nombre' => 'Licencia de funcionamiento (SARE)',
            'link' => '/app/registrar-negocio',
            'descripcion' => 'Obten tu Licencia de funcionamiento en linea',
            'departamento_id' => 1,
        ]);
    }
}
