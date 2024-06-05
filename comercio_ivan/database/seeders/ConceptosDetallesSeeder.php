<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConceptosDetallesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('conceptos_detalles')->insert([
            'id' => 1,
            'concepto_id' => 1,
            'descripcion' => 'TIENDAS DEPARTAMENTALES, CLUBES DEPORTIVOS, SALA CINEMATOGRÁFICA, TEATROS,
            SALÓN DE RENTA PARA EVENTOS, DESMANTELADORAS.',
            'valor' => 8,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 2,
            'concepto_id' => 1,
            'descripcion' => 'COMERCIO EN PEQUEÑOS Y PUESTOS SEMIFIJOS',
            'valor' => 2,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 3,
            'concepto_id' => 1,
            'descripcion' => 'EDIFICIOS INDUSTRIALES 4.MACRO INDUSTRIA',
            'valor' => 10,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 4,
            'concepto_id' => 1,
            'descripcion' => 'MOTELES DE 11-20 HABITACIONES',
            'valor' => 4,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 5,
            'concepto_id' => 1,
            'descripcion' => 'EDIFICIOS EDUCATIVOS DE 11 AULAS EN ADELANTE',
            'valor' => 5,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 6,
            'concepto_id' => 1,
            'descripcion' => 'MOTELES: 1.- HASTA 10 HABITACIONES',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 7,
            'concepto_id' => 1,
            'descripcion' => 'BARES, BILLARES, CANTINA, CAFÉ CANTANTE, PEÑAS CULTURALES, RESTAURANTE BAR,
            RESTAURANTE, CLÍNICAS.',
            'valor' => 6,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 8,
            'concepto_id' => 1,
            'descripcion' => 'OTROS GIROS NO ESPECIFICADOS',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 9,
            'concepto_id' => 1,
            'descripcion' => 'EDIFICIOS EDUCATIVOS: HASTA 10 AULAS',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 10,
            'concepto_id' => 1,
            'descripcion' => 'DISCOTECAS, CENTRO DE ESPECTÁCULOS, CABARET, CENTROS NOCTURNOS, BODEGA DE
            DISTRIBUCIÓN (EXCEPTO MATERIALES DE ALTO RIESGO), HOSPITAL.',
            'valor' => 6,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 11,
            'concepto_id' => 1,
            'descripcion' => 'HOTELES:1.- HASTA 30 HABITACIONES',
            'valor' => 5,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 12,
            'concepto_id' => 1,
            'descripcion' => 'DISTRIBUIDORAS DE GASES, COMBUSTIBLES Y LUBRICANTES, OXÍGENOS Y ACETILENOS,
            GASOLINERAS Y DEPÓSITOS DE COMBUSTIBLES Y LUBRICANTES, Y DEMÁS DE ALTO RIESGO.',
            'valor' => 15,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 13,
            'concepto_id' => 1,
            'descripcion' => 'HOTELES DE 31 HABITACIONES ADELANTE',
            'valor' => 8,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 14,
            'concepto_id' => 1,
            'descripcion' => 'EDIFICIOS INDUSTRIALES 1.- MICRO INDUSTRIA DE 1-15 EMPLEADOS',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 15,
            'concepto_id' => 1,
            'descripcion' => 'MOTELES DE 21 HABITACIONES EN ADELANTE',
            'valor' => 5,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 16,
            'concepto_id' => 1,
            'descripcion' => 'DESPACHO DE PROFESIONISTAS Y GIROS DE SERVICIO',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 17,
            'concepto_id' => 1,
            'descripcion' => 'EDIFICIOS INDUSTRIALES 2. PEQUEÑA INDUSTRIA DE 16-50 EMPLEADOS',
            'valor' => 6,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 18,
            'concepto_id' => 1,
            'descripcion' => 'EDIFICIOS INDUSTRIALES 3. INDUSTRIA MEDIANA DE 51-100 EMPLEADOS',
            'valor' => 8,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 19,
            'concepto_id' => 1,
            'descripcion' => 'LONCHERÍAS, PANADERÍAS, LAVANDERÍAS, FERRETERÍAS, REFACCIONARIA, TIENDAS DE ROPA,
            MISCELÁNEAS, SUPER MERCADOS, TIENDAS DE ALIMENTOS, DEPÓSITOS, LICORERÍAS,
            ULTRAMARINOS, FARMACIAS, PAPELERÍAS, LIBRERÍAS, TEMPLOS RELIGIOSOS, PALAPAS Y
            SALÓN DE FIESTAS INFANTILES.',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        // ECOLOGIA

        DB::table('conceptos_detalles')->insert([
            'id' => 20,
            'concepto_id' => 2,
            'descripcion' => 'N/A',
            'valor' => 5,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 21,
            'concepto_id' => 3,
            'descripcion' => 'N/A',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 22,
            'concepto_id' => 4,
            'descripcion' => 'N/A',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 23,
            'concepto_id' => 5,
            'descripcion' => 'N/A',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 24,
            'concepto_id' => 6,
            'descripcion' => 'N/A',
            'valor' => 3,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        // USO DE SUELO
        DB::table('conceptos_detalles')->insert([
            'id' => 25,
            'concepto_id' => 7,
            'descripcion' => 'N/A',
            'valor' => 20,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 26,
            'concepto_id' => 8,
            'descripcion' => 'N/A',
            'valor' => 15,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        DB::table('conceptos_detalles')->insert([
            'id' => 27,
            'concepto_id' => 9,
            'descripcion' => 'N/A',
            'valor' => 10,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
        ]);

        // SERVICIOS PUBLICOS
        DB::table('conceptos_detalles')->insert([
            'id' => 28,
            'concepto_id' => 10,
            'descripcion' => 'N/A',
            'valor' => 0,
            'formula' => '(UMA * VALOR) * 1.3 + 2',
            'usar_valor_recoleccion_basura' => true,
        ]);
    }
}
