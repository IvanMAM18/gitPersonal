<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class AddEnums extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // hice 2 métodos de casa tabla porque ejecuta antes el create que el dropColumn
        // y el change no funciona directo sobre los enums, esta es la opción que encontré
        Schema::table('estados_revision', function ($table) {
            $table->dropColumn('id_estado');
            $table->dropColumn('id_revision');
        });
        Schema::table('estados_revision', function ($table) {
            $table->enum('status', ['ENVIADO', 'RECHAZADO', 'EN REVISION', 'APROBADO'])->default('ENVIADO');
            $table->integer('revision_id')->nullable();
        });

        Schema::table('negocios', function ($table) {
            $table->dropColumn('estatus');
        });
        Schema::table('negocios', function ($table) {
            $table->enum('status', ['VISTO BUENO', 'RECHAZADO', 'PAGADO', 'EN REVISION'])->default('EN REVISION');
        });

        Schema::table('requisito_revision', function ($table) {
            $table->dropColumn('status');
        });
        Schema::table('requisito_revision', function ($table) {
            $table->enum('status', ['PENDIENTE', 'ENVIADO', 'RECHAZADO', 'EN REVISION', 'APROBADO'])->default('PENDIENTE');
        });

        Schema::table('revision', function ($table) {
            $table->dropColumn('status');
        });
        Schema::table('revision', function ($table) {
            $table->enum('status', ['PENDIENTE', 'ENVIADO', 'RECHAZADO', 'EN REVISION', 'APROBADO'])->default('EN REVISION');
        });
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
