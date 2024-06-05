<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use App\Models\Tramite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class EstadisticasEntidadRevisoraController extends Controller
{
    /**
     * Resuelve la estadistica que va a regresar por entidad relacion.
     */
    public function index($estadistica, Request $request)
    {
        // Funciones validas definidas
        $estadisticasValidas = [
            'total-aprobados' => 'getTotalAprobados',
            'total-validados' => 'getTotalValidados',
            'total-rechazados' => 'getTotalRechazados',
            'pendientes-por-revisar' => 'getTotalPendientesPorRevisar',
            'alto-bajo-impacto' => 'getEntidadPorAltoBajoImpacto',
            'avisos-entero-no-generados' => 'getPendientesAvisoDeEntero',
            'resolutivos-pagados' => 'getResolutivosPagados',
            'resolutivos-impresos' => 'getResolutivosImpresos',
            'resolutivos-no-impresos' => 'getResolutivosNoImpresos',
        ];

        // Si el tipo de estadistica no existe en el array de estadisticas, mandamos un 404,
        // para que no nos de un error.
        if (!isset($estadisticasValidas[$estadistica])) {
            abort(404);
        }

        // Llamamos la funcion y le pasamos los parametros.
        $funcion = $estadisticasValidas[$estadistica];
        return $this->{$funcion}($request, currentUser()->entidad_revision->id);
    }

    /**
     * Devuelve el total de negocios aprobados con tramite padre del año dado.
     */
    protected function getTotalAprobados(Request $request, $entidad_revision_id)
    {
        $year = $request->input('year', now()->year);

        $cacheKey = "getTotalAprobados?year={$year}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $tramiteValidados = Tramite::tieneEntidadRevision($entidad_revision_id)
            ->conTramitePadre($year)
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                $query->validado();
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        Cache::put($cacheKey, $tramiteValidados, now()->addMinutes(30));

        return response($tramiteValidados);
    }

    /**
     * Devuelve el total de negocios validados con tramite padre del año dado.
     */
    protected function getTotalValidados(Request $request, $entidad_revision_id)
    {
        $year = $request->input('year', now()->year);

        $cacheKey = "getTotalValidados?year={$year}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $tramitesValidados = Tramite::with('tramitable')
            ->conTramitePadre($year)
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                $query->validado();
            })
            ->whereHas('catalogo_tramites', function ($catalogoTramites) use ($entidad_revision_id) {
                $catalogoTramites->where('entidad_revisora_id', $entidad_revision_id);
            })
            ->whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        Cache::put($cacheKey, $tramitesValidados, now()->addMinutes(30));

        return response($tramitesValidados);
    }

    protected function getTotalRechazados(Request $request, $entidad_revision_id)
    {
        $year = $request->input('year', now()->year);

        $cacheKey = "getTotalRechazados?year={$year}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $tramiteValidados = Tramite::with('tramitable')
            ->conTramitePadre($year)
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                $query->validado();
            })
            ->whereHas('catalogo_tramites', function ($catalogoTramites) use ($entidad_revision_id) {
                $catalogoTramites->where('entidad_revisora_id', $entidad_revision_id);
            })
            ->whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        Cache::put($cacheKey, $tramiteValidados, now()->addMinutes(30));

        return response($tramiteValidados);
    }

    protected function getTotalPendientesPorRevisar(Request $request, $entidad_revision_id)
    {
        $year = $request->input('year', now()->year);

        $cacheKey = "getTotalPendientesPorRevisar?year={$year}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        if ($entidad_revision_id != 3) {
            $tramitesPendientesPorRevisar = Tramite::with('tramitable')
                ->conTramitePadre($year)
                ->tieneNegocioValidado()
                ->tieneEntidadRevision($entidad_revision_id)
                ->whereHas('revisions', function ($revision) {
                    $revision->has('estados_revision', '=', 1);
                })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();
        } else {
            $tramitesPendientesPorRevisar = Tramite::with('tramitable')
                ->conTramitePadre($year)
                ->tieneNegocioValidado()
                ->tieneNegocioConImpacto('mediano_alto_impacto')
                ->tieneEntidadRevision($entidad_revision_id)
                ->whereHas('revisions', function ($revision) {
                    $revision->has('estados_revision', '=', 1);
                })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();
        }

        Cache::put($cacheKey, $tramitesPendientesPorRevisar, now()->addMinutes(30));

        return response($tramitesPendientesPorRevisar);
    }

    protected function getEntidadPorAltoBajoImpacto(Request $request, $entidad_revision_id)
    {
        $year = $request->input('year', now()->year);

        $cacheKey = "getEntidadPorAltoBajoImpacto?year={$year}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $tramitePorImpacto = ['total' => 0, 'bajo_impacto' => 0, 'alto_impacto' => 0];

        $tramitePorImpacto['total'] = Tramite::tieneEntidadRevision($entidad_revision_id)
            ->conTramitePadre($year)
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                $query->validado();
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitePorImpacto['bajo_impacto'] = Tramite::tieneEntidadRevision($entidad_revision_id)
            ->conTramitePadre($year)
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                $query->validado()->where('impacto_giro_comercial', 'bajo_impacto');
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitePorImpacto['alto_impacto'] = Tramite::tieneEntidadRevision($entidad_revision_id)
            ->conTramitePadre($year)
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                $query->where('impacto_giro_comercial', 'mediano_alto_impacto')->validado();
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        Cache::put($cacheKey, $tramitePorImpacto, now()->addMinutes(30));

        return response($tramitePorImpacto);
    }

    protected function getPendientesAvisoDeEntero(Request $request, $entidad_revision_id)
    {
        $year = $request->input('year', now()->year);

        $cacheKey = "getPendientesAvisoDeEntero?year={$year}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $tramitesAvisosDeEntero = Tramite::tieneEntidadRevision($entidad_revision_id)
            ->conTramitePadre($year)
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                $query->validado();
            })
            ->whereHas('catalogo_tramites', function ($catalogoTramites) use ($entidad_revision_id) {
                $catalogoTramites->where('pago', 'T')
                    ->where('entidad_revisora_id', $entidad_revision_id);
            })
            ->whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
            ->doesntHave('avisos_entero')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        Cache::put($cacheKey, $tramitesAvisosDeEntero, now()->addMinutes(30));

        return response($tramitesAvisosDeEntero);
    }

    protected function getResolutivosPagados(Request $request, $entidad_revision_id)
    {
        $year = $request->input('year', now()->year);

        $cacheKey = "getResolutivosPagados?year={$year}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $count = Negocio::select(['id', 'impacto_giro_comercial'])
            ->whereHas('resolutivos', function ($resolutivo) use ($entidad_revision_id) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id'])
                    ->where('entidad_revisora_id', $entidad_revision_id)
                    ->whereNotNull('negocio_id')
                    ->whereNotNull('entidad_revisora_id');
            })
            ->whereHas('tramites', function ($query) use ($entidad_revision_id, $year) {
                $query
                    ->conTramitePadre($year)
                    ->whereHas('catalogo_tramites', function ($q) use ($entidad_revision_id) {
                        if ($entidad_revision_id !== 5 && $entidad_revision_id !== '5') {
                            $q->where('entidad_revisora_id', $entidad_revision_id)
                                ->where('pago', '1')->where('resolutivo', '1');
                        } else {
                            $q->where('pago', '1')->where('resolutivo', '1');
                        }
                    })
                    ->whereHas('avisos_entero');
            })
            ->count();

        Cache::put($cacheKey, $count, now()->addMinutes(30));

        return response($count);
    }

    protected function getResolutivosImpresos(Request $request, $entidad_revision_id)
    {
        $year = $request->input('year', now()->year);

        $cacheKey = "getResolutivosImpresos?year={$year}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $count = Negocio::select(['id', 'impacto_giro_comercial'])
            ->whereHas('resolutivos', function ($resolutivo) use ($entidad_revision_id) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id'])
                    ->where('entidad_revisora_id', $entidad_revision_id)
                    ->whereNotNull('negocio_id')
                    ->whereNotNull('entidad_revisora_id')
                    ->whereNotNull('folio')
                    ->where('folio', '<>', '');
            })
            ->whereHas('tramites', function ($query) use ($entidad_revision_id, $year) {
                $query
                    ->conTramitePadre($year)
                    ->whereHas('catalogo_tramites', function ($q) use ($entidad_revision_id) {
                    if ($entidad_revision_id !== 5 && $entidad_revision_id !== '5') {
                        $q->where('entidad_revisora_id', $entidad_revision_id)
                            ->where('pago', '1')->where('resolutivo', '1');
                    } else {
                        $q->where('pago', '1')->where('resolutivo', '1');
                    }
                })
                    ->whereHas('avisos_entero');
            })
            ->count();

        Cache::put($cacheKey, $count, now()->addMinutes(30));

        return response($count);
    }

    protected function getResolutivosNoImpresos(Request $request, $entidad_revision_id)
    {
        $year = $request->input('year', now()->year);

        $cacheKey = "getResolutivosNoImpresos?year={$year}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $count = Negocio::select(['id', 'impacto_giro_comercial'])
            ->whereHas('resolutivos', function ($resolutivo) use ($entidad_revision_id) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id'])
                    ->where('entidad_revisora_id', $entidad_revision_id)
                    ->whereNotNull('negocio_id')
                    ->whereNotNull('entidad_revisora_id')
                    ->whereNull('folio')
                    ->where('folio', '');
            })
            ->whereHas('tramites', function ($query) use ($entidad_revision_id, $year) {
                $query
                    ->conTramitePadre($year)
                    ->whereHas('catalogo_tramites', function ($q) use ($entidad_revision_id) {
                        if ($entidad_revision_id !== 5 && $entidad_revision_id !== '5') {
                            $q->where('entidad_revisora_id', $entidad_revision_id)
                                ->where('pago', '1')->where('resolutivo', '1');
                        } else {
                            $q->where('pago', '1')->where('resolutivo', '1');
                        }
                    })
                    ->whereHas('avisos_entero');
            })
            ->count();

        Cache::put($cacheKey, $count, now()->addMinutes(30));

        return response($count);
    }
}
