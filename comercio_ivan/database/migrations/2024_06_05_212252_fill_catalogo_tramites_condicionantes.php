<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\CatalogoTramiteCondicionante;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $catalogo = \App\Models\CatalogoTramite::find(7);
        if($catalogo) {
            $catalogo->condicionantes()->attach([3, 4, 6]);
        }

        $catalogo = \App\Models\CatalogoTramite::find(8);
        if($catalogo) {
            $catalogo->condicionantes()->attach([3, 4, 6]);
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
