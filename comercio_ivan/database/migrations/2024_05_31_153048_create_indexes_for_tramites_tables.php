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
        Schema::table('tramites', function (Blueprint $table) {
            $table->foreign('tramite_padre_id', 'tramite_padre_id_foreign_key')->references('id')->on('tramites');
            $table->foreign('catalogo_tramites_id', 'catalogo_id_foreign_key')->references('id')->on('catalogo_tramites');
            $table->index(['tramitable_type', 'tramitable_id']);
        });
        Schema::table('catalogo_tramites', function (Blueprint $table) {
            $table->foreign('entidad_revisora_id', 'entidad_revisora_id_foreign_key')->references('id')->on('entidad_revision');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalogo_tramites', function (Blueprint $table) {
            $table->dropForeign('entidad_revisora_id_foreign_key');
        });
        Schema::table('tramites', function (Blueprint $table) {
            $table->dropForeign('tramite_padre_id_foreign_key');
            $table->dropForeign('catalogo_id_foreign_key');
        });
    }
};
