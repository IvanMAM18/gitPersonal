<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptosSeeder2 extends Seeder
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
            'id' => 11,
            'entidad_revisora_id' => $proteccionCivilId,
            'nombre' => 'CERTIFICACIÓN DE MEDIDAS DE SEGURIDAD A GIROS COMERCIALES',
            'catalogo_tramites_id' => 1,
        ]);

        // PROTECCION CIVIL - DETALLES
        DB::table('conceptos_detalles')->insert([
            'id' => 29,
            'concepto_id' => 11,
            'descripcion' => 'TIENDAS DEPARTAMENTALES, CLUBES DEPORTIVOS, SALA CINEMATOGRÁFICA, TEATROS,
            SALÓN DE RENTA PARA EVENTOS, DESMANTELADORAS.',
            'valor' => 8,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 30,
            'concepto_id' => 11,
            'descripcion' => 'COMERCIO EN PEQUEÑOS Y PUESTOS SEMIFIJOS',
            'valor' => 2,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 31,
            'concepto_id' => 11,
            'descripcion' => 'EDIFICIOS INDUSTRIALES 4.MACRO INDUSTRIA',
            'valor' => 10,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 32,
            'concepto_id' => 11,
            'descripcion' => 'MOTELES DE 11-20 HABITACIONES',
            'valor' => 4,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 33,
            'concepto_id' => 11,
            'descripcion' => 'EDIFICIOS EDUCATIVOS DE 11 AULAS EN ADELANTE',
            'valor' => 5,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 34,
            'concepto_id' => 11,
            'descripcion' => 'MOTELES: 1.- HASTA 10 HABITACIONES',
            'valor' => 3,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 35,
            'concepto_id' => 11,
            'descripcion' => 'BARES, BILLARES, CANTINA, CAFÉ CANTANTE, PEÑAS CULTURALES, RESTAURANTE BAR,
            RESTAURANTE, CLÍNICAS.',
            'valor' => 6,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 36,
            'concepto_id' => 11,
            'descripcion' => 'OTROS GIROS NO ESPECIFICADOS',
            'valor' => 3,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 37,
            'concepto_id' => 11,
            'descripcion' => 'EDIFICIOS EDUCATIVOS: HASTA 10 AULAS',
            'valor' => 3,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 38,
            'concepto_id' => 11,
            'descripcion' => 'DISCOTECAS, CENTRO DE ESPECTÁCULOS, CABARET, CENTROS NOCTURNOS, BODEGA DE
            DISTRIBUCIÓN (EXCEPTO MATERIALES DE ALTO RIESGO), HOSPITAL.',
            'valor' => 6,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 39,
            'concepto_id' => 11,
            'descripcion' => 'HOTELES:1.- HASTA 30 HABITACIONES',
            'valor' => 5,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 40,
            'concepto_id' => 11,
            'descripcion' => 'DISTRIBUIDORAS DE GASES, COMBUSTIBLES Y LUBRICANTES, OXÍGENOS Y ACETILENOS,
            GASOLINERAS Y DEPÓSITOS DE COMBUSTIBLES Y LUBRICANTES, Y DEMÁS DE ALTO RIESGO.',
            'valor' => 15,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 41,
            'concepto_id' => 11,
            'descripcion' => 'HOTELES DE 31 HABITACIONES ADELANTE',
            'valor' => 8,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 42,
            'concepto_id' => 11,
            'descripcion' => 'EDIFICIOS INDUSTRIALES 1.- MICRO INDUSTRIA DE 1-15 EMPLEADOS',
            'valor' => 3,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 43,
            'concepto_id' => 11,
            'descripcion' => 'MOTELES DE 21 HABITACIONES EN ADELANTE',
            'valor' => 5,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 44,
            'concepto_id' => 11,
            'descripcion' => 'DESPACHO DE PROFESIONISTAS Y GIROS DE SERVICIO',
            'valor' => 3,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 45,
            'concepto_id' => 11,
            'descripcion' => 'EDIFICIOS INDUSTRIALES 2. PEQUEÑA INDUSTRIA DE 16-50 EMPLEADOS',
            'valor' => 6,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 46,
            'concepto_id' => 11,
            'descripcion' => 'EDIFICIOS INDUSTRIALES 3. INDUSTRIA MEDIANA DE 51-100 EMPLEADOS',
            'valor' => 8,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 47,
            'concepto_id' => 11,
            'descripcion' => 'LONCHERÍAS, PANADERÍAS, LAVANDERÍAS, FERRETERÍAS, REFACCIONARIA, TIENDAS DE ROPA,
            MISCELÁNEAS, SUPER MERCADOS, TIENDAS DE ALIMENTOS, DEPÓSITOS, LICORERÍAS,
            ULTRAMARINOS, FARMACIAS, PAPELERÍAS, LIBRERÍAS, TEMPLOS RELIGIOSOS, PALAPAS Y
            SALÓN DE FIESTAS INFANTILES.',
            'valor' => 3,
            'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 1.3 + 2',
        ]);

        // PROTECCION CIVIL - INCISOS
        for ($i = 29; $i <= 47; $i++) {
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 21705,
                'formula' => '(UMA * VALOR)',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 21902,
                'formula' => '(UMA * 0.05 * M2)',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 10809,
                'formula' => '(UMA * VALOR + UMA * 0.05 * M2) * 0.3',
            ]);
            DB::table('conceptos_detalles_incisos')->insert([
                'concepto_detalle_id' => $i,
                'inciso' => 30501,
                'formula' => '2',
            ]);
        }
    }
}
