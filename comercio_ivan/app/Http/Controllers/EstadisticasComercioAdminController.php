<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use App\Models\Tramite;

class EstadisticasComercioAdminController extends Controller
{
    public function getTotales()
    {
        $entidadesRevision = [
            'uso_de_suelo' => 1,
            'proteccion_civil' => 2,
            'medio_ambiente' => 3,
            'servicios_publicos' => 4,
        ];
        $tramitesValidados = [
            'comercio' => 0,
            'uso_de_suelo' => 0,
            'proteccion_civil' => 0,
            'servicios_publicos' => 0,
            'medio_ambiente' => 0,
        ];

        $tramitesValidados['comercio'] = Tramite::whereNull('tramite_padre_id')
            ->hasNegocio()
            ->with('tramitable')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesValidados['uso_de_suelo'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['uso_de_suelo'])
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesValidados['proteccion_civil'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['proteccion_civil'])
            ->has('tramite_padre')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesValidados['medio_ambiente'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['medio_ambiente'])
            ->tieneNegocioConImpacto('mediano_alto_impacto')
            ->has('tramite_padre')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesValidados['servicios_publicos'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneNegocioConNivelRecoleccionAll2()
            ->tieneEntidadRevision($entidadesRevision['servicios_publicos'])
            ->has('tramite_padre')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        return response($tramitesValidados);
    }

    public function getTramitesRecibidos()
    {
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];

        $tramitesRecibidos = [
            // 'TIPO' => 'RECIBIDOS',
            'COMERCIO_BAJO' => 0,
            'COMERCIO_ALTO' => 0,
            'USO_DE_SUELO_APERTURA_BAJO' => 0,
            'USO_DE_SUELO_APERTURA_ALTO' => 0,
            'USO_DE_SUELO_REFRENDO_BAJO' => 0,
            'USO_DE_SUELO_REFRENDO_ALTO' => 0,
            'MEDIO_AMBIENTE_ALTO' => 0,
            'SERVICIOS_PUBLICOS_PROPIO' => 0,
            'SERVICIOS_PUBLICOS_PRIVADO' => 0,
            'SERVICIOS_PUBLICOS_RELLENO' => 0,
            'PROTECCION_CIVIL_BAJO' => 0,
            'PROTECCION_CIVIL_ALTO' => 0,
        ];

        $tramitesRecibidos['COMERCIO_BAJO'] = Tramite::whereNull('tramite_padre_id')
            ->tieneNegocioConImpacto('bajo_impacto')
            ->with('tramitable')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['COMERCIO_ALTO'] = Tramite::whereNull('tramite_padre_id')
            ->tieneNegocioConImpacto('mediano_alto_impacto')
            ->with('tramitable')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['USO_DE_SUELO_APERTURA_BAJO'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])
            ->whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento Sare')->whereNull('deleted_at');
            })
            ->whereNull('deleted_at')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['USO_DE_SUELO_APERTURA_ALTO'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])
            ->whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento');
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['USO_DE_SUELO_REFRENDO_BAJO'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])
            ->whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento Sare');
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['USO_DE_SUELO_REFRENDO_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])
                ->whereHas('tramite_padre', function ($tramitePadre) {
                    $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento')
                        ->whereNull('deleted_at');
                })
                ->whereNull('deleted_at')
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRecibidos['MEDIO_AMBIENTE_ALTO'] = Tramite::with('tramitable')
            ->tieneNegocioConImpacto('mediano_alto_impacto')
            ->tieneEntidadRevision($entidadesRevision['MEDIO_AMBIENTE'])
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['SERVICIOS_PUBLICOS_PROPIO'] = Tramite::with('tramitable')
            ->tieneNegocioConNivelRecoleccion('cuenta_propia')
            ->tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['SERVICIOS_PUBLICOS_PRIVADO'] = Tramite::with('tramitable')
            ->tieneNegocioConNivelRecoleccion('servicio_privado')
            ->tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['SERVICIOS_PUBLICOS_RELLENO'] = Tramite::with('tramitable')
            ->tieneNegocioConNivelRecoleccionDiferenteA(['cuenta_propia', 'servicio_privado'])
            ->tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['PROTECCION_CIVIL_BAJO'] = Tramite::with('tramitable')
            ->tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])
            ->tieneNegocioConImpacto('bajo_impacto')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesRecibidos['PROTECCION_CIVIL_ALTO'] = Tramite::with('tramitable')
            ->tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])
            ->tieneNegocioConImpacto('mediano_alto_impacto')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        // array_push($estadisticas, $tramitesRecibidos);

        return response()->json($tramitesRecibidos);
    }

    public function getTramitesConObservacion()
    {
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];

        $tramitesConObservacion = [
            'TIPO' => 'CON OBSERVACIÓN',
            'COMERCIO_BAJO' => 0,
            'COMERCIO_ALTO' => 0,
            'USO_DE_SUELO_APERTURA_BAJO' => 0,
            'USO_DE_SUELO_APERTURA_ALTO' => 0,
            'USO_DE_SUELO_REFRENDO_BAJO' => 0,
            'USO_DE_SUELO_REFRENDO_ALTO' => 0,
            'MEDIO_AMBIENTE_ALTO' => 0,
            'SERVICIOS_PUBLICOS_PROPIO' => 0,
            'SERVICIOS_PUBLICOS_PRIVADO' => 0,
            'SERVICIOS_PUBLICOS_RELLENO' => 0,
            'PROTECCION_CIVIL_BAJO' => 0,
            'PROTECCION_CIVIL_ALTO' => 0,
        ];

        $tramitesConObservacion['COMERCIO_BAJO'] = 'N/A';

        $tramitesConObservacion['COMERCIO_ALTO'] = 'N/A';

        $tramitesConObservacion['USO_DE_SUELO_APERTURA_BAJO'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })
            ->whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento Sare');
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesConObservacion['USO_DE_SUELO_APERTURA_ALTO'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })
            ->whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento');
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesConObservacion['USO_DE_SUELO_REFRENDO_BAJO'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConObservacion['USO_DE_SUELO_REFRENDO_ALTO'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })
            ->whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento');
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesConObservacion['MEDIO_AMBIENTE_ALTO'] = Tramite::with('tramitable')
            ->tieneNegocioConImpacto('mediano_alto_impacto')
            ->tieneEntidadRevision($entidadesRevision['MEDIO_AMBIENTE'])
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesConObservacion['SERVICIOS_PUBLICOS_PROPIO'] = Tramite::with('tramitable')
            ->tieneNegocioConNivelRecoleccion('cuenta_propia')
            ->tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesConObservacion['SERVICIOS_PUBLICOS_PRIVADO'] = Tramite::with('tramitable')
            ->tieneNegocioConNivelRecoleccion('servicio_privado')
            ->tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesConObservacion['SERVICIOS_PUBLICOS_RELLENO'] = Tramite::with('tramitable')
            ->tieneNegocioConNivelRecoleccionDiferenteA(['cuenta_propia', 'servicio_privado'])
            ->tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesConObservacion['PROTECCION_CIVIL_BAJO'] = Tramite::with('tramitable')
            ->tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])
            ->tieneNegocioConImpacto('bajo_impacto')
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesConObservacion['PROTECCION_CIVIL_ALTO'] = Tramite::with('tramitable')
            ->tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])
            ->tieneNegocioConImpacto('mediano_alto_impacto')
            ->tieneObservacion()
            ->whereHas('revisions', function ($revision) {
                $revision->whereNotIn('status', ['RECHAZADO', 'APROBADO', 'VISOR']);
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        return response()->json($tramitesConObservacion);
    }

    public function getTramitesValidados()
    {
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];
        $tramitesValidados = [
            'TIPO' => 'VALIDADOS',
            'COMERCIO_BAJO' => 0,
            'COMERCIO_ALTO' => 0,
            'USO_DE_SUELO_APERTURA_BAJO' => 0,
            'USO_DE_SUELO_APERTURA_ALTO' => 0,
            'USO_DE_SUELO_REFRENDO_BAJO' => 0,
            'USO_DE_SUELO_REFRENDO_ALTO' => 0,
            'MEDIO_AMBIENTE_ALTO' => 0,
            'SERVICIOS_PUBLICOS_PROPIO' => 0,
            'SERVICIOS_PUBLICOS_PRIVADO' => 0,
            'SERVICIOS_PUBLICOS_RELLENO' => 0,
            'PROTECCION_CIVIL_BAJO' => 0,
            'PROTECCION_CIVIL_ALTO' => 0,
        ];

        $tramitesValidados['COMERCIO_BAJO'] = Tramite::whereNull('tramite_padre_id')
            ->tieneNegocioConImpacto('bajo_impacto')
            ->whereHasMorph('tramitable', [Negocio::class], fn ($query) => $query->validado())
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesValidados['COMERCIO_ALTO'] = Tramite::whereNull('tramite_padre_id')->
            tieneNegocioConImpacto('mediano_alto_impacto')
                ->whereHasMorph('tramitable', [Negocio::class], fn ($query) => $query->validado())
                ->with('tramitable')
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['USO_DE_SUELO_APERTURA_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })
                ->whereHas('tramite_padre', function ($tramitePadre) {
                    $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento Sare');
                })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['USO_DE_SUELO_APERTURA_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['USO_DE_SUELO_REFRENDO_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['USO_DE_SUELO_REFRENDO_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['MEDIO_AMBIENTE_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            tieneEntidadRevision($entidadesRevision['MEDIO_AMBIENTE'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['SERVICIOS_PUBLICOS_PROPIO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('cuenta_propia')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['SERVICIOS_PUBLICOS_PRIVADO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('servicio_privado')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['SERVICIOS_PUBLICOS_RELLENO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccionDiferenteA(['cuenta_propia', 'servicio_privado'])->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['PROTECCION_CIVIL_BAJO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('bajo_impacto')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesValidados['PROTECCION_CIVIL_ALTO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'APROBADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        return response()->json($tramitesValidados);
    }

    public function getTramitesRechazados()
    {
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];

        $tramitesRechazados = [
            'TIPO' => 'RECHAZADOS',
            'COMERCIO_BAJO' => 0,
            'COMERCIO_ALTO' => 0,
            'USO_DE_SUELO_APERTURA_BAJO' => 0,
            'USO_DE_SUELO_APERTURA_ALTO' => 0,
            'USO_DE_SUELO_REFRENDO_BAJO' => 0,
            'USO_DE_SUELO_REFRENDO_ALTO' => 0,
            'MEDIO_AMBIENTE_ALTO' => 0,
            'SERVICIOS_PUBLICOS_PROPIO' => 0,
            'SERVICIOS_PUBLICOS_PRIVADO' => 0,
            'SERVICIOS_PUBLICOS_RELLENO' => 0,
            'PROTECCION_CIVIL_BAJO' => 0,
            'PROTECCION_CIVIL_ALTO' => 0,
        ];

        $tramitesRechazados['COMERCIO_BAJO'] = Tramite::whereNull('tramite_padre_id')->
            tieneNegocioConImpacto('bajo_impacto')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })->
            with('tramitable')
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['COMERCIO_ALTO'] = Tramite::whereNull('tramite_padre_id')->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })->
            with('tramitable')
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['USO_DE_SUELO_APERTURA_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['USO_DE_SUELO_APERTURA_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['USO_DE_SUELO_REFRENDO_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['USO_DE_SUELO_REFRENDO_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['MEDIO_AMBIENTE_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            tieneEntidadRevision($entidadesRevision['MEDIO_AMBIENTE'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['SERVICIOS_PUBLICOS_PROPIO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('cuenta_propia')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['SERVICIOS_PUBLICOS_PRIVADO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('servicio_privado')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['SERVICIOS_PUBLICOS_RELLENO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccionDiferenteA(['cuenta_propia', 'servicio_privado'])->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['PROTECCION_CIVIL_BAJO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('bajo_impacto')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesRechazados['PROTECCION_CIVIL_ALTO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        return response()->json($tramitesRechazados);
    }

    public function getTramitesPendientesRevision2()
    {

        $negocios = Negocio::with(['tramites' => function ($tramite) {
            $tramite->select('tramites.id', 'tramites.catalogo_tramites_id', 'tramites.tramite_padre_id')
                ->with([
                    'catalogo_tramites:id,nombre,entidad_revisora_id,pago,resolutivo',
                    'ultima_revision' => function ($revision) {
                        $revision->select('revision.id', 'revision.tramite_id', 'status')->
                            with('estados_revision:estados_revision.id,estados_revision.revision_id,estados_revision.status');
                    },
                ])
                ->has('catalogo_tramites')
                ->has('ultima_revision');
        }])
            ->get();

        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
            'COMERCIO' => 5,
        ];

        $negocios = $negocios->map(function ($negocio) {
            $tramiteComercioPadre = $negocio->tramite_comercio_padre;
            $tramitePadre = $tramiteComercioPadre ? $tramiteComercioPadre->tramites[0] : null;
            $tramitePadreCatalogo = $tramitePadre ? $tramitePadre->catalogo_tramites[0] : null;
            $nombreTramitePadre = $tramitePadreCatalogo ? $tramitePadreCatalogo->nombre : '';
            $tramitePadreId = $tramitePadre ? $tramitePadre->id : null;

            $tramites = $negocio->tramites->map(function ($tramite) {
                $catalogoTramite = $tramite->catalogo_tramites ? $tramite->catalogo_tramites[0] : null;
                $entidadRevisoraId = $catalogoTramite ? $catalogoTramite->entidad_revisora_id : null;
                $revisado = $tramite->ultima_revision->estados_revision->count() > 1;

                $res = new \StdClass();
                $res->entidadRevisoraId = $entidadRevisoraId;
                $res->revisado = $revisado;
                $res->estados_revision = $tramite->ultima_revision->estados_revision;

                return $res;
            });

            $res = new \StdClass();
            $res->negocioId = $negocio->id;
            $res->negocioValidado = $negocio->validado_por != null;
            $res->tramitePadreId = $tramitePadreId;
            $res->nivelRecoleccionBasura = $negocio->nivel_recoleccion_basura;
            $res->nombreTramitePadre = $nombreTramitePadre;
            $res->impacto = $negocio->impacto_giro_comercial;
            $res->tramites = $tramites;

            return $res;
        });

        $tramitesPendientesRevision['COMERCIO_BAJO'] = $negocios->filter(function ($negocio) {
            if ($negocio->impacto != 'bajo_impacto') {
                return false;
            }

            return ! $negocio->negocioValidado;
        })->count();

        return $tramitesPendientesRevision['COMERCIO_BAJO'];

        $tramitesPendientesRevision['COMERCIO_ALTO'] = $negocios->filter(function ($negocio) {
            if ($negocio->impacto != 'mediano_alto_impacto') {
                return false;
            }

            return ! $negocio->negocioValidado;
        })->count();

        $tramitesPendientesRevision['USO_DE_SUELO_APERTURA_BAJO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Licencia de funcionamiento Sare' || ! $negocio->negocioValidado) {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        $tramitesPendientesRevision['USO_DE_SUELO_APERTURA_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Licencia de funcionamiento' || ! $negocio->negocioValidado) {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        $tramitesPendientesRevision['USO_DE_SUELO_REFRENDO_BAJO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Refrendo Licencia de funcionamiento Sare' || ! $negocio->negocioValidado) {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        $tramitesPendientesRevision['USO_DE_SUELO_REFRENDO_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Refrendo Licencia de funcionamiento' || ! $negocio->negocioValidado) {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        $tramitesPendientesRevision['MEDIO_AMBIENTE_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->impacto != 'mediano_alto_impacto') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['MEDIO_AMBIENTE'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        $tramitesPendientesRevision['SERVICIOS_PUBLICOS_PROPIO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nivelRecoleccionBasura != 'cuenta_propia') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['SERVICIOS_PUBLICOS'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        $tramitesPendientesRevision['SERVICIOS_PUBLICOS_PRIVADO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nivelRecoleccionBasura != 'servicio_privado') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['SERVICIOS_PUBLICOS'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        $tramitesPendientesRevision['SERVICIOS_PUBLICOS_RELLENO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if (in_array($negocio->nivelRecoleccionBasura, ['cuenta_propia', 'servicio_privado'])) {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['SERVICIOS_PUBLICOS'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        $tramitesPendientesRevision['PROTECCION_CIVIL_BAJO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->impacto != 'bajo_impacto') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['PROTECCION_CIVIL'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        $tramitesPendientesRevision['PROTECCION_CIVIL_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->impacto != 'mediano_alto_impacto') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['PROTECCION_CIVIL'];
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->revisado;
        })->count();

        return response()->json($tramitesPendientesRevision);
    }

    public function getTramitesPendientesRevision()
    {
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];
        $tramitesPendientesRevision = [
            'TIPO' => 'PENDIENTES DE REVISIÓN',
            'COMERCIO_BAJO' => 0,
            'COMERCIO_ALTO' => 0,
            'USO_DE_SUELO_APERTURA_BAJO' => 0,
            'USO_DE_SUELO_APERTURA_ALTO' => 0,
            'USO_DE_SUELO_REFRENDO_BAJO' => 0,
            'USO_DE_SUELO_REFRENDO_ALTO' => 0,
            'MEDIO_AMBIENTE_ALTO' => 0,
            'SERVICIOS_PUBLICOS_PROPIO' => 0,
            'SERVICIOS_PUBLICOS_PRIVADO' => 0,
            'SERVICIOS_PUBLICOS_RELLENO' => 0,
            'PROTECCION_CIVIL_BAJO' => 0,
            'PROTECCION_CIVIL_ALTO' => 0,
        ];

        $tramitesPendientesRevision['COMERCIO_BAJO'] = Tramite::whereNull('tramite_padre_id')
            ->tieneNegocioConImpacto('bajo_impacto')
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                $query->where('validado_por', 0);
            })
            ->with('tramitable')
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesPendientesRevision['COMERCIO_ALTO'] = Tramite::whereNull('tramite_padre_id')->
            tieneNegocioConImpacto('mediano_alto_impacto')
                ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                    $query->where('validado_por', 0);
                })
                ->with('tramitable')
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesRevision['USO_DE_SUELO_APERTURA_BAJO'] = Tramite::with('tramitable')
            ->tieneNegocioValidado()
            ->tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])
            ->whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', 1);
            })
            ->whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento Sare');
            })
            ->get()
            ->map(fn ($tramite) => $tramite->tramitable->id)
            ->unique()
            ->count();

        $tramitesPendientesRevision['USO_DE_SUELO_APERTURA_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', '=', 1);
            })
                ->whereHas('tramite_padre', function ($tramitePadre) {
                    $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento');
                })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesRevision['USO_DE_SUELO_REFRENDO_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', '=', 1);
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesRevision['USO_DE_SUELO_REFRENDO_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', '=', 1);
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesRevision['MEDIO_AMBIENTE_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            tieneEntidadRevision($entidadesRevision['MEDIO_AMBIENTE'])->
            whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', '=', 1);
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesRevision['SERVICIOS_PUBLICOS_PROPIO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('cuenta_propia')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', '=', 1);
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesRevision['SERVICIOS_PUBLICOS_PRIVADO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('servicio_privado')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', '=', 1);
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesRevision['SERVICIOS_PUBLICOS_RELLENO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccionDiferenteA(['cuenta_propia', 'servicio_privado'])->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', '=', 1);
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesRevision['PROTECCION_CIVIL_BAJO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('bajo_impacto')->
            whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', '=', 1);
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesRevision['PROTECCION_CIVIL_ALTO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            whereHas('revisions', function ($revision) {
                $revision->has('estados_revision', '=', 1);
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        return response()->json($tramitesPendientesRevision);
    }

    public function getTramitesPendientesAvisoDeEntero()
    {
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];
        $tramitesPendientesAvisoEntero = [
            'TIPO' => 'PENDIENTES AVISO DE ENTERO',
            'COMERCIO_BAJO' => 0,
            'COMERCIO_ALTO' => 0,
            'USO_DE_SUELO_APERTURA_BAJO' => 0,
            'USO_DE_SUELO_APERTURA_ALTO' => 0,
            'USO_DE_SUELO_REFRENDO_BAJO' => 0,
            'USO_DE_SUELO_REFRENDO_ALTO' => 0,
            'MEDIO_AMBIENTE_ALTO' => 0,
            'SERVICIOS_PUBLICOS_PROPIO' => 0,
            'SERVICIOS_PUBLICOS_PRIVADO' => 0,
            'SERVICIOS_PUBLICOS_RELLENO' => 0,
            'PROTECCION_CIVIL_BAJO' => 0,
            'PROTECCION_CIVIL_ALTO' => 0,
        ];

        $tramitesPendientesAvisoEntero['COMERCIO_BAJO'] = 'N/A';

        $tramitesPendientesAvisoEntero['COMERCIO_ALTO'] = 'N/A';

        $tramitesPendientesAvisoEntero['USO_DE_SUELO_APERTURA_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesAvisoEntero['USO_DE_SUELO_APERTURA_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesAvisoEntero['USO_DE_SUELO_REFRENDO_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesAvisoEntero['USO_DE_SUELO_REFRENDO_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesAvisoEntero['MEDIO_AMBIENTE_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            tieneEntidadRevision($entidadesRevision['MEDIO_AMBIENTE'])->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesAvisoEntero['SERVICIOS_PUBLICOS_PROPIO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('cuenta_propia')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesAvisoEntero['SERVICIOS_PUBLICOS_PRIVADO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('servicio_privado')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesAvisoEntero['SERVICIOS_PUBLICOS_RELLENO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccionDiferenteA(['cuenta_propia', 'servicio_privado'])->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesAvisoEntero['PROTECCION_CIVIL_BAJO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('bajo_impacto')->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesAvisoEntero['PROTECCION_CIVIL_ALTO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            requierePago()->
            doesntHave('aviso_entero')->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        return response()->json($tramitesPendientesAvisoEntero);
    }

    public function getTramitesPendientesPago()
    {
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];
        $tramitesPendientesPago = [
            'TIPO' => 'PENDIENTES PAGO',
            'COMERCIO_BAJO' => 0,
            'COMERCIO_ALTO' => 0,
            'USO_DE_SUELO_APERTURA_BAJO' => 0,
            'USO_DE_SUELO_APERTURA_ALTO' => 0,
            'USO_DE_SUELO_REFRENDO_BAJO' => 0,
            'USO_DE_SUELO_REFRENDO_ALTO' => 0,
            'MEDIO_AMBIENTE_ALTO' => 0,
            'SERVICIOS_PUBLICOS_PROPIO' => 0,
            'SERVICIOS_PUBLICOS_PRIVADO' => 0,
            'SERVICIOS_PUBLICOS_RELLENO' => 0,
            'PROTECCION_CIVIL_BAJO' => 0,
            'PROTECCION_CIVIL_ALTO' => 0,
        ];

        $tramitesPendientesPago['COMERCIO_BAJO'] = 'N/A';

        $tramitesPendientesPago['COMERCIO_ALTO'] = 'N/A';

        $tramitesPendientesPago['USO_DE_SUELO_APERTURA_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesPago['USO_DE_SUELO_APERTURA_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesPago['USO_DE_SUELO_REFRENDO_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesPago['USO_DE_SUELO_REFRENDO_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesPago['MEDIO_AMBIENTE_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            tieneEntidadRevision($entidadesRevision['MEDIO_AMBIENTE'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesPago['SERVICIOS_PUBLICOS_PROPIO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('cuenta_propia')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesPago['SERVICIOS_PUBLICOS_PRIVADO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('servicio_privado')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesPago['SERVICIOS_PUBLICOS_RELLENO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccionDiferenteA(['cuenta_propia', 'servicio_privado'])->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesPago['PROTECCION_CIVIL_BAJO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('bajo_impacto')->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPendientesPago['PROTECCION_CIVIL_ALTO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'VIGENTE');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        return response()->json($tramitesPendientesPago);
    }

    public function getTramitesPagados()
    {
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];
        $tramitesPagados = [
            'TIPO' => 'PAGADOS',
            'COMERCIO_BAJO' => 0,
            'COMERCIO_ALTO' => 0,
            'USO_DE_SUELO_APERTURA_BAJO' => 0,
            'USO_DE_SUELO_APERTURA_ALTO' => 0,
            'USO_DE_SUELO_REFRENDO_BAJO' => 0,
            'USO_DE_SUELO_REFRENDO_ALTO' => 0,
            'MEDIO_AMBIENTE_ALTO' => 0,
            'SERVICIOS_PUBLICOS_PROPIO' => 0,
            'SERVICIOS_PUBLICOS_PRIVADO' => 0,
            'SERVICIOS_PUBLICOS_RELLENO' => 0,
            'PROTECCION_CIVIL_BAJO' => 0,
            'PROTECCION_CIVIL_ALTO' => 0,
        ];

        $tramitesPagados['COMERCIO_BAJO'] = 'N/A';

        $tramitesPagados['COMERCIO_ALTO'] = 'N/A';

        $tramitesPagados['USO_DE_SUELO_APERTURA_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPagados['USO_DE_SUELO_APERTURA_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPagados['USO_DE_SUELO_REFRENDO_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPagados['USO_DE_SUELO_REFRENDO_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPagados['MEDIO_AMBIENTE_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            tieneEntidadRevision($entidadesRevision['MEDIO_AMBIENTE'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPagados['SERVICIOS_PUBLICOS_PROPIO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('cuenta_propia')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPagados['SERVICIOS_PUBLICOS_PRIVADO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('servicio_privado')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPagados['SERVICIOS_PUBLICOS_RELLENO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccionDiferenteA(['cuenta_propia', 'servicio_privado'])->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPagados['PROTECCION_CIVIL_BAJO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('bajo_impacto')->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesPagados['PROTECCION_CIVIL_ALTO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            requierePago()->
            whereHas('aviso_entero', function ($avisoEntero) {
                $avisoEntero->where('estado', 'PAGADO');
            })->
            whereHas('revisions', function ($revision) {
                $revision->where('status', '<>', 'RECHAZADO');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        return response()->json($tramitesPagados);
    }

    public function getTramitesResolutivoImpreso()
    {
        $negocios = Negocio::select(['id', 'impacto_giro_comercial', 'nivel_recoleccion_basura'])->
            with(['tramites' => function ($tramite) {
                $tramite->
                    select('tramites.id', 'tramitable_id', 'tramitable_type', 'tramites.catalogo_tramites_id', 'tramites.tramite_padre_id')->
                    with([
                        'catalogo_tramites:id,nombre,entidad_revisora_id,pago,resolutivo',
                        'aviso_entero:avisos_entero.tramite_id,estado',
                        'ultima_revision:revision.tramite_id,status',
                    ])->
                    has('catalogo_tramites')->
                    has('ultima_revision');
            }])->
            with(['resolutivos:resolutivos.id,folio,resolutivos.negocio_id,resolutivos.entidad_revisora_id'])->
            get();

        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
            'COMERCIO' => 5,
        ];

        $negocios = $negocios->map(function ($negocio) use ($entidadesRevision) {
            $tramiteComercioPadre = $negocio->tramite_comercio_padre;
            $tramitePadre = $tramiteComercioPadre ? $tramiteComercioPadre->tramites[0] : null;
            $tramitePadreCatalogo = $tramitePadre ? $tramitePadre->catalogo_tramites[0] : null;
            $nombreTramitePadre = $tramitePadreCatalogo ? $tramitePadreCatalogo->nombre : '';
            $tramitePadreId = $tramitePadre ? $tramitePadre->id : null;

            $resolutivos = $negocio->resolutivos;

            $tramites = $negocio->tramites->map(function ($tramite) use ($resolutivos) {
                $catalogoTramite = $tramite->catalogo_tramites ? $tramite->catalogo_tramites[0] : null;
                $entidadRevisoraId = $catalogoTramite ? $catalogoTramite->entidad_revisora_id : null;
                $requierePago = $catalogoTramite ? $catalogoTramite->pago : false;
                $tieneResolutivo = $catalogoTramite ? $catalogoTramite->resolutivo : false;
                $avisoEntero = $tramite->aviso_entero ? $tramite->aviso_entero : null;
                $pagado = $avisoEntero ? $avisoEntero->estado == 'PAGADO' : false;

                $res = new \StdClass();
                $res->aprobado = in_array($tramite->ultima_revision->status, ['APROBADO', 'VISTO BUENO', 'VISOR']);
                $res->entidadRevisoraId = $entidadRevisoraId;
                $res->requierePago = $requierePago;
                $res->pagado = $pagado;
                $res->tieneResolutivo = $tieneResolutivo;
                $res->resolutivoImpreso = $resolutivos->filter(function ($resolutivo) use ($entidadRevisoraId) {
                    return $resolutivo->entidad_revisora_id == $entidadRevisoraId && $resolutivo->folio && $resolutivo->folio != '';
                })->count() >= 1;

                return $res;
            });

            $resolutivoComercioImpreso = $resolutivos->filter(function ($resolutivo) use ($entidadesRevision) {
                return $resolutivo->entidad_revisora_id == $entidadesRevision['COMERCIO'] && $resolutivo->folio && $resolutivo->folio != '';
            })->count() >= 1;

            $res = new \StdClass();
            $res->negocioId = $negocio->id;
            $res->tramitePadreId = $tramitePadreId;
            $res->nivelRecoleccionBasura = $negocio->nivel_recoleccion_basura;
            $res->nombreTramitePadre = $nombreTramitePadre;
            $res->impacto = $negocio->impacto_giro_comercial;
            $res->tramites = $tramites;
            $res->resolutivoComercioImpreso = $resolutivoComercioImpreso;

            return $res;
        });

        $tramitesResolutivoImpreso['COMERCIO_BAJO'] = $negocios->filter(function ($negocio) {
            if ($negocio->impacto != 'bajo_impacto') {
                return false;
            }

            return $negocio->resolutivoComercioImpreso;
        })->count();

        $tramitesResolutivoImpreso['COMERCIO_ALTO'] = $negocios->filter(function ($negocio) {
            if ($negocio->impacto != 'mediano_alto_impacto') {
                return false;
            }

            return $negocio->resolutivoComercioImpreso;
        })->count();

        $tramitesResolutivoImpreso['USO_DE_SUELO_APERTURA_BAJO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Licencia de funcionamiento Sare') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoImpreso['USO_DE_SUELO_APERTURA_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Licencia de funcionamiento') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoImpreso['USO_DE_SUELO_REFRENDO_BAJO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Refrendo Licencia de funcionamiento Sare') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoImpreso['USO_DE_SUELO_REFRENDO_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Refrendo Licencia de funcionamiento') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoImpreso['MEDIO_AMBIENTE_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->impacto != 'mediano_alto_impacto') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['MEDIO_AMBIENTE'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoImpreso['SERVICIOS_PUBLICOS_PROPIO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nivelRecoleccionBasura != 'cuenta_propia') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['SERVICIOS_PUBLICOS'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoImpreso['SERVICIOS_PUBLICOS_PRIVADO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nivelRecoleccionBasura != 'servicio_privado') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['SERVICIOS_PUBLICOS'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoImpreso['SERVICIOS_PUBLICOS_RELLENO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if (in_array($negocio->nivelRecoleccionBasura, ['cuenta_propia', 'servicio_privado'])) {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['SERVICIOS_PUBLICOS'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoImpreso['PROTECCION_CIVIL_BAJO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->impacto != 'bajo_impacto') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['PROTECCION_CIVIL'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoImpreso['PROTECCION_CIVIL_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->impacto != 'mediano_alto_impacto') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['PROTECCION_CIVIL'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return $tramite[0]->resolutivoImpreso;
        })->count();

        return response()->json($tramitesResolutivoImpreso);
    }

    public function getTramitesResolutivoNoImpreso()
    {
        $negocios = Negocio::select(['id', 'impacto_giro_comercial', 'nivel_recoleccion_basura'])
            ->with(['tramites' => function ($tramite) {
                $tramite->select('tramites.id', 'tramitable_id', 'tramitable_type', 'tramites.catalogo_tramites_id', 'tramites.tramite_padre_id')
                    ->with([
                        'catalogo_tramites:id,nombre,entidad_revisora_id,pago,resolutivo',
                        'aviso_entero:avisos_entero.tramite_id,estado',
                        'ultima_revision:revision.tramite_id,status',
                    ])
                    ->has('catalogo_tramites')
                    ->has('ultima_revision');
            }])
            ->with(['resolutivos:resolutivos.id,folio,resolutivos.negocio_id,resolutivos.entidad_revisora_id'])
            ->get();

        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
            'COMERCIO' => 5,
        ];

        $negocios = $negocios->map(function ($negocio) use ($entidadesRevision) {
            $tramiteComercioPadre = $negocio->tramite_comercio_padre;
            $tramitePadre = $tramiteComercioPadre ? $tramiteComercioPadre->tramites[0] : null;
            $tramitePadreCatalogo = $tramitePadre ? $tramitePadre->catalogo_tramites[0] : null;
            $nombreTramitePadre = $tramitePadreCatalogo ? $tramitePadreCatalogo->nombre : '';
            $tramitePadreId = $tramitePadre ? $tramitePadre->id : null;

            $resolutivos = $negocio->resolutivos;

            $tramites = $negocio->tramites->map(function ($tramite) use ($resolutivos) {
                $catalogoTramite = $tramite->catalogo_tramites ? $tramite->catalogo_tramites[0] : null;
                $entidadRevisoraId = $catalogoTramite ? $catalogoTramite->entidad_revisora_id : null;
                $requierePago = $catalogoTramite ? $catalogoTramite->pago : false;
                $tieneResolutivo = $catalogoTramite ? $catalogoTramite->resolutivo : false;
                $avisoEntero = $tramite->aviso_entero ? $tramite->aviso_entero : null;
                $pagado = $avisoEntero ? $avisoEntero->estado == 'PAGADO' : false;

                $res = new \StdClass();
                $res->aprobado = in_array($tramite->ultima_revision->status, ['APROBADO', 'VISTO BUENO', 'VISOR']);
                $res->entidadRevisoraId = $entidadRevisoraId;
                $res->requierePago = $requierePago;
                $res->pagado = $pagado;
                $res->tieneResolutivo = $tieneResolutivo;
                $res->resolutivoImpreso = $resolutivos->filter(function ($resolutivo) use ($entidadRevisoraId) {
                    return $resolutivo->entidad_revisora_id == $entidadRevisoraId && $resolutivo->folio && $resolutivo->folio != '';
                })->count() >= 1;

                return $res;
            });

            $resolutivoComercioImpreso = $resolutivos->filter(function ($resolutivo) use ($entidadesRevision) {
                return $resolutivo->entidad_revisora_id == $entidadesRevision['COMERCIO'] && $resolutivo->folio && $resolutivo->folio != '';
            })->count() >= 1;

            $res = new \StdClass();
            $res->negocioId = $negocio->id;
            $res->tramitePadreId = $tramitePadreId;
            $res->nivelRecoleccionBasura = $negocio->nivel_recoleccion_basura;
            $res->nombreTramitePadre = $nombreTramitePadre;
            $res->impacto = $negocio->impacto_giro_comercial;
            $res->tramites = $tramites;
            $res->resolutivoComercioImpreso = $resolutivoComercioImpreso;

            return $res;
        });

        $tramitesResolutivoNoImpreso['COMERCIO_BAJO'] = $negocios->filter(function ($negocio) {
            if ($negocio->impacto != 'bajo_impacto') {
                return false;
            }

            $tramitesAprobados = $negocio->tramites->filter(function ($tramite) {
                return $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            });

            return $tramitesAprobados->count() >= 4 && ! $negocio->resolutivoComercioImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['COMERCIO_ALTO'] = $negocios->filter(function ($negocio) {
            if ($negocio->impacto != 'mediano_alto_impacto') {
                return false;
            }

            $tramitesAprobados = $negocio->tramites->filter(function ($tramite) {
                return $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado));
            });

            return $tramitesAprobados->count() >= 4 && ! $negocio->resolutivoComercioImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['USO_DE_SUELO_APERTURA_BAJO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Licencia de funcionamiento Sare') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['USO_DE_SUELO_APERTURA_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Licencia de funcionamiento') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['USO_DE_SUELO_REFRENDO_BAJO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Refrendo Licencia de funcionamiento Sare') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['USO_DE_SUELO_REFRENDO_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nombreTramitePadre != 'Refrendo Licencia de funcionamiento') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['USO_DE_SUELO'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['MEDIO_AMBIENTE_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->impacto != 'mediano_alto_impacto') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['MEDIO_AMBIENTE'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['SERVICIOS_PUBLICOS_PROPIO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nivelRecoleccionBasura != 'cuenta_propia') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['SERVICIOS_PUBLICOS'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['SERVICIOS_PUBLICOS_PRIVADO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->nivelRecoleccionBasura != 'servicio_privado') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['SERVICIOS_PUBLICOS'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['SERVICIOS_PUBLICOS_RELLENO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if (in_array($negocio->nivelRecoleccionBasura, ['cuenta_propia', 'servicio_privado'])) {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['SERVICIOS_PUBLICOS'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['PROTECCION_CIVIL_BAJO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->impacto != 'bajo_impacto') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['PROTECCION_CIVIL'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        $tramitesResolutivoNoImpreso['PROTECCION_CIVIL_ALTO'] = $negocios->filter(function ($negocio) use ($entidadesRevision) {
            if ($negocio->impacto != 'mediano_alto_impacto') {
                return false;
            }

            $tramite = $negocio->tramites->filter(function ($tramite) use ($entidadesRevision) {
                return $tramite->entidadRevisoraId == $entidadesRevision['PROTECCION_CIVIL'] &&
                    $tramite->aprobado && (! $tramite->requierePago || ($tramite->requierePago && $tramite->pagado)) &&
                    $tramite->tieneResolutivo;
            })->values();
            if (! $tramite || $tramite->count() == 0) {
                return false;
            }

            return ! $tramite[0]->resolutivoImpreso;
        })->count();

        return response()->json($tramitesResolutivoNoImpreso);
    }

    public function getTramitesConAlcohol()
    {
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];
        $tramitesConAlcohol = [
            'TIPO' => 'CON ALCOHOL',
            'COMERCIO_BAJO' => 0,
            'COMERCIO_ALTO' => 0,
            'USO_DE_SUELO_APERTURA_BAJO' => 0,
            'USO_DE_SUELO_APERTURA_ALTO' => 0,
            'USO_DE_SUELO_REFRENDO_BAJO' => 0,
            'USO_DE_SUELO_REFRENDO_ALTO' => 0,
            'MEDIO_AMBIENTE_ALTO' => 0,
            'SERVICIOS_PUBLICOS_PROPIO' => 0,
            'SERVICIOS_PUBLICOS_PRIVADO' => 0,
            'SERVICIOS_PUBLICOS_RELLENO' => 0,
            'PROTECCION_CIVIL_BAJO' => 0,
            'PROTECCION_CIVIL_ALTO' => 0,
        ];
        $tramitesConAlcohol['COMERCIO_BAJO'] = Tramite::whereNull('tramite_padre_id')->
            tieneNegocioConImpacto('bajo_impacto')->
            tieneNegocioConVentaAlcohol()->
            with('tramitable')
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['COMERCIO_ALTO'] = Tramite::whereNull('tramite_padre_id')->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            tieneNegocioConVentaAlcohol()->
            with('tramitable')
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['USO_DE_SUELO_APERTURA_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            tieneNegocioConVentaAlcohol()->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['USO_DE_SUELO_APERTURA_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            tieneNegocioConVentaAlcohol()->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['USO_DE_SUELO_REFRENDO_BAJO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            tieneNegocioConVentaAlcohol()->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento Sare');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['USO_DE_SUELO_REFRENDO_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioValidado()->
            tieneEntidadRevision($entidadesRevision['USO_DE_SUELO'])->
            tieneNegocioConVentaAlcohol()->
            whereHas('tramite_padre', function ($tramitePadre) {
                $tramitePadre->tieneCatalogoTramiteConNombre('Refrendo Licencia de funcionamiento');
            })
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['MEDIO_AMBIENTE_ALTO'] = Tramite::with('tramitable')->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            tieneEntidadRevision($entidadesRevision['MEDIO_AMBIENTE'])->
            tieneNegocioConVentaAlcohol()
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['SERVICIOS_PUBLICOS_PROPIO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('cuenta_propia')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            tieneNegocioConVentaAlcohol()
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['SERVICIOS_PUBLICOS_PRIVADO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccion('servicio_privado')->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            tieneNegocioConVentaAlcohol()
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['SERVICIOS_PUBLICOS_RELLENO'] = Tramite::with('tramitable')->
            tieneNegocioConNivelRecoleccionDiferenteA(['cuenta_propia', 'servicio_privado'])->
            tieneEntidadRevision($entidadesRevision['SERVICIOS_PUBLICOS'])->
            tieneNegocioConVentaAlcohol()
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['PROTECCION_CIVIL_BAJO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('bajo_impacto')->
            tieneNegocioConVentaAlcohol()
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        $tramitesConAlcohol['PROTECCION_CIVIL_ALTO'] = Tramite::with('tramitable')->
            tieneEntidadRevision($entidadesRevision['PROTECCION_CIVIL'])->
            tieneNegocioConImpacto('mediano_alto_impacto')->
            tieneNegocioConVentaAlcohol()
                ->get()
                ->map(fn ($tramite) => $tramite->tramitable->id)
                ->unique()
                ->count();

        return response()->json($tramitesConAlcohol);
    }
}
