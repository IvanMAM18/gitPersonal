<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalogoTramitesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // CATALOGO TRAMITES PARA REFRENDO DE LICENCIA DE ALCOHOLES

        DB::table('catalogo_tramites')->insert([
            'id' => 15,
            'nombre' => 'Refrendo de Licencia de Alcoholes',
            'descripcion' => 'Refrendo de Licencia de Alcoholes',
            'link' => '/app/iniciar-tramite/refrendo-de-licencia-de-alcoholes',
            'departamento_id' => -1,
            'pago' => false,
            'resolutivo' => false,
            'en_linea' => true,
            'tipo' => 'publico',
            'entidad_revisora_id' => null,
            'tipo_tramite' => 'PERSONA',
        ]);

        DB::table('catalogo_tramites')->insert([
            'id' => 16,
            'nombre' => 'Refrendo de Licencia de Alcoholes',
            'descripcion' => 'Refrendo de Licencia de Alcoholes',
            'link' => '/',
            'departamento_id' => 6,
            'pago' => true,
            'resolutivo' => false,
            'en_linea' => false,
            'tipo' => 'interno',
            'entidad_revisora_id' => 6,
            'tipo_tramite' => 'PERSONA',
        ]);

        // SUBTRAMITES

        DB::table('subtramites')->insert([
            'id' => 19,
            'catalogo_tramite_padre_id' => 15,
            'catalogo_tramite_hijo_id' => 16,
            'orden' => 1,
        ]);

        // REQUISITOS

        DB::table('requisitos')->insert([
            'id' => 54,
            'nombre' => 'Número de Licencia de Alcohol',
            'descripcion' => 'Número de Licencia de Alcohol',
            'codigo' => 'numero-de-licencia-de-alcohol',
            'expediente' => false,
            'expediente_requerido' => false,
            'tipo' => 'TEXTO',
        ]);

        DB::table('requisitos')->insert([
            'id' => 55,
            'nombre' => 'Nombre de Operador de Licencia de Alcohol',
            'descripcion' => 'Nombre de Operador de Licencia de Alcohol',
            'codigo' => 'nombre-operador-licencia-de-alcohol',
            'expediente' => false,
            'expediente_requerido' => false,
            'tipo' => 'TEXTO',
        ]);

        DB::table('requisitos')->insert([
            'id' => 56,
            'nombre' => 'Dirección de Operador de Licencia de Alcohol',
            'descripcion' => 'Dirección de Operador de Licencia de Alcohol',
            'codigo' => 'direccion-operador-licencia-de-alcohol',
            'expediente' => false,
            'expediente_requerido' => false,
            'tipo' => 'TEXTO',
        ]);

        // CATALOGO TRAMITES REQUISITOS

        DB::table('catalogo_tramites_requisitos')->insert([
            'catalogo_tramites_id' => 16,
            'requisito_id' => 54,
        ]);

        DB::table('catalogo_tramites_requisitos')->insert([
            'catalogo_tramites_id' => 16,
            'requisito_id' => 55,
        ]);

        DB::table('catalogo_tramites_requisitos')->insert([
            'catalogo_tramites_id' => 16,
            'requisito_id' => 56,
        ]);

        // CONCEPTOS

        DB::table('conceptos')->where([
            'entidad_revisora_id' => 6,
        ])->update([
            'catalogo_tramites_id' => null,
        ]);

        // CONCEPTOS DETALLES INCISOS

        DB::table('conceptos_detalles_incisos')->whereIn(
            'id',
            [161, 164, 167, 170, 173, 176, 179, 182, 185, 188, 191, 194, 197, 200, 203]
        )->update([
            'opciones' => '["MOSTRAR_ADEUDO"]',
        ]);
    }
}
