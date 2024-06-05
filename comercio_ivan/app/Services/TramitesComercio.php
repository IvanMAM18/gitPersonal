<?php

namespace App\Services;

use App\Models\Negocio;
use App\Models\Tramite;

class TramitesComercio
{
    // Nose por que la funcion hace referencia a estos dos tramites especificamente nadamas
    public static $REFRENDO_LICENCIA_DE_FUNCIONAMIENTO = 3;

    public static $REFRENDO_LICENCIA_DE_FUNCIONAMIENTO_SARE = 4;

    /**
     * Basicamente esto es lo que hace la funcion 'get_negocios_tramites_comercio'.
     */
    public function fetch($year = null)
    {
        return Tramite::where('tramitable_type', Negocio::class)
            ->whereHas('catalogo', fn ($q) => $q->whereIn('id', [
                self::$REFRENDO_LICENCIA_DE_FUNCIONAMIENTO,
                self::$REFRENDO_LICENCIA_DE_FUNCIONAMIENTO_SARE,
            ]))
            ->when($year, fn ($q) => $q->whereYear($year));
    }
}
