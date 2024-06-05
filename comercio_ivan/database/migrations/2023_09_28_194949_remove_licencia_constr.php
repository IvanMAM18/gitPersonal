<?php

use Illuminate\Database\Migrations\Migration;

class RemoveLicenciaConstr extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        DB::statement('ALTER TABLE negocios_licencias DROP CONSTRAINT negocios_licencias_negocio_propietario_id_foreign;');
        DB::statement('ALTER TABLE negocios_licencias ALTER COLUMN negocio_propietario_id DROP NOT NULL;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
