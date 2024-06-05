<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalogoTramitesSeeder2 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $contraloriaId = 7;

        // CATALOGO TRAMITES PARA REFRENDO DE Constancia de no inhabilitación administrativa

        DB::table('catalogo_tramites')->insert([
            'id' => 17,
            'nombre' => 'Constancia de no inhabilitación administrativa',
            'descripcion' => 'Constancia de no inhabilitación administrativa',
            'link' => '/',
            'departamento_id' => -1,
            'pago' => false,
            'resolutivo' => true,
            'en_linea' => true,
            'tipo' => 'publico',
            'entidad_revisora_id' => null,
            'tipo_tramite' => 'PERSONA',
        ]);

        DB::table('catalogo_tramites')->insert([
            'id' => 18,
            'nombre' => 'Constancia de no inhabilitación administrativa',
            'descripcion' => 'Constancia de no inhabilitación administrativa',
            'link' => '/',
            'departamento_id' => 7,
            'pago' => true,
            'resolutivo' => false,
            'en_linea' => false,
            'tipo' => 'interno',
            'entidad_revisora_id' => 7,
            'tipo_tramite' => 'PERSONA',
        ]);

        // SUBTRAMITES

        DB::table('subtramites')->insert([
            'id' => 20,
            'catalogo_tramite_padre_id' => 17,
            'catalogo_tramite_hijo_id' => 18,
            'orden' => 1,
        ]);

        // CONCEPTOS

        DB::table('conceptos')->insert([
            'id' => 14,
            'entidad_revisora_id' => $contraloriaId,
            'nombre' => 'EXPEDICIÓN DE CONSTANCIAS',
            'catalogo_tramites_id' => 18,
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 63,
            'concepto_id' => 14,
            'descripcion' => 'EXPEDICIÓN DE CONSTANCIAS',
            'valor' => 1,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles_incisos')->insert([
            'concepto_detalle_id' => 63,
            'inciso' => 20836,
            'formula' => 'UMA * VALOR',
            'orden' => 1,
        ]);

        DB::table('conceptos_detalles_incisos')->insert([
            'concepto_detalle_id' => 63,
            'inciso' => 10817,
            'formula' => '(UMA * VALOR) * 0.3',
            'orden' => 2,
        ]);

        DB::table('conceptos_detalles_incisos')->insert([
            'concepto_detalle_id' => 63,
            'inciso' => 30501,
            'formula' => '2',
            'orden' => 3,
        ]);

        // CATALOGO TRAMITES PARA REFRENDO DE Constancia de no sujeción a procedimiento administrativo

        DB::table('catalogo_tramites')->insert([
            'id' => 19,
            'nombre' => 'Constancia de no sujeción a procedimiento administrativo',
            'descripcion' => 'Constancia de no sujeción a procedimiento administrativo',
            'link' => '/',
            'departamento_id' => -1,
            'pago' => false,
            'resolutivo' => true,
            'en_linea' => true,
            'tipo' => 'publico',
            'entidad_revisora_id' => null,
            'tipo_tramite' => 'PERSONA',
        ]);

        DB::table('catalogo_tramites')->insert([
            'id' => 20,
            'nombre' => 'Constancia de no sujeción a procedimiento administrativo',
            'descripcion' => 'Constancia de no sujeción a procedimiento administrativo',
            'link' => '/',
            'departamento_id' => 7,
            'pago' => true,
            'resolutivo' => false,
            'en_linea' => false,
            'tipo' => 'interno',
            'entidad_revisora_id' => 7,
            'tipo_tramite' => 'PERSONA',
        ]);

        // SUBTRAMITES

        DB::table('subtramites')->insert([
            'id' => 21,
            'catalogo_tramite_padre_id' => 19,
            'catalogo_tramite_hijo_id' => 20,
            'orden' => 1,
        ]);

        // CONCEPTOS

        DB::table('conceptos')->insert([
            'id' => 15,
            'entidad_revisora_id' => $contraloriaId,
            'nombre' => 'EXPEDICIÓN DE CONSTANCIAS',
            'catalogo_tramites_id' => 20,
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 64,
            'concepto_id' => 15,
            'descripcion' => 'EXPEDICIÓN DE CONSTANCIAS',
            'valor' => 1,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles_incisos')->insert([
            'concepto_detalle_id' => 64,
            'inciso' => 20836,
            'formula' => 'UMA * VALOR',
            'orden' => 1,
        ]);

        DB::table('conceptos_detalles_incisos')->insert([
            'concepto_detalle_id' => 64,
            'inciso' => 10817,
            'formula' => '(UMA * VALOR) * 0.3',
            'orden' => 2,
        ]);

        DB::table('conceptos_detalles_incisos')->insert([
            'concepto_detalle_id' => 64,
            'inciso' => 30501,
            'formula' => '2',
            'orden' => 3,
        ]);
    }
}
