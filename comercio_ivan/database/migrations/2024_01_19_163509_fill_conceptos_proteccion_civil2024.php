<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class FillConceptosProteccionCivil2024 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $now = now();
        DB::table('conceptos')->
            insert([
                [
                    'id' => 16,
                    'entidad_revisora_id' => 2,
                    'nombre' => 'CERTIFICACIÓN DE MEDIDAS DE SEGURIDAD',
                    'catalogo_tramites_id' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'opciones' => null,
                    'anualidad' => 2024,
                ], [
                    'id' => 17,
                    'entidad_revisora_id' => 2,
                    'nombre' => 'CERTIFICACIÓN DE MEDIDAS DE SEGURIDAD',
                    'catalogo_tramites_id' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'opciones' => json_encode(['PROGRAMA_INTERNO']),
                    'anualidad' => 2024,
                ],
            ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('conceptos')->
            whereIn('id', [16, 17])->
            delete();
    }
}
