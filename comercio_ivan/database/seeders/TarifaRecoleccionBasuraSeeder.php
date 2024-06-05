<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TarifaRecoleccionBasuraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tarifa_recoleccion_basura')->truncate();
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 1,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 8,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 1,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 1,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 14,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 1,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 3,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 1,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 4,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 1,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 5,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 1,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 6,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 1,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 8,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 1,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 2,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 8,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 2,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 2,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 14,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 2,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 3,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 2,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 5,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 2,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 6,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 2,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 6,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 2,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 8,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 2,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 3,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 17,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 3,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 22,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 3,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 24,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 3,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 5,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 3,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 12,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 3,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 17,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 3,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 12,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 3,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 17,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 3,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 22,
            'descripcion' => '',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 4,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 20,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 4,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 30,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 4,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 50,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 4,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 5,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 4,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 12,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 4,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 17,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 4,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 12,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 4,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 17,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 4,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 22,
            'descripcion' => '',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 5,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 12,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 5,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 17,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 5,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 24,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 5,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 5,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 5,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 6,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 5,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 5,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 7,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 5,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 5,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 12,
            'descripcion' => '',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 6,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 18,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 6,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 22,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 6,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 24,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 6,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 7,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 6,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 11,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 6,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 18,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 6,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 11,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 6,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 18,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 6,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 22,
            'descripcion' => '',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 7,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 8,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 7,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 7,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 14,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 7,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 3,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 7,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 4,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 7,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 6,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 7,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 6,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 7,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 8,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 7,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 8,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 15,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 8,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 17,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 8,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 20,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 8,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 5,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 8,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 7,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 8,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 8,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 8,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 12,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 8,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 15,
            'descripcion' => '',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 9,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 8,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 9,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 9,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 12,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 9,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 4,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 9,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 5,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 9,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 8,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 9,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 6,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 9,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 8,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 9,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 10,
            'periodo' => 'Diario',
            'volumen' => 'Bajo',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 10,
            'periodo' => 'Diario',
            'volumen' => 'Medio',
            'valor_uma' => 12,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 10,
            'periodo' => 'Diario',
            'volumen' => 'Alto',
            'valor_uma' => 15,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 10,
            'periodo' => '2 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 3,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 10,
            'periodo' => '2 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 5,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 10,
            'periodo' => '2 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 7,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 10,
            'periodo' => '3 veces por semana',
            'volumen' => 'Bajo',
            'valor_uma' => 5,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 10,
            'periodo' => '3 veces por semana',
            'volumen' => 'Medio',
            'valor_uma' => 7,
            'descripcion' => '',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 10,
            'periodo' => '3 veces por semana',
            'volumen' => 'Alto',
            'valor_uma' => 10,
            'descripcion' => '',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 11, //en realidad es un servicio id
            'periodo' => '',
            'volumen' => '',
            'valor_uma' => 0.66,
            'descripcion' => '0.66 del valor de la Unidad de Medida y Actualización por mes',
        ]);
        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 12, //en realidad es un servicio id
            'periodo' => '',
            'volumen' => '',
            'valor_uma' => 1.25,
            'descripcion' => '1.25 veces del valor de la Unidad de Medida y Actualización por mes, debiendo cubrirse esta tarifa al pagar la renta del local concesionado de conformidad con el artículo 167 de esta Ley',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 13, //en realidad es un servicio id
            'periodo' => '',
            'volumen' => '',
            'valor_uma' => 0,
            'descripcion' => 'Servicio privado',
        ]);

        DB::table('tarifa_recoleccion_basura')->insert([
            'giro_comercial_id' => 14, //en realidad es un servicio id
            'periodo' => '',
            'volumen' => '',
            'valor_uma' => 0,
            'descripcion' => 'Servicio privado',
        ]);
    }
}
