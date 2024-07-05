<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\CatalogoTramiteRequisito;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $catalogo = \App\Models\CatalogoTramite::find(7);
        if($catalogo) {
            $catalogo->requisitos()->attach([21, 53]);
        }

        $catalogo = \App\Models\CatalogoTramite::find(8);
        if($catalogo) {
            $catalogo->requisitos()->attach([21, 53]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
