<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptosSeeder3 extends Seeder
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
        $comercioId = 5;
        $alcoholesId = 6;

        // ALCOHOLES
        DB::table('conceptos')->insert([
            'id' => 12,
            'entidad_revisora_id' => $alcoholesId,
            'nombre' => 'REVALIDACIÓN ANUAL',
            'catalogo_tramites_id' => 13,
        ]);

        DB::table('conceptos')->insert([
            'id' => 13,
            'entidad_revisora_id' => $alcoholesId,
            'nombre' => 'CAMBIO DE ACTIVIDAD, NOMBRE, GIRO O RAZÓN SOCIAL',
            'catalogo_tramites_id' => 13,
        ]);

        // ALCOHOLES - DETALLES
        DB::table('conceptos_detalles')->insert([
            'id' => 48,
            'concepto_id' => 12,
            'descripcion' => 'A).- DISTRIBUIDORES',
            'valor' => 6095,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 49,
            'concepto_id' => 12,
            'descripcion' => 'B).- CENTRO NOCTURNOS / ZONA TURÍSTICA',
            'valor' => 2700,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 50,
            'concepto_id' => 12,
            'descripcion' => 'B).- CENTRO NOCTURNOS / FUERA DE LA ZONA TURÍSTICA',
            'valor' => 2000,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 51,
            'concepto_id' => 12,
            'descripcion' => 'B).- CENTRO NOCTURNOS / CONTROLADO POR SECTOR SALUD',
            'valor' => 4750,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 52,
            'concepto_id' => 12,
            'descripcion' => 'C).- CANTINAS, BARES, CERVECERÍA, CAFÉ, PEÑAS CULTURALES / ZONA TURÍSTICA',
            'valor' => 1500,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 53,
            'concepto_id' => 12,
            'descripcion' => 'C).- CANTINAS, BARES, CERVECERÍA, CAFÉ, PEÑAS CULTURALES / FUERA DE LA ZONA TURÍSTICA',
            'valor' => 1000,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 54,
            'concepto_id' => 12,
            'descripcion' => 'D).- TIENDAS DEPARTAMENTALES',
            'valor' => 3000,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 55,
            'concepto_id' => 12,
            'descripcion' => 'E).- LICORERÍAS, DEPóSITOS, TIENDAS DE ALIMENTOS, ABARROTES, MISCELÁNEAS, MINISUPER',
            'valor' => 1050,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 56,
            'concepto_id' => 12,
            'descripcion' => 'F).- RESTAURANT BAR, HOTELES, MOTELES / ZONA TURÍSTICA',
            'valor' => 1500,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 57,
            'concepto_id' => 12,
            'descripcion' => 'F).- RESTAURANT BAR, HOTELES, MOTELES / FUERA DE LA ZONA TURÍSTICA',
            'valor' => 1200,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 58,
            'concepto_id' => 12,
            'descripcion' => 'G).- RESTAURANTES CON VENTA DE CERVEZA / ZONA TURÍSTICA',
            'valor' => 750,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 59,
            'concepto_id' => 12,
            'descripcion' => 'G).- RESTAURANTES CON VENTA DE CERVEZA / FUERA DE LA ZONA TURÍSTICA',
            'valor' => 500,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 60,
            'concepto_id' => 12,
            'descripcion' => 'H).- CENTROS RECREATIVOS, CLUBES, ASOCIACIONES CIVILES',
            'valor' => 150,
            'formula' => '(UMA * VALOR) * 0.05',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 61,
            'concepto_id' => 13,
            'descripcion' => 'A).- DISTRIBUIDORES',
            'valor' => 6095,
            'formula' => '(UMA * VALOR) * 0.1',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 62,
            'concepto_id' => 13,
            'descripcion' => 'B).- CENTRO NOCTURNOS',
            'valor' => 2700,
            'formula' => '(UMA * VALOR) * 0.1',
        ]);

        // ALCOHOLES - INCISOS
        for ($i = 48; $i <= 60; $i++) {
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 22402,
                'formula' => '(UMA * VALOR) * 0.05',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 10824,
                'formula' => '((UMA * VALOR) * 0.05) * 0.3',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 30501,
                'formula' => '2',
            ]);
        }

        for ($i = 61; $i <= 62; $i++) {
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 22404,
                'formula' => '(UMA * VALOR) * 0.1',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 10824,
                'formula' => '((UMA * VALOR) * 0.1) * 0.3',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 30501,
                'formula' => '2',
            ]);
        }
    }
}
