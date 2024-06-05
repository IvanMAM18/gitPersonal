<?php

namespace App\Http\Controllers;

use App\Helpers\Requisito;
use App\Models\AvisoEntero;
use App\Models\PersonaMoral;
use App\Models\Tramite;
use App\Models\User;

class ContribuyentesConLicenciaDeAlcoholesController extends Controller
{
    public function index($year)
    {
        return Tramite::whereIn('tramitable_type', [PersonaMoral::class, User::class])
            ->padres()
            ->deAlcoholes()
            ->whereHas('aviso_entero', fn ($query) => $query->where('estado', AvisoEntero::$PAGADO))
            ->whereHas('revisiones', function ($query) {
                $query->whereHas('requirements', function ($query) {
                    $query->where('requisitos.id', Requisito::$NUMERO_DE_LICENCIA_DE_ALCOHOL)
                        ->aprobado();
                });
            })
            ->whereYear('created_at', $year)
            ->with([
                'tramitable',
                'revisiones' => function ($query) {
                    $query->whereHas('requirements', function ($query) {
                        $query->where('requisitos.id', Requisito::$NUMERO_DE_LICENCIA_DE_ALCOHOL)
                            ->where('requisito_revision.status', 'APROBADO');
                    })
                        ->with('requirements', fn ($query) => $query->where('requisitos.id', Requisito::$NUMERO_DE_LICENCIA_DE_ALCOHOL));
                },
            ])
            ->get()
            ->map(function ($tramite) {
                return [
                    'id' => $tramite->tramitable->id,
                    'licencia_refrendar' => $tramite->revisiones->first()->requirements->first()->pivot->valor,
                    'rfc' => $tramite->tramitable->rfc,
                    'tipomodelo' => $tramite->tramitable_type,
                    'tramite_persona_id' => $tramite->id,
                    'nombre_del_negocio' => $tramite->tramitable instanceof PersonaMoral ? $tramite->tramitable->razon_social : $tramite->tramitable->nombre_completo,
                ];
            });
    }
}
