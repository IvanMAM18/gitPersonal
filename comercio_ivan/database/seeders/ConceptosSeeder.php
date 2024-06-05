<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $usoDeSueloId = 1;
        $proteccionCivilId = 2;
        $ecologiaId = 3;
        $serviciosPublicosId = 4;

        // PROTECCION CIVIL
        DB::table('conceptos')->insert([
            'id' => 1,
            'entidad_revisora_id' => $proteccionCivilId,
            'nombre' => 'CERTIFICACIÓN DE MEDIDAS DE SEGURIDAD A GIROS COMERCIALES',
            'catalogo_tramites_id' => null,
        ]);

        // ECOLOGIA
        DB::table('conceptos')->insert([
            'id' => 2,
            'entidad_revisora_id' => $ecologiaId,
            'nombre' => 'DICTAMEN TÉCNICO DE ECOLOGÍA',
            'catalogo_tramites_id' => null,
        ]);

        DB::table('conceptos')->insert([
            'id' => 3,
            'entidad_revisora_id' => $ecologiaId,
            'nombre' => 'AUTORIZACIÓN DE DERRIBO DE ÁRBOL',
            'catalogo_tramites_id' => null,
        ]);

        DB::table('conceptos')->insert([
            'id' => 4,
            'entidad_revisora_id' => $ecologiaId,
            'nombre' => 'RESOLUCIÓN DE DICTAMEN TÉCNICO DE ECOLOGÍA PARA MICROGENERADORES DE
            RESIDUOS PELIGROSOS',
            'catalogo_tramites_id' => null,
        ]);

        DB::table('conceptos')->insert([
            'id' => 5,
            'entidad_revisora_id' => $ecologiaId,
            'nombre' => 'REPORTES TÉCNICO AMBIENTALES',
            'catalogo_tramites_id' => null,
        ]);

        DB::table('conceptos')->insert([
            'id' => 6,
            'entidad_revisora_id' => $ecologiaId,
            'nombre' => 'AUTORIZACIÓN DE SONIDO EN GIROS COMERCIALES, EN LOS HORARIOS Y CON EL
            VOLUMEN QUE DETERMINE LA AUTORIDAD MUNICIPAL',
            'catalogo_tramites_id' => null,
        ]);

        // USO DE SUELO
        DB::table('conceptos')->insert([
            'id' => 7,
            'entidad_revisora_id' => $usoDeSueloId,
            'nombre' => 'AUTORIZACIÓN DE USO DEL SUELO COMERCIAL EN LA ZONA CENTRO',
            'catalogo_tramites_id' => null,
        ]);

        DB::table('conceptos')->insert([
            'id' => 8,
            'entidad_revisora_id' => $usoDeSueloId,
            'nombre' => 'AUTORIZACIÓN DE USO DEL SUELO COMERCIAL EN LAS PRINCIPALES AVENIDAS',
            'catalogo_tramites_id' => null,
        ]);

        DB::table('conceptos')->insert([
            'id' => 9,
            'entidad_revisora_id' => $usoDeSueloId,
            'nombre' => 'AUTORIZACIÓN DEL USO DEL SUELO COMERCIAL EN FRACCIONAMIENTO Y CONJUNTOS
            HABITACIONALES',
            'catalogo_tramites_id' => null,
        ]);

        // SERVICIOS PUBLICOS
        DB::table('conceptos')->insert([
            'id' => 10,
            'entidad_revisora_id' => $serviciosPublicosId,
            'nombre' => 'RECOLECCIÓN DE BASURA',
            'catalogo_tramites_id' => null,
        ]);
    }
}
