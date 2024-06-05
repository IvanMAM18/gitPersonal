<?php

namespace Database\Seeders;

use App\Models\Camara;
use Illuminate\Database\Seeder;

class CamaraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Camara::create([
            'titular' => 'Ing. Rodolfo Martínez Parra',
            'nombre' => 'CMIC Cámara Mexicana de la Industria de la Construción',
        ]);
        Camara::create([
            'titular' => 'Lic. Carlos Fco. Estrada Talamantes',
            'nombre' => 'CANADEVI Cámara Cámara Nacional de la Industria de Desarrollo y Promoción de Vivienda',
        ]);
        Camara::create([
            'titular' => 'Ing. José Gustavo Díaz Tronco',
            'nombre' => 'COPARMEX Confederación Patronal de la República Mexicana en B.C.S.',
        ]);
        Camara::create([
            'titular' => 'Lic. David Alejandro Gracia Hinojosa',
            'nombre' => 'CANIRAC  Cámara de la Industria Restaurantera',
        ]);
        Camara::create([
            'titular' => 'C.P. Juan Carlos Esqueda Hampl',
            'nombre' => 'CANACO Cámara de Comercio, Servicios y Turismo de La Paz',
        ]);
        Camara::create([
            'titular' => 'Lic. Omar Salvador Gutiérrez Trujillo',
            'nombre' => 'CCE Consejo Coordinador Empresarial La Paz',
        ]);
        Camara::create([
            'titular' => 'Lic. Sara Barocio',
            'nombre' => 'CANACOPE Cámara Nacional del Comercio en Pequeño en La Paz',
        ]);
    }
}
