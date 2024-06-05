<?php

namespace App\Http\Controllers;

use App\Events\TramiteCargado;
use App\Helpers\ServiciosPublicosPI;
use App\Models\CatalogoTramite;
use App\Models\Concepto;
use App\Models\ConceptoDetalle;
use App\Models\Negocio;
use App\Models\PersonaMoral;
use App\Models\Requisito;
use App\Models\TarifaProteccionCivil2024;
use App\Models\Tramite;
use App\Models\User;
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
        $entidadRevisionId = Auth::user()->entidad_revision_id;
        $catalogoTramiteId = $catalogoTramite->id;

        if ($entidadRevisionId == 2) {
            $negocioId = $request->query('negocio_id');
            $year = $request->query('year', 2024);

            return $this->obtenerConceptosServiciosPublicos($entidadRevisionId, $negocioId, $year);
        }

        if (Auth::user()->entidad_revision_id == 5) {
            $entidadRevisionId = 6;
        }

        return Concepto::where('entidad_revisora_id', $entidadRevisionId)
            ->where(function ($query) use ($catalogoTramiteId) {
                $query->where('catalogo_tramites_id', $catalogoTramiteId)
                    ->orWhere('catalogo_tramites_id', null);
            })
            ->get();
    }

    public function obtenerConceptosServiciosPublicos($entidadRevisionId, $negocioId, $year = 2024)
    {
        $negocio = Negocio::find($negocioId);
        
        $conceptos = Concepto::where('entidad_revisora_id', $entidadRevisionId)
            ->where('anualidad', $year)
            ->get();

        $tieneProgramaInterno = $negocio->tieneProgramaInterno;

        if ($tieneProgramaInterno) {
            $conceptos = $conceptos->filter(function ($concepto) {
                $concepto->opciones = json_decode($concepto->opciones);

                return $concepto->opciones && in_array('PROGRAMA_INTERNO', $concepto->opciones);
            })->values();
        } else {
            $conceptos = $conceptos->filter(function ($concepto) {
                $concepto->opciones = json_decode($concepto->opciones);

                return $concepto->opciones == null || (
                    $concepto->opciones
                    && in_array('PROGRAMA_INTERNO', $concepto->opciones)
                ) == false;
            })->values();
        }

        return $conceptos;
    }

    public function obtenerConceptoDetalles(Request $request, Concepto $concepto)
    {
        $entidadRevisionId = Auth::user()->entidad_revision_id;

        if ($concepto->anualidad == 2024 && $entidadRevisionId == 2) {
            $negocioId = $request->query('negocio_id');
            $negocio = Negocio::where('id', $negocioId)->
                first();

            return $this->conceptosDetallesProteccionCivil($concepto, $negocio);
        }

        return $concepto->detalles;
    }

    public function conceptosDetallesProteccionCivil(Concepto $concepto, Negocio $negocio)
    {
        if (! $concepto || ! $negocio) {
            return [];
        }

        if ($negocio->esDistribuidoraDeGas) {
            return ConceptoDetalle::whereIn('id', [90])->get();
        }

        $conceptoDetallesIds = $concepto->detalles->map(function ($conceptoDetalle) {
            return $conceptoDetalle->id;
        });

        $girosComerciales = $negocio->giro_comercial;
        $sectores = collect([]);
        $girosComerciales->each(function ($giroComercial) use ($sectores) {
            $sector = strtoupper($giroComercial->tipo_sector);
            if (! $sector) {
                return;
            }
            $sectores->push($sector);
        });

        $tipoTarifa = $negocio->tipoTarifa;

        $tarifas = TarifaProteccionCivil2024::whereIn('sector', $sectores)->
            whereIn('concepto_detalle_id', $conceptoDetallesIds)->
            where('tipo_tarifa', $tipoTarifa)->
            get();

        if ($tarifas->count() == 0) {
            $opciones = is_array($concepto->opciones)
                ? $concepto->opciones
                : json_decode($concepto->opciones);
            $programaIntero = $opciones
                && in_array('PROGRAMA_INTERNO', $opciones);
            $tarifa = TarifaProteccionCivil2024::whereNull('sector')->
                whereNull('tipo_tarifa')->
                where('programa_interno', $programaIntero)->
                first();

            return collect([$tarifa->conceptoDetalle]);
        }

        $tarifas = $tarifas->sortByDesc('valor');

        return collect([$tarifas->first()->conceptoDetalle]);
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

        return $conceptoDetalle->calcularIncisos($negocio, [
            'descuento2023' => $descuento2023,
            'descuento' => $descuento,
            'adeudo' => $adeudo,
            'incisosValorManual' => $incisosValorManual,
            'anio' => $request->anio,
        ]);
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
