<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComercioDirectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::insert('INSERT INTO roles (nombre, descripcion) VALUES (?, ?)', ['ComercioDirector', 'Director de entidad Comercio dedicada a generar resolutivos']);
    }
}
