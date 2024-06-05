<?php

namespace Database\Seeders\Archive;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CondicionantesSeeder_backup extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::insert('INSERT INTO condicionantes (nombre, descripcion)
        VALUES (?, ?)', ['cajon-estacionamiento', 'Contar con un mínimo de 5 cajones de estacionamiento.']);
        DB::insert('INSERT INTO condicionantes (nombre, descripcion)
        VALUES (?, ?)', ['senales-de-evacuacion', 'Contar con las señales respectivas de evacuación.']);
        DB::insert('INSERT INTO condicionantes (nombre, descripcion)
        VALUES (?, ?)', ['extintores', 'Contar con un mínimo de 2 extintores.']);
        DB::insert('INSERT INTO condicionantes (nombre, descripcion)
        VALUES (?, ?)', ['botes-de-basura', 'Contar con un mínimo de 2 botes de basura.']);
        DB::insert('INSERT INTO condicionantes (nombre, descripcion)
        VALUES (?, ?)', ['zona-de-sismo', 'Contar con un área libre para sismos.']);
    }
}
