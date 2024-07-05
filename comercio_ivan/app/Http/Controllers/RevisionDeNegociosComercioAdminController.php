<?php

namespace App\Http\Controllers;
use App\Helpers\Refrendos;
use App\Events\TramiteCargado;
use App\Models\Negocio;
use App\Models\Tramite;
use Illuminate\Http\Request;

class RevisionDeNegociosComercioAdminController
{
    public function index(Request $request)
    {
        $year = $request->input('year') ?? now('Y');
        $esProSare = $request->input('es_pro_sare');
        $vendeAlcohol = $request->input('venta_alcohol');
        $validado = $request->input('validado');
        $progreso = $request->input('progreso');
        $tramiteId = $request->input('tramite_id');
        $obsoletos = $request->boolean('obsoletos');

        // Filtro por nombre del negocio
        $nombreDelNegocio = $request->input('nombre_del_negocio');

        // Filtro por nombre tamano de la empresa
        $tamanoEmpresa = null;
        if ($request->has('tamano_empresa') && $request->input('tamano_empresa')) {
            $tamanoEmpresa = $request->input('tamano_empresa');
        }

        $tramites = Tramite::with([
                'aviso_entero',
                'tramitable' => function ($query) {
                    $query->select(['id', 'nombre_del_negocio', 'validado_por', 'tamano_empresa', 'venta_alcohol'])
                        ->with([
                            'revisiones.entidad:id,nombre',
                            'giro_comercial:giro_comercial.id,nombre,tipo',
                            'validador:users.id,users.nombre',
                        ]);
                },
                'tramitesHijos' => function ($query) {
                    $query->with([
                        'catalogo:id,nombre,pago',
                        'aviso_entero',
                        'revisiones' => function ($query) {
                            $query->select(['id', 'entidad_revision_id', 'negocio_id', 'tramite_id', 'status'])
                                ->with('entidad:id,nombre');
                        },
                    ]);
                },
                'revisiones' => function ($query) {
                    $query->select(['id', 'entidad_revision_id', 'negocio_id', 'tramite_id', 'status'])
                        ->with('entidad:id,nombre');
                },
                'catalogo:id,nombre,pago'
            ])
            ->where(
                fn($groupedWhere) => $groupedWhere->padres()
                    ->whereHasMorph('tramitable', [Negocio::class], function ($query) use ($obsoletos, $nombreDelNegocio, $esProSare, $tamanoEmpresa, $vendeAlcohol, $validado) {
                        $query
                            ->when($obsoletos == true, fn($query) => $query->conTramitesObsoletos(Refrendos::licenciasDeFuncionamiento()))
                            ->when($validado === "2", fn($query) => $query->rechazado())
                            ->when($validado === "1", fn($query) => $query->withoutRechazadoRevisions()->validado())
                            ->when($validado === "0", fn($query) => $query->withoutRechazadoRevisions()->noValidado())
                            ->when($vendeAlcohol !== null, fn($query) => $query->where('venta_alcohol', $vendeAlcohol))
                            ->when($tamanoEmpresa, fn($query) => $query->where('tamano_empresa', $tamanoEmpresa))
                            ->when($esProSare, fn($query) => $query->esBajoImpacto(), fn($query) => $query->esMedianoAltoImpacto())
                            ->where('nombre_del_negocio', 'ilike', '%' . $nombreDelNegocio . '%');
                    })
                    ->when($tramiteId, function ($query) use ($tramiteId) {
                        $query->where('id', $tramiteId);
                    })
                    ->filtrarPorProgreso($progreso)
                    ->when($obsoletos == false, function ($query) use ($year) {
                        $query->whereYear('created_at', $year);
                    })
            )
            ->when($tramiteId, function($query) use($year, $tramiteId) {
                $query->orWhere(function ($query) use ($year, $tramiteId) {
                    $query->padres()
                        ->whereYear('created_at', $year)
                        ->whereHasMorph('tramitable', [Negocio::class], function ($query) use ($tramiteId) {
                            $query->whereHas('tramites_padres', fn($query) => $query->where('id', 'like', '%' . $tramiteId . '%'));
                        });
                });
            })
            ->orderByDesc('id')
            ->paginate($request->input('per_page'));

        collect($tramites->items())->each(function($tramite) {
            $tramite->tramitesHijos->each(function ($tramiteHijo) {
                if ($tramiteHijo->aviso_entero?->vigente) {
                    TramiteCargado::dispatch($tramiteHijo);
                }
            });
        });

        return $tramites;
    }
}
