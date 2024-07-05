<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('avisos_entero', function (Blueprint $table) {
            $table->integer('negocio_sin_registro_id')->unsigned()->nullable();
            $table->integer('tramite_id')->unsigned()->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('avisos_entero', function (Blueprint $table) {
            //
        });
    }
};
