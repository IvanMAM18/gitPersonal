<?php

namespace App\Http\Controllers;

use App\Models\Revision;

class RevisionesController
{
    public function show(Revision $revision)
    {
        $revision->load([
            'entidad',
            'estados_revision' => function ($query) use ($revision) {
                $query->with([
                    'revisor:id,nombre,apellido_pat',
                    'negocio_requisitos.requisito.negocio_archivo' => fn($q) => $q->where('tramite_id', $revision->tramite_id)
                ]);
            },
            'condicionantesRevision.condicionante'
        ]);

        $avisoEntero = $revision->tramite->aviso_entero?->load('servidorPublico');
        $servidorPublico = $avisoEntero?->servidorPublico
                    ? $avisoEntero->servidorPublico->nombre_completo
                    : 'Creado Automáticamente';

        return response([
            'revision' => $revision,
            'aviso_entero' => $avisoEntero,
            'servidor_publico'=> $servidorPublico
        ]);
    }
}
