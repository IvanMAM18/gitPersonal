<?php

namespace Database\Seeders;

use App\Models\CatalogoServicioPrivadoRecoleccionBasura;
use Illuminate\Database\Seeder;

class CatalogoServicioPrivadoRecoleccionBasuraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 240,
            'nombre' => 'Recolectora ambiental y servicios integrales',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 760,
            'nombre' => 'Ecología y movimiento',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 292,
            'nombre' => 'Servicios Ecológicos Californias',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 4362,
            'nombre' => 'Servicios Blanco (SARRS)',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 272,
            'nombre' => 'ECOERIBE',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 266,
            'nombre' => 'King Kong',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 9899,
            'nombre' => 'ECO TRASH SERVICIOS',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 11597,
            'nombre' => 'SERVICIO DE RECOLECCIÓN DE BASURA CARBALLO',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 9317,
            'nombre' => 'ANTONIO ESPINOZA CAMACHO',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 9993,
            'nombre' => 'VANILU',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 12702,
            'nombre' => 'SERVICIOS MEMIN',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'tramite_id' => 14923,
            'nombre' => 'RECOLECTO',
        ]);
        CatalogoServicioPrivadoRecoleccionBasura::create([
            'nombre' => 'Contrato con Plaza comercial (La plaza paga la recolección)',
        ]);

    }
}
