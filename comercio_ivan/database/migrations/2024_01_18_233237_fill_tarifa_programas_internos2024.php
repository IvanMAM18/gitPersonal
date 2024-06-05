<?php

use Illuminate\Database\Migrations\Migration;

class FillTarifaProgramasInternos2024 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $now = now();
        DB::table('tarifa_programas_internos2024')->
            insert([
                [
                    'id' => 1,
                    'descripcion' => 'De 50 a 100 trabajadores y/o afluencia mayor a 50 personas.',
                    'min_trabajadores' => 50,
                    'valor' => 14,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 2,
                    'descripcion' => 'De 101 trabajadores en adelante y/o afluencia mayor a 70 personas.',
                    'min_trabajadores' => 101,
                    'valor' => 20,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => 3,
                    'descripcion' => 'Distribuidoras de gases, combustibles y lubricantes, oxígenos y acetilenos, gasolineras y depósitos de combustibles y lubricantes y demás de alto riesgo',
                    'min_trabajadores' => null,
                    'valor' => 25,
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
        DB::table('tarifa_programas_internos2024')->
            whereIn('id', [1, 2, 3])->
            delete();
    }
}
