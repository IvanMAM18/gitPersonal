<?php

namespace Database\Seeders\Archive;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CondicionantesEntidadesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['1', '1']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['1', '2']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['1', '4']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['2', '1']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['2', '1']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['2', '3']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['3', '1']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['3', '2']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['3', '3']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['3', '4']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['4', '1']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['4', '2']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['4', '3']);
        DB::insert('INSERT INTO condicionante_entidad (entidad_revisora_id, condicionante_id)
        VALUES (?, ?)', ['4', '4']);

    }
}
