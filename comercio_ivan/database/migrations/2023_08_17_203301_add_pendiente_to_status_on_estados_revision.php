<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPendienteToStatusOnEstadosRevision extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. Agregar el nuevo valor "PENDIENTE" a la restricción de la columna
        DB::statement('ALTER TABLE estados_revision DROP CONSTRAINT estados_revision_status_check');

        DB::statement("ALTER TABLE estados_revision ADD CONSTRAINT estados_revision_status_check CHECK (status::text = ANY (ARRAY['ENVIADO'::character varying::text, 'RECHAZADO'::character varying::text, 'EN REVISION'::character varying::text, 'APROBADO'::character varying::text, 'PENDIENTE'::character varying::text]))");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::table('status_on_estados_revision', function (Blueprint $table) {
        //     //
        // });
        // Regresa al estado original sin el valor "PENDIENTE"
        DB::statement('ALTER TABLE estados_revision DROP CONSTRAINT estados_revision_status_check');

        DB::statement("ALTER TABLE estados_revision ADD CONSTRAINT estados_revision_status_check CHECK (status::text = ANY (ARRAY['ENVIADO'::character varying::text, 'RECHAZADO'::character varying::text, 'EN REVISION'::character varying::text, 'APROBADO'::character varying::text]))");
    }
}
