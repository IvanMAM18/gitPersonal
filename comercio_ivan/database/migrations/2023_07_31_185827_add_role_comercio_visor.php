<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleComercioVisor extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('roles')->insert([
            'nombre' => 'ComercioAdminVisor',
            'descripcion' => 'Director de entidad comercio dedicada a revisar registros',
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        // Schema::table('roles', function (Blueprint $table) {
        //     $table->dropColumn('tipo');
        // });
    }
}