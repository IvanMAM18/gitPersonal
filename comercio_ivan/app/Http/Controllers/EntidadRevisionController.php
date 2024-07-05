<?php

namespace App\Http\Controllers;

use App\Events\TramiteCargado;
use App\Models\CatalogoTramite;
use App\Models\Concepto;
use App\Models\ConceptoDetalle;
use App\Models\Negocio;
use App\Models\PersonaMoral;
use App\Models\Requisito;
use App\Models\Tramite;
use App\Models\User;

use App\Services\AvisoEnteroService;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EntidadRevisionController extends Controller
{
    public function obtenerTramitePorNegocio(Request $request)
    {
        $entidadRevisionId = Auth::user()->entidad_revision_id;
        $negocioId = $request->query('negocio_id');
        $year = $request->query('year', now()->year);
        if (! $entidadRevisionId || ! $negocioId) {
            return;
        }

        $tramite = Tramite::tieneNegocio($negocioId)
            ->tieneEntidadRevision($entidadRevisionId)
            ->with('catalogo_tramites')
            ->with('aviso_entero')
            ->whereYear('created_at', $year)
            ->first();

        if (! $tramite && $entidadRevisionId == 5) {
            $tramite = Tramite::tieneNegocio($negocioId)
                ->tieneEntidadRevision(6)  // Cambia este número al ID de la entidad de revisión 6
                ->with('catalogo_tramites', 'aviso_entero')
                ->first();
        }

        $avisoEntero = $tramite ? $tramite->aviso_entero : null;
        if ($avisoEntero && $avisoEntero->vigente) {
            TramiteCargado::dispatch($tramite);
        }

        return $tramite;
    }

    public function obtenerConceptos(Request $request, CatalogoTramite $catalogoTramite)
    {
        $year = $request->query('year', 2024);
        $negocioId = $request->query('negocio_id');

        return AvisoEnteroService::conceptos($catalogoTramite, $negocioId, $year);
    }

    public function obtenerConceptoDetalles(Request $request, Concepto $concepto)
    {
        $entidadRevisionId = Auth::user()->entidad_revision_id;
        $negocioId = $request->query('negocio_id');

        return AvisoEnteroService::detallesPorConcepto($concepto, $negocioId);
    }

    public function calcularDetallesIncisos(Request $request, ConceptoDetalle $conceptoDetalle)
    {
        $descuento2023 = floatval($request->input('descuento2023', 0));
        $descuento = floatval($request->input('descuento', 0));
        $adeudo = floatval($request->input('adeudo', 0));
        $negocioId = $request->negocio_id ?? $request->query('negocio_id');
        $incisosValorManual = $request->input('incisos_valor_manual', []);
        if ($negocioId) {
            $negocio = Negocio::find($negocioId);
        } else {
            $negocio = new Negocio();
        }

        $valores = [
            'descuento2023' => $descuento2023,
            'descuento' => $descuento,
            'adeudo' => $adeudo,
            'incisosValorManual' => $incisosValorManual,
            'anio' => $request->anio,
        ];

        return AvisoEnteroService::calcularIncisos($conceptoDetalle, $negocio, $valores);
    }

    public function temporal_calcular_tramites_atendidos_por_entidad($entidad_revision_id)
    {

        return 'disabled';

        $negocios = Negocio::select(['id', 'nombre_del_negocio'])
            ->with('revisiones', function ($q) use ($entidad_revision_id) {
                $q
                    ->select(['id', 'negocio_id', 'entidad_revision_id'])
                    ->with('estados_revision', function ($q) {
                        $q
                            ->select(['id', 'revision_id'])
                            ->with('negocio_requisitos', function ($q) {
                                $q
                                    // ->select(['id', 'status', 'estado_revision_id'])
                                    ->where('status', 'ENVIADO');
                            });
                    })
                    ->where('entidad_revision_id', '=', $entidad_revision_id);
            })->get();

        $arr = [];

        foreach ($negocios as $negocio) {
            foreach ($negocio->revisiones as $revision) {
                foreach ($revision->estados_revision as $estado_revision) {
                    foreach ($estado_revision->negocio_requisitos as $requisito) {
                        if (! isset($arr[$negocio->id])) {
                            $arr[$negocio->id] = 0;
                        }
                        $arr[$negocio->id] += 1;
                    }
                }
            }
        }

        return count($arr);
    }

    public function tramitesEnRevision(Request $request)
    {
        $user = Auth::user();

        $year = $request->input('year', now()->year);

        if ($user->entidad_revision_id == null) {
            abort(401);
        }

        if ($user->entidad_revision_id == 5) {
            $entidadRevisionId = 6;
        } else {
            $entidadRevisionId = $user->entidad_revision_id;
        }

        $tramites = Tramite::whereHas('tramite_padre', function (Builder $tramite) use ($year) {
            $tramite->whereYear('tramites.created_at', $year);
        })
            ->whereHas('ultima_revision', function ($revision) use ($entidadRevisionId) {
                $revision->where('entidad_revision_id', $entidadRevisionId)
                    ->whereNotIn('status', []);
            })
            ->whereHasMorph('tramitable', [User::class, PersonaMoral::class])
            ->with([
                'ultima_revision:id,revision.tramite_id,entidad_revision_id,status',
                'catalogo_tramite:id,nombre,pago',
                'tramitable',
                'aviso_entero:id,avisos_entero.tramite_id,estado',
                'tramite_padre:id,created_at',
            ])
            ->orderBy('id', 'asc');

        if ($entidadRevisionId == 6) {
            $tramites = $tramites->with([
                'ultima_revision.estados_revision.requisitos.requisito.persona_requisito',
            ]);

            $tramites = $tramites->get();
        } else {
            $tramites = $tramites->get();
        }

        foreach ($tramites as $tramite) {
            $avisoEntero = $tramite ? $tramite->aviso_entero : null;
            if ($avisoEntero && $avisoEntero->vigente) {
                TramiteCargado::dispatch($tramite);
            }
        }

        return $tramites;
    }

    public function detallesTramitePadre(Request $request, $tramiteId)
    {
        $user = Auth::user();

        if ($user->entidad_revision_id == null) {
            abort(401);
        }

        if ($user->entidad_revision_id == 5) {
            $entidadRevisionId = 6;
        } else {
            $entidadRevisionId = $user->entidad_revision_id;
        }

        $tramitePadre = Tramite::where([
            'tramite_padre_id' => null,
            'id' => $tramiteId,
        ])->firstOrFail();

        $tramitePadre->load([
            'catalogo_tramite',
            'tramitable.direccion_notificacion',
        ]);

        // dd($tramitePadre->tramites_hijos()->
        // with([
        //     'ultima_revision.estados_revision.requisitos.requisito.persona_requisito',
        //     'catalogo_tramite',
        //     'aviso_entero',
        // ])
        // ->first());

        $tramiteEntidadRevision = $tramitePadre->tramites_hijos()->
        whereHas('catalogo_tramite', function ($catalogoTramite) use ($entidadRevisionId) {
            $catalogoTramite->where('entidad_revisora_id', $entidadRevisionId);
        })->
        with([
            'ultima_revision.estados_revision.requisitos.requisito.persona_requisito',
            'catalogo_tramite',
            'aviso_entero',
            'ultima_revision.estados_revision.revisor',
        ])->
        first();

        $tramitePadre->tramite_entidad_revision = $tramiteEntidadRevision;

        $persona = $tramitePadre->tramitable;

        if ($persona::class == PersonaMoral::class) {
            $persona->load(['persona.requisitos.requisito']);
        } else {
            $persona->load(['requisitos.requisito']);
        }

        return $tramitePadre;
    }

    public function obtenerDocumentos(Request $request)
    {
        $user = Auth::user();

        if ($user->entidad_revision_id == null) {
            abort(401);
        }

        $entidadRevisionId = $user->entidad_revision_id;

        return Requisito::whereHas(
            'entidades_revisoras',
            function ($entidadRevisora) use ($entidadRevisionId) {
                $entidadRevisora->where('entidad_revision.id', $entidadRevisionId);
            }
        )->get();
    }
}
