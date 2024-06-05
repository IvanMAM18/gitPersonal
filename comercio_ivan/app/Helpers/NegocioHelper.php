<?php

namespace App\Helpers;

use App\Models\Negocio;

class NegocioHelper
{
    public static function obtenerStatusDelNegocio($negocioId)
    {
        $negocio = Negocio::with('tramite_comercio_padre', function ($tramiteComercioPadre) {
            $tramiteComercioPadre->with('tramite', function ($tramiteComercio) {
                $tramiteComercio->with('ultima_revision');
            });
        })
            ->whereYear('created_at', date('Y'))
            ->where('id', $negocioId)->first();

        if ($negocio->tramite_comercio_padre === null) {
            return 'PENDIENTE';
        }

        $tramiteComercioStatus = $negocio->tramite_comercio_padre->tramite->ultima_revision->status;

        if ($tramiteComercioStatus === 'VISOR') {
            return 'REVISION';
        }

        if ($tramiteComercioStatus === 'APROBADO') {
            return 'VIGENTE';
        }
    }
}
