<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class FillConceptosDetallesProteccionCivil2024 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $now = now();
        DB::table('conceptos_detalles')->
            insert([
                [
                    'id' => 65,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector comercial, Tarifa Puestos semifijos y autoempleo',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 2,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 66,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector comercial, Tarifa Micro',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 67,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector comercial, Tarifa Pequeña',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 68,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector comercial, Tarifa Mediana',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],

                [
                    'id' => 69,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector de servicios, Tarifa Puestos semifijos y autoempleo',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 2,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 70,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector de servicios, Tarifa Micro',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 71,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector de servicios, Tarifa Pequeña',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 72,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector de servicios, Tarifa Mediana',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],

                [
                    'id' => 73,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector industria, Tarifa Micro',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 74,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector industria, Tarifa Pequeña',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 75,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector industria, Tarifa Mediana',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 8,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 76,
                    'concepto_id' => 16,
                    'descripcion' => 'Sector industria, Tarifa Grande',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 10,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 77,
                    'concepto_id' => 16,
                    'descripcion' => 'Distribuidoras de gases, combustibles y lubricantes, oxígenos y acetilenos, gasolineras y depósitos de combustibles y lubricantes, y demás de alto riesgo.',
                    'formula' => 'UMA * VALOR * 1.3 + 2',
                    'valor' => 15,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],

                // PROGRAMA INTERNO
                [
                    'id' => 78,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector comercial, Tarifa Puestos semifijos y autoempleo',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 2,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 79,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector comercial, Tarifa Micro',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 80,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector comercial, Tarifa Pequeña',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 81,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector comercial, Tarifa Mediana',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],

                [
                    'id' => 82,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector de servicios, Tarifa Puestos semifijos y autoempleo',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 2,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 83,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector de servicios, Tarifa Micro',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 84,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector de servicios, Tarifa Pequeña',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 85,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector de servicios, Tarifa Mediana',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],

                [
                    'id' => 86,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector industria, Tarifa Micro',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 3,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 87,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector industria, Tarifa Pequeña',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 6,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 88,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector industria, Tarifa Mediana',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 8,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 89,
                    'concepto_id' => 17,
                    'descripcion' => 'Sector industria, Tarifa Grande',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 10,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 90,
                    'concepto_id' => 17,
                    'descripcion' => 'Distribuidoras de gases, combustibles y lubricantes, oxígenos y acetilenos, gasolineras y depósitos de combustibles y lubricantes, y demás de alto riesgo.',
                    'formula' => '(UMA * VALOR + UMA * TARIFA_PI) * 1.3 + 2',
                    'valor' => 15,
                    'created_at' => $now,
                    'updated_at' => $now,
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
        DB::table('conceptos_detalles')->
            whereIn('id', [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82])->
            delete();
    }
}
