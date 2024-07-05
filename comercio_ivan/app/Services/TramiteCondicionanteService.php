<?php

namespace App\Services;

use App\Models\CondicionantesRevision;
use App\Models\Revision;
use App\Models\Tramite;

class TramiteCondicionanteService
{
    public static function crearCondicionantesPorTramite(Tramite $tramite, Revision $revision)
    {
        $condicionantes = $tramite->catalogo->condicionantes()->get();

        foreach ($condicionantes as $condicionante) {
            CondicionantesRevision::firstOrCreate([
                'revision_id' => $revision->id,
                'condicionante_id' => $condicionante->id,
                'estado_id' => 1,
            ]);
        }
    }
}
