<?php

namespace Database\Seeders\Archive;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComercioAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::insert('INSERT INTO roles (nombre, descripcion) VALUES (?, ?)', ['comercio_admin', 'Admin de Resoluciones']);
    }
}
