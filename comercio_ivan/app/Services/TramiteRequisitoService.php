<?php

namespace App\Services;

use App\Models\Negocio;
use App\Models\NegocioRequisitoRevision;
use App\Models\RequisitoEntidad;
use App\Models\RequisitoRevision;
use App\Models\Revision;
use App\Models\Tramite;
use App\Models\Requisito;
use App\Helpers\EntidadRevisora;

class TramiteRequisitoService
{
    public static function crearRequisitosPorTramite(Tramite $tramite, Revision $revision)
    {
        $requisitos = $tramite->catalogo->requisitos()->get();
        $tramite->tramitable->anio_padre_tramite=$tramite->created_at->year;
        if ($tramite->tramitable_type == Negocio::class && $tramite->tramitable->tieneProgramaInterno && $revision->entidad_revision_id == EntidadRevisora::$PROTECCION_CIVIL) {
            $programaInterno = Requisito::where('nombre', 'Programa interno de proteccion civil')->first();

            $requisitoCatalogo = RequisitoEntidad::select('id')
                    ->where('entidad_revisora_id', EntidadRevisora::$PROTECCION_CIVIL)
                    ->where('catalogo_requisito_id', $programaInterno->id)
                    ->first();

            NegocioRequisitoRevision::create([
                'requisito_id' => $programaInterno->id,
                'revision_id' => $revision->id,
                'catalogo_id' => $requisitoCatalogo->id,
                'status' => 'PENDIENTE',
                'estado_revision_id' => $revision->estados_revision()->first()->id,
            ]);
        }

        foreach ($requisitos as $requisito) {
            if ($tramite->tramitable instanceof Negocio) {

                $requisitoCatalogo = RequisitoEntidad::select('id')
                    ->where('entidad_revisora_id', $tramite->catalogo_tramite->entidad_revisora_id)
                    ->where('catalogo_requisito_id', $requisito->id)
                    ->first();

                NegocioRequisitoRevision::create([
                    'requisito_id' => $requisito->id,
                    'revision_id' => $revision->id,
                    'catalogo_id' => $requisitoCatalogo->id,
                    'status' => 'PENDIENTE',
                    'estado_revision_id' => $revision->estados_revision()->first()->id,
                ]);
            } else {
                RequisitoRevision::firstOrCreate([
                    'requisito_id' => $requisito->id,
                    'revision_id' => $revision->id,
                    'estado_revision_id' => $revision->estados_revision()->first()->id,
                    'status' => 'PENDIENTE',
                    'valor' => ''
                ]);
            }
        }
    }
}
