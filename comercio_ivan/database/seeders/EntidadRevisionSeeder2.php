<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EntidadRevisionSeeder2 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::insert('INSERT INTO entidad_revision (nombre, departamento_id) VALUES (?, ?)', ['Contraloria', 7]);

        DB::insert('INSERT INTO users (nombre, apellido_pat, apellido_mot, role_id, entidad_revision_id, email, password, email_verified_at ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', ['Contraloria', '', '', 2, 7, 'contraloria@gmail.com', Hash::make('123'), \Carbon\Carbon::now()]);
    }
}
