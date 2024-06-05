<?php

use Illuminate\Database\Migrations\Migration;

class CreateStoredProcedureGetTramitesComercioByYear extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // NECESITA HACERSE CORRECTAMENTE
        DB::unprepared('
        CREATE OR REPLACE FUNCTION get_tramites_comercio(negocio_id_param INT, year INT)
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
                tc.negocio_id = negocio_id_param
                AND t.catalogo_tramites_id IN (3, 4)
                AND t.id IN (
                    SELECT tc_inner.tramite_id
                    FROM tramites_comercio tc_inner
                    WHERE tc_inner.negocio_id = negocio_id_param
                )
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
        DB::unprepared('DROP FUNCTION IF EXISTS get_tramites_comercio;');
    }
}
