<?php

use Illuminate\Database\Migrations\Migration;

class CreateNegociosConRefrendo2024Sp extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
        CREATE OR REPLACE FUNCTION get_negocios_tramites_comercio( year INT)
        RETURNS TABLE (
            id BIGINT,
            negocio_id INT,
            tramite_id INT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            deleted_at TIMESTAMP
        )
        AS $$
        BEGIN
            RETURN QUERY
            SELECT
                tc.id,
                tc.negocio_id,
                tc.tramite_id,
                tc.created_at,
                tc.updated_at,
                tc.deleted_at
            FROM tramites_comercio tc
            JOIN tramites t ON tc.tramite_id = t.id
            WHERE
                t.catalogo_tramites_id IN (3, 4)
                AND EXTRACT(YEAR FROM tc.created_at) = year;
        END;
        $$ LANGUAGE plpgsql;
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('DROP FUNCTION IF EXISTS get_negocios_tramites_comercio;');
    }
}
