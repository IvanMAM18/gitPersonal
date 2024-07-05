<?php

namespace App\Http\Controllers;

use App\Helpers\EntidadRevisora;
use App\Models\Negocio;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class MapaEntidadRevisoraController extends Controller
{
    public function getAllNegocioPorFiltros(Request $request)
    {
        $impacto_giro_comercial = $request['impacto_giro_comercial'];
        $venta_alcohol = $request['alcohol'];
        $nivel_recoleccion_basura = $request['nivel_recoleccion_basura'];
        $entidad_revision = Auth::user()->entidad_revision->id;
        $nombre_del_negocio = $request['nombre_del_negocio'];
        $negocios = Negocio::select([
            'id',
            'nombre_del_negocio',
            'descripcion_actividad',
            'impacto_giro_comercial',
            'catalogo_tramite_id',
            'persona_id',
            'venta_alcohol',
            'persona_moral_id',
            'nivel_recoleccion_basura',
            'created_at',
            'direccion_id',
            'foto_frontal_fachada',
            'horarios',
            'tarifa_recoleccion_id',
            'telefono',
            'servicio_priv_recoleccion',
        ])
            ->with([
                'direccion' => function ($direccion) {
                    $direccion->select(['id', 'colonia_id', 'calle_principal', 'calles', 'codigo_postal', 'latitud', 'longitude'])
                        ->with(['colonia' => function ($colonia) {
                            $colonia->select('id', 'nombre_localidad');
                        }]);
                }])
            ->with('giro_comercial:giro_comercial.id,nombre,tipo')
            ->with('catalogo_tramite:catalogo_tramites.id,nombre')
            ->with([
                'persona_moral' => function ($persona_moral) {
                    $persona_moral->select(['id', 'razon_social', 'rfc', 'direccion_de_notificacion_id'])
                        ->with([
                            'direccion_notificacion' => function ($direccion_notificacion) {
                                $direccion_notificacion->with(['colonia' => function ($colonia) {
                                    $colonia->select('id', 'nombre_localidad');
                                }]);
                            }]);
                }])
            ->with('persona:id,nombre,apellido_mot,apellido_pat,email,telefono,curp,rfc')
            ->with('user:id,apellido_pat,apellido_mot,nombre,email,telefono')
            ->with('licenciaAlcohol.licencia:id,clave')
            ->with([
                'revisiones' => function ($revisiones) use ($entidad_revision) {
                    $revisiones->select(['revision.id', 'negocio_id', 'status', 'created_at'])
                        ->with('negocio_requisitos_revision', function ($q) {
                            $q->select(['id', 'status', 'revision_id']);
                        })
                        ->where('entidad_revision_id', $entidad_revision)
                        ->deNegocio()
                        ->orderBy('id', 'desc');
                },
            ])
            ->with([
                'tramites' => function ($tramites) use ($entidad_revision) {
                    $tramites->select(['tramites.id', 'tramitable_id', 'tramitable_type', 'catalogo_tramites_id'])
                        ->with('aviso_entero:avisos_entero.tramite_id,estado')
                        ->with('catalogo_tramites:catalogo_tramites.id,nombre,pago')
                        ->tieneEntidadRevision($entidad_revision)
                        ->orderBy('id', 'asc');
                },
            ])

            ->with('tramite_padre', function ($tramite_padre) use ($year){
                $tramite_padre->whereYear('created_at', $year);
            })
            ->with('resolutivos', function ($resolutivo) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])->where('entidad_revisora_id', 5);
            })
            ->whereHas('revisiones', function (Builder $revisiones) use ($entidad_revision) {
                $revisiones
                    ->where('entidad_revision_id', '=', $entidad_revision)
                    ->deNegocio();
            })
            ->when($impacto_giro_comercial, function ($query) use ($impacto_giro_comercial) {
                $query->where('impacto_giro_comercial', $impacto_giro_comercial);
            })
            ->when($venta_alcohol === true || $venta_alcohol === false, function ($query) use ($venta_alcohol) {
                $query->where('venta_alcohol', $venta_alcohol);
            })
            ->when($nivel_recoleccion_basura, function ($query) use ($nivel_recoleccion_basura) {
                $query->where('nivel_recoleccion_basura', $nivel_recoleccion_basura);
            })
            ->when($nombre_del_negocio, function ($query) use ($nombre_del_negocio) {
                $query->where('nombre_del_negocio', 'iLike', "%$nombre_del_negocio%");
            })
            ->validado()
            ->orderBy('id', 'asc')
            ->get();

        return $negocios;
    }

    public function getAllNegocioPorFiltrosOpt(Request $request)
    {
        $impacto_giro_comercial = $request['impacto_giro_comercial'];
        $venta_alcohol = $request['alcohol'];
        $nivel_recoleccion_basura = $request['nivel_recoleccion_basura'];
        $entidad_revision = Auth::user()->entidad_revision->id;
        $nombre_del_negocio = $request['nombre_del_negocio'];
        $estado_aviso_entero = $request['estado_aviso_entero'];
        $year = $request['year'];
        // dd($year);
        //dd($estado_aviso_entero);

        $negocios = Negocio::select([
            'id',
            'direccion_id',
            'nombre_del_negocio',
            'venta_alcohol',
        ])
            ->with([
                'direccion' => function ($direccion) {
                    $direccion->select(['id', 'colonia_id', 'calle_principal', 'calles', 'codigo_postal', 'latitud', 'longitude'])
                        ->with(['colonia' => function ($colonia) {
                            $colonia->select('id', 'nombre_localidad');
                        }]);
                }])
            ->with('giro_comercial:giro_comercial.id,nombre,tipo')
            ->with('catalogo_tramite:catalogo_tramite.id,nombre')
            ->with('licenciaAlcohol.licencia:id,clave')
            ->with([
                'revisiones' => function ($revisiones) use ($entidad_revision) {
                    $revisiones->select(['revision.id', 'negocio_id', 'status', 'created_at'])
                        ->with('negocio_requisitos_revision', function ($q) {
                            $q->select(['id', 'status', 'revision_id']);
                        })
                        ->where('entidad_revision_id', $entidad_revision)
                        ->deNegocio()
                        ->orderBy('id', 'desc');
                },
            ])
            ->with([
                'tramites' => function ($tramites) use ($entidad_revision, $estado_aviso_entero, $year) {
                    $tramites->select(['tramites.id', 'tramitable_id', 'tramitable_type', 'catalogo_tramites_id', 'created_at'])
                        ->with('aviso_entero:avisos_entero.tramite_id,estado')
                        ->tieneEntidadRevision($entidad_revision)
                        ->whereYear('created_at', $year)                      
                        ->orderBy('id', 'asc');
                },
            ])
            ->with('tramite_padre', function ($tramite_padre) use ($year){
                $tramite_padre->whereYear('created_at', $year);
            })
            ->with('resolutivos', function ($resolutivo) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])->where('entidad_revisora_id', 5);
            })
            
            ->whereHas('revisiones', function (Builder $revisiones) use ($entidad_revision) {
                $revisiones
                    ->where('entidad_revision_id', '=', $entidad_revision)
                    ->deNegocio();
            })
            ->when($impacto_giro_comercial, function ($query) use ($impacto_giro_comercial) {
                $query->where('impacto_giro_comercial', $impacto_giro_comercial);
            })
            ->when($venta_alcohol === true || $venta_alcohol === false, function ($query) use ($venta_alcohol) {
                $query->where('venta_alcohol', $venta_alcohol);
            })
            ->when($nivel_recoleccion_basura, function ($query) use ($nivel_recoleccion_basura) {
                $query->where('nivel_recoleccion_basura', $nivel_recoleccion_basura);
            })
            ->when($nombre_del_negocio, function ($query) use ($nombre_del_negocio) {
                $query->where('nombre_del_negocio', 'iLike', "%$nombre_del_negocio%");
            })

            ->whereHas('tramites', function ($query) use ($estado_aviso_entero, $entidad_revision, $year) {
                $query->whereYear('created_at', $year)
                    ->when(($estado_aviso_entero !== "PENDIENTE" && $estado_aviso_entero !== "N/A" && $estado_aviso_entero !== null), function ($q) use ($entidad_revision, $estado_aviso_entero){

                        $q->whereHas('catalogo_tramite', function (Builder $catalogo_tramite) use ($entidad_revision) {
                            $catalogo_tramite->where('pago', true)->where('entidad_revisora_id', $entidad_revision);
                        })
                        ->whereHas('aviso_entero', function ($aviso_entero) use ($estado_aviso_entero) {
                            $aviso_entero->where('estado', $estado_aviso_entero);
                        });
                    })
                    ->when($estado_aviso_entero == "PENDIENTE", function ($q) use ($entidad_revision) {
                        $q->whereHas('catalogo_tramite', function (Builder $catalogo_tramite) use ($entidad_revision) {
                            $catalogo_tramite->where('pago', true)->where('entidad_revisora_id', $entidad_revision);
                        });
                    })
                    ->when($estado_aviso_entero == "N/A", function ($q) use ($entidad_revision) {
                        $q->whereHas('catalogo_tramite', function (Builder $catalogo_tramite) use ($entidad_revision) {
                            $catalogo_tramite->where('pago', false)->where('entidad_revisora_id', $entidad_revision);
                        });
                    });
            })
            ->validado()
            ->orderBy('id', 'asc')
            ->get();

        return $negocios;
    }

    public function getAllNegocioPorFiltrosById($negocio_id, Request $request)
    {
        $impacto_giro_comercial = $request['impacto_giro_comercial'];
        $venta_alcohol = $request['alcohol'];
        $nivel_recoleccion_basura = $request['nivel_recoleccion_basura'];
        $entidad_revision = Auth::user()->entidad_revision->id;
        $nombre_del_negocio = $request['nombre_del_negocio'];
        $estado_aviso_entero = $request['estado_aviso_entero'];
        $year = $request['year'];
        
        $negocios = Negocio::select([
            'id',
            'nombre_del_negocio',
            'descripcion_actividad',
            'impacto_giro_comercial',
            'catalogo_tramite_id',
            'persona_id',
            'venta_alcohol',
            'persona_moral_id',
            'nivel_recoleccion_basura',
            'created_at',
            'direccion_id',
            'foto_frontal_fachada',
            'horarios',
            'tarifa_recoleccion_id',
            'telefono',
            'servicio_priv_recoleccion',
        ])
            ->with([
                'direccion' => function ($direccion) {
                    $direccion->select(['id', 'colonia_id', 'calle_principal', 'calles', 'codigo_postal', 'latitud', 'longitude'])
                        ->with(['colonia' => function ($colonia) {
                            $colonia->select('id', 'nombre_localidad');
                        }]);
                }])
            ->with('giro_comercial:giro_comercial.id,nombre,tipo')
            ->with('catalogo_tramite:catalogo_tramites.id,nombre,entidad_revisora_id,pago')
            ->with([
                'persona_moral' => function ($persona_moral) {
                    $persona_moral->select(['id', 'razon_social', 'rfc', 'direccion_de_notificacion_id'])
                        ->with([
                            'direccion_notificacion' => function ($direccion_notificacion) {
                                $direccion_notificacion->with(['colonia' => function ($colonia) {
                                    $colonia->select('id', 'nombre_localidad');
                                }]);
                            }]);
                }])
            ->with('persona:id,nombre,apellido_mot,apellido_pat,email,telefono,curp,rfc')
            ->with('user:id,apellido_pat,apellido_mot,nombre,email,telefono')
            ->with('licenciaAlcohol.licencia:id,clave')
            ->with([
                'revisiones' => function ($revisiones) use ($entidad_revision) {
                    $revisiones->select(['revision.id', 'negocio_id', 'status', 'created_at'])
                        ->with('negocio_requisitos_revision', function ($q) {
                            $q->select(['id', 'status', 'revision_id']);
                        })
                        ->where('entidad_revision_id', $entidad_revision)
                        ->deNegocio()
                        ->orderBy('id', 'desc');
                },
            ])
            ->with([
                'tramites' => function ($tramites) use ($entidad_revision, $estado_aviso_entero, $year) {
                    $tramites->select(['tramites.id', 'tramitable_id', 'tramitable_type', 'catalogo_tramites_id', 'tramites.created_at'])
                        ->with('aviso_entero:avisos_entero.tramite_id,estado')
                        ->tieneEntidadRevision($entidad_revision)
                        ->whereYear('created_at', $year)                      
                        ->orderBy('id', 'asc');
                },
            ])

            ->with('tramite_padre', function ($tramite_padre) use ($year){
                $tramite_padre->whereYear('created_at', $year);
            })
            ->with('resolutivos', function ($resolutivo) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])->where('entidad_revisora_id', 5);
            })
            ->whereHas('revisiones', function (Builder $revisiones) use ($entidad_revision) {
                $revisiones
                    ->where('entidad_revision_id', '=', $entidad_revision)
                    ->deNegocio();
            })
            ->when($impacto_giro_comercial, function ($query) use ($impacto_giro_comercial) {
                $query->where('impacto_giro_comercial', $impacto_giro_comercial);
            })
            ->when($venta_alcohol === true || $venta_alcohol === false, function ($query) use ($venta_alcohol) {
                $query->where('venta_alcohol', $venta_alcohol);
            })
            ->when($nivel_recoleccion_basura, function ($query) use ($nivel_recoleccion_basura) {
                $query->where('nivel_recoleccion_basura', $nivel_recoleccion_basura);
            })
            ->when($nombre_del_negocio, function ($query) use ($nombre_del_negocio) {
                $query->where('nombre_del_negocio', 'iLike', "%$nombre_del_negocio%");
            })
            ->whereHas('tramites', function ($query) use ($estado_aviso_entero, $entidad_revision, $year) {
                $query->whereYear('created_at', $year)
                
                    
                    ->when(($estado_aviso_entero !== "PENDIENTE" && $estado_aviso_entero !== "N/A" && $estado_aviso_entero != null), function ($q) use ($entidad_revision, $estado_aviso_entero){
                        // Condiciones para cuando el estado no es ni "PENDIENTE" ni "N/A"

                        $q->whereHas('catalogo_tramite', function (Builder $catalogo_tramite) use ($entidad_revision) {
                            $catalogo_tramite->where('pago', true)->where('entidad_revisora_id', $entidad_revision);
                        })
                        ->whereHas('aviso_entero', function ($aviso_entero) use ($estado_aviso_entero) {
                            $aviso_entero->where('estado', $estado_aviso_entero);
                        });
                    })
                    ->when($estado_aviso_entero == "PENDIENTE", function ($q) use ($entidad_revision) {
                        $q->whereHas('catalogo_tramite', function (Builder $catalogo_tramite) use ($entidad_revision) {
                            $catalogo_tramite->where('pago', true)->where('entidad_revisora_id', $entidad_revision);
                        });
                    })
                    ->when($estado_aviso_entero == "N/A", function ($q) use ($entidad_revision) {
                        $q->whereHas('catalogo_tramite', function (Builder $catalogo_tramite) use ($entidad_revision) {
                            $catalogo_tramite->where('pago', false)->where('entidad_revisora_id', $entidad_revision);
                        });
                    });
            })
            ->where('id', $negocio_id)
            ->validado()
            ->orderBy('id', 'asc')
            ->get();

        return $negocios;
    }

    public function getAllNegocioPorFiltrosAPI(Request $request)
    {

        try {
            ini_set('max_execution_time', 300);
            ini_set('memory_limit', '512M');

            /**
             * TAMAÑO DE EMPRESA
             * Estatus de la licencia
             * Numero de licenciua de funcionamiento
             */

            $impacto_giro_comercial = $request['impacto_giro_comercial'];
            $venta_alcohol = $request['alcohol'];
            $nombre_del_negocio = $request['nombre_del_negocio'];
            $year = $request['year'];
            $giros_comerciales = $request['giros_comerciales'];

            $cacheKey = "getAllNegocioPorFiltrosAPI?year={$year}";
            $cacheKey.="&nombre_del_negocio={$nombre_del_negocio}";
            $cacheKey.="&venta_alcohol={$venta_alcohol}&impacto_giro_comercial={$impacto_giro_comercial}";

            $fechaActual = Carbon::now()->format('Y-m-d H:i:s');
            $currentYear = Carbon::now()->year;

            
            // if ($giros_comerciales != null) {
            //     dd($giros_comerciales);
            //     $giros_comerciales_nombres = implode(',', $giros_comerciales);
            //     $cacheKey.="&giros_comerciales={$giros_comerciales_nombres}";
            // }

            // if (Cache::has($cacheKey)) {
            //     //echo("SI HAY CACHE KEY");
            //     return Cache::get($cacheKey);
            // }
            //dd($estado_aviso_entero);
            $negocios = Negocio::select([
                'id',
                'nombre_del_negocio',
                'descripcion_actividad',
                'impacto_giro_comercial',
                'venta_alcohol',
                'direccion_id',
                'foto_frontal_fachada',
                'tamano_empresa'
            ])
                ->with([
                    'direccion' => function ($direccion) {
                        $direccion->select(['id', 'colonia_id', 'calle_principal', 'calles', 'codigo_postal', 'latitud', 'longitude'])
                            ->with(['colonia' => function ($colonia) {
                                $colonia->select('id', 'nombre_localidad');
                            }]);
                    }])
                ->with('giro_comercial:giro_comercial.id,nombre,tipo')
                ->with('licenciaAlcohol.licencia:id,clave')
                ->with([
                    'resolutivos' => function ($resolutivos) use ($currentYear, $year, $fechaActual){
                        if ($currentYear == $year) {
                            $resolutivos->whereBetween('fecha_expedicion', ["{$currentYear}-01-01 00:00:00", $fechaActual]);
                        }
                        else {
                            $resolutivos->whereBetween('fecha_expedicion', ["{$year}-01-01 00:00:00", "{$year}-12-31 11:59:59"]);
                        }
                    }])
                    ->when($venta_alcohol === true || $venta_alcohol === false, function ($query) use ($venta_alcohol) {
                        $query->where('venta_alcohol', $venta_alcohol);
                    })
                    ->when($nombre_del_negocio, function ($query) use ($nombre_del_negocio) {
                        $query->where('nombre_del_negocio', 'iLike', "%$nombre_del_negocio%");
                    })
                    ->when($giros_comerciales, function ($query) use ($giros_comerciales) {
                        $query->whereHas('giro_comercial', function ($query) use ($giros_comerciales) {
                            $query->whereIn('nombre', $giros_comerciales);
                        });
                    })
                ->whereHas('tramites', function ($query) use ($year) {
                    $query->whereYear('created_at', $year);
                })
                //->estadoResolutivo()
                ->validado()
                ->orderBy('id', 'asc')
                ->get();

                // Cache::put($cacheKey, $negocios, now()->addMinutes(15));
            return $negocios;
        } catch (\Throwable $th) {
            return [
                'ok' => false,
                'error' => $th->getMessage(),
            ];
        }

        
    }

    public function getAllNegocioPorFiltrosComercioAdmin(Request $request)
    {


        $impacto_giro_comercial = $request['impacto_giro_comercial'];
        $venta_alcohol = $request['alcohol'];
        $nivel_recoleccion_basura = $request['nivel_recoleccion_basura'];
        $entidad_revision = Auth::user()->entidad_revision->id;
        $nombre_del_negocio = $request['nombre_del_negocio'];
        $estado_aviso_entero = $request['estado_aviso_entero'];
        $year = $request['year'];

        $cacheKey = "getAllNegocioPorFiltrosComercioAdmin?year={$year}&estado_aviso_entero={$estado_aviso_entero}";
        $cacheKey.="&nombre_del_negocio={$nombre_del_negocio}&nivel_recoleccion_basura={$nivel_recoleccion_basura}";
        $cacheKey.="&venta_alcohol={$venta_alcohol}&impacto_giro_comercial={$impacto_giro_comercial}%entidad_revision={$entidad_revision}";

        //dd($estado_aviso_entero);
        $negocios = Negocio::select([
            'id',
            'nombre_del_negocio',
            'descripcion_actividad',
            'impacto_giro_comercial',
            'catalogo_tramite_id',
            'persona_id',
            'venta_alcohol',
            'persona_moral_id',
            'nivel_recoleccion_basura',
            'created_at',
            'direccion_id',
            'foto_frontal_fachada',
            'horarios',
            'tarifa_recoleccion_id',
            'telefono',
            'servicio_priv_recoleccion',
        ])
            ->with([
                'direccion' => function ($direccion) {
                    $direccion->select(['id', 'colonia_id', 'calle_principal', 'calles', 'codigo_postal', 'latitud', 'longitude'])
                        ->with(['colonia' => function ($colonia) {
                            $colonia->select('id', 'nombre_localidad');
                        }]);
                }])
            ->with('giro_comercial:giro_comercial.id,nombre,tipo')
            ->with('catalogo_tramite:catalogo_tramites.id,nombre')
            ->with([
                'persona_moral' => function ($persona_moral) {
                    $persona_moral->select(['id', 'razon_social', 'rfc', 'direccion_de_notificacion_id'])
                        ->with([
                            'direccion_notificacion' => function ($direccion_notificacion) {
                                $direccion_notificacion->with(['colonia' => function ($colonia) {
                                    $colonia->select('id', 'nombre_localidad');
                                }]);
                            }]);
                }])
            ->with('persona:id,nombre,apellido_mot,apellido_pat,email,telefono,curp,rfc')
            ->with('user:id,apellido_pat,apellido_mot,nombre,email,telefono')
            ->with('licenciaAlcohol.licencia:id,clave')
            ->with([
                'revisiones' => function ($revision) {
                    $revision->select('revision.id', 'revision.negocio_id', 'revision.entidad_revision_id', 'revision.tramite_id', 'revision.status')->
                        with('entidad:entidad_revision.id,entidad_revision.nombre');
                },
            ])
            ->with([
                'tramites' => function ($tramite) {
                    $tramite->
                        select('tramites.id', 'tramites.catalogo_tramites_id')->
                        with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre,catalogo_tramites.entidad_revisora_id,catalogo_tramites.pago',
                            'aviso_entero:avisos_entero.id,avisos_entero.tramite_id,avisos_entero.estado',
                        ]);
                },
            ])
            ->with('tramite_padre', function ($tramite_padre) use ($year){
                $tramite_padre->whereYear('created_at', $year);
            })
            ->with('resolutivos', function ($resolutivo) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])->where('entidad_revisora_id', 5);
            })
            ->when($impacto_giro_comercial, function ($query) use ($impacto_giro_comercial) {
                $query->where('impacto_giro_comercial', $impacto_giro_comercial);
            })
            ->when($venta_alcohol === true || $venta_alcohol === false, function ($query) use ($venta_alcohol) {
                $query->where('venta_alcohol', $venta_alcohol);
            })
            ->when($nivel_recoleccion_basura, function ($query) use ($nivel_recoleccion_basura) {
                $query->where('nivel_recoleccion_basura', $nivel_recoleccion_basura);
            })
            ->when($nombre_del_negocio, function ($query) use ($nombre_del_negocio) {
                $query->where('nombre_del_negocio', 'iLike', "%$nombre_del_negocio%");
            })
            ->whereHas('tramites', function ($query) use ($estado_aviso_entero, $entidad_revision, $year) {
                $query->whereYear('created_at', $year)
                
                    ->when(($estado_aviso_entero 
                    && $estado_aviso_entero !== "PENDIENTE" 
                    && $estado_aviso_entero !== "N/A" 
                    && $estado_aviso_entero != null), function ($q) use ($entidad_revision, $estado_aviso_entero){

                        $q->whereHas('catalogo_tramite', function (Builder $catalogo_tramite) use ($entidad_revision) {
                            $catalogo_tramite->where('pago', true);
                        })
                        ->whereHas('aviso_entero', function ($aviso_entero) use ($estado_aviso_entero) {
                            $aviso_entero->where('estado', $estado_aviso_entero);
                        });
                    })
                    ->when($estado_aviso_entero == "PENDIENTE", function ($q) use ($entidad_revision) {
                        $q->whereHas('catalogo_tramite', function (Builder $catalogo_tramite) use ($entidad_revision) {
                            $catalogo_tramite->where('pago', true);
                        });
                    })
                    ->when($estado_aviso_entero == "N/A", function ($q) use ($entidad_revision) {
                        $q->whereHas('catalogo_tramite', function (Builder $catalogo_tramite) use ($entidad_revision) {
                            $catalogo_tramite->where('pago', false);
                        });
                    });
            })
            ->validado()
            ->orderBy('id', 'asc')
            ->get();

        return $negocios;
    }

    public function getAllNegocioPorFiltrosOptComercioAdmin(Request $request)
    {
        $impacto_giro_comercial = $request['impacto_giro_comercial'];
        $venta_alcohol = $request['alcohol'];
        $nivel_recoleccion_basura = $request['nivel_recoleccion_basura'];
        $entidad_revision = Auth::user()->entidad_revision->id;
        $nombre_del_negocio = $request['nombre_del_negocio'];
        $negocios = Negocio::select([
            'id',
            'direccion_id',
            'nombre_del_negocio',
            'venta_alcohol',
        ])
            //->with('direccion')
            ->with([
                'direccion' => function ($direccion) {
                    $direccion->select(['id', 'colonia_id', 'calle_principal', 'calles', 'codigo_postal', 'latitud', 'longitude'])
                        ->with(['colonia' => function ($colonia) {
                            $colonia->select('id', 'nombre_localidad');
                        }]);
                }])
            ->with('giro_comercial:giro_comercial.id,nombre,tipo')
            ->with('catalogo_tramite:catalogo_tramites.id,nombre')
            ->with('licenciaAlcohol.licencia:id,clave')
            ->with([
                'revisiones' => function ($revision) {
                    $revision->select('revision.id', 'revision.negocio_id', 'revision.entidad_revision_id', 'revision.tramite_id', 'revision.status')->
                        with('entidad:entidad_revision.id,entidad_revision.nombre');
                },
            ])
            ->with([
                'tramites' => function ($tramite) {
                    $tramite->
                        select('tramites.id', 'tramites.catalogo_tramites_id')->
                        with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre,catalogo_tramites.entidad_revisora_id,catalogo_tramites.pago',
                            'aviso_entero:avisos_entero.id,avisos_entero.tramite_id,avisos_entero.estado',
                        ]);
                },
            ])
            ->with('tramite_padre', function ($tramite_padre) use ($year){
                $tramite_padre->whereYear('created_at', $year);
            })
            ->with('resolutivos', function ($resolutivo) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])->where('entidad_revisora_id', 5);
            })
            ->when($impacto_giro_comercial, function ($query) use ($impacto_giro_comercial) {
                $query->where('impacto_giro_comercial', $impacto_giro_comercial);
            })
            ->when($venta_alcohol === true || $venta_alcohol === false, function ($query) use ($venta_alcohol) {
                $query->where('venta_alcohol', $venta_alcohol);
            })
            ->when($nivel_recoleccion_basura, function ($query) use ($nivel_recoleccion_basura) {
                $query->where('nivel_recoleccion_basura', $nivel_recoleccion_basura);
            })
            ->when($nombre_del_negocio, function ($query) use ($nombre_del_negocio) {
                $query->where('nombre_del_negocio', 'iLike', "%$nombre_del_negocio%");
            })
            ->validado()
            ->orderBy('id', 'asc')
            ->get();

        return $negocios;
    }

    public function getAllNegocioPorFiltrosIdApi($negocio_id, Request $request)
    {
        ini_set('max_execution_time', 300);
            ini_set('memory_limit', '512M');
        try {
            $year = $request['year'];
            $fechaActual = Carbon::now()->format('Y-m-d H:i:s');
            $currentYear = Carbon::now()->year;

            $negocios = Negocio::select([
                'id',
                'nombre_del_negocio',
                'descripcion_actividad',
                'impacto_giro_comercial',
                'venta_alcohol',
                'direccion_id',
                'foto_frontal_fachada',
                'tamano_empresa'
            ])
                ->with([
                    'direccion' => function ($direccion) {
                        $direccion->select(['id', 'colonia_id', 'calle_principal', 'calles', 'codigo_postal', 'latitud', 'longitude'])
                            ->with(['colonia' => function ($colonia) {
                                $colonia->select('id', 'nombre_localidad');
                            }]);
                    }])
                ->with('giro_comercial:giro_comercial.id,nombre,tipo')
                ->with('catalogo_tramite:catalogo_tramites.id,nombre')
                ->with('licenciaAlcohol.licencia:id,clave')
                ->with('tramite_padre', function ($tramite_padre) use ($year){
                    $tramite_padre->whereYear('created_at', $year);
                })
                ->with([
                    'resolutivos' => function ($resolutivos) use ($currentYear, $year, $fechaActual){
                        if ($currentYear == $year) {
                            //dd("resolutivos year true");
                            $resolutivos->whereBetween('fecha_expedicion', ["{$currentYear}-01-01 00:00:00", $fechaActual]);
                        }
                        else {
                            //dd("resolutivos year false");
                            $resolutivos->whereBetween('fecha_expedicion', ["{$year}-01-01 00:00:00", "{$year}-12-31 11:59:59"]);
                        }
                    }])

                // ->with('resolutivos', function ($resolutivo) {
                //     $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])->where('entidad_revisora_id', 5);
                // })
                ->where('id', $negocio_id)
                ->validado()
                ->orderBy('id', 'asc')
                ->get();

            return $negocios;
        } catch (\Throwable $th) {
            return [
                'ok' => false,
                'error' => $th->getMessage(),
            ];
        }
        
    }

    public function getAllNegocioPorFiltrosIdComercioAdmin($negocio_id, Request $request)
    {
        $impacto_giro_comercial = $request['impacto_giro_comercial'];
        $venta_alcohol = $request['alcohol'];
        $nivel_recoleccion_basura = $request['nivel_recoleccion_basura'];
        $entidad_revision = Auth::user()->entidad_revision->id;
        $nombre_del_negocio = $request['nombre_del_negocio'];
        $year = $request['year'];
        $negocios = Negocio::select([
            'id',
            'nombre_del_negocio',
            'descripcion_actividad',
            'impacto_giro_comercial',
            'catalogo_tramite_id',
            'persona_id',
            'venta_alcohol',
            'persona_moral_id',
            'nivel_recoleccion_basura',
            'created_at',
            'direccion_id',
            'foto_frontal_fachada',
            'horarios',
            'tarifa_recoleccion_id',
            'telefono',
            'servicio_priv_recoleccion',
        ])
            ->with([
                'direccion' => function ($direccion) {
                    $direccion->select(['id', 'colonia_id', 'calle_principal', 'calles', 'codigo_postal', 'latitud', 'longitude'])
                        ->with(['colonia' => function ($colonia) {
                            $colonia->select('id', 'nombre_localidad');
                        }]);
                }])
            ->with('giro_comercial:giro_comercial.id,nombre,tipo')
            ->with('catalogo_tramite:catalogo_tramites.id,nombre')
            ->with([
                'persona_moral' => function ($persona_moral) {
                    $persona_moral->select(['id', 'razon_social', 'rfc', 'direccion_de_notificacion_id'])
                        ->with([
                            'direccion_notificacion' => function ($direccion_notificacion) {
                                $direccion_notificacion->with(['colonia' => function ($colonia) {
                                    $colonia->select('id', 'nombre_localidad');
                                }]);
                            }]);
                }])
            ->with('persona:id,nombre,apellido_mot,apellido_pat,email,telefono,curp,rfc')
            ->with('user:id,apellido_pat,apellido_mot,nombre,email,telefono')
            ->with('licenciaAlcohol.licencia:id,clave')
            ->with([
                'revisiones' => function ($revision) {
                    $revision->select('revision.id', 'revision.negocio_id', 'revision.entidad_revision_id', 'revision.tramite_id', 'revision.status')->
                        with('entidad:entidad_revision.id,entidad_revision.nombre');
                },
            ])
            ->with([
                'tramites' => function ($tramite) {
                    $tramite->
                        select('tramites.id', 'tramites.catalogo_tramites_id')->
                        with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre,catalogo_tramites.entidad_revisora_id,catalogo_tramites.pago',
                            'aviso_entero:avisos_entero.id,avisos_entero.tramite_id,avisos_entero.estado',
                        ]);
                },
            ])
            ->with('tramite_padre', function ($tramite_padre) use ($year){
                $tramite_padre->whereYear('created_at', $year);
            })

            ->with('resolutivos', function ($resolutivo) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])->where('entidad_revisora_id', 5);
            })
            ->when($impacto_giro_comercial, function ($query) use ($impacto_giro_comercial) {
                $query->where('impacto_giro_comercial', $impacto_giro_comercial);
            })
            ->when($venta_alcohol === true || $venta_alcohol === false, function ($query) use ($venta_alcohol) {
                $query->where('venta_alcohol', $venta_alcohol);
            })
            ->when($nivel_recoleccion_basura, function ($query) use ($nivel_recoleccion_basura) {
                $query->where('nivel_recoleccion_basura', $nivel_recoleccion_basura);
            })
            ->when($nombre_del_negocio, function ($query) use ($nombre_del_negocio) {
                $query->where('nombre_del_negocio', 'iLike', "%$nombre_del_negocio%");
            })
            ->where('id', $negocio_id)
            ->validado()
            ->orderBy('id', 'asc')
            ->get();

        return $negocios;
    }

    public function getAllNegocioPorFiltrosOptPublico(Request $request)
    {
        $impacto_giro_comercial = $request['impacto_giro_comercial'];
        $venta_alcohol = $request['alcohol'];
        $nivel_recoleccion_basura = $request['nivel_recoleccion_basura'];
        $entidad_revision = Auth::user()->entidad_revision->id;
        $nombre_del_negocio = $request['nombre_del_negocio'];
        $negocios = Negocio::select([
            'id',
            'direccion_id',
            'nombre_del_negocio',
            'venta_alcohol',
        ])
            ->with([
                'direccion' => function ($direccion) {
                    $direccion->select(['id', 'colonia_id', 'calle_principal', 'calles', 'codigo_postal', 'latitud', 'longitude'])
                        ->with(['colonia' => function ($colonia) {
                            $colonia->select('id', 'nombre_localidad');
                        }]);
                }])
            ->with('giro_comercial:giro_comercial.id,nombre,tipo')
            ->with('catalogo_tramite:catalogo_tramites.id,nombre')
            ->with('licenciaAlcohol.licencia:id,clave')
            ->with([
                'revisiones' => function ($revision) {
                    $revision->select('revision.id', 'revision.negocio_id', 'revision.entidad_revision_id', 'revision.tramite_id', 'revision.status')->
                        with('entidad:entidad_revision.id,entidad_revision.nombre');
                },
            ])
            ->with([
                'tramites' => function ($tramite) {
                    $tramite->select('tramites.id', 'tramitable_id', 'tramitable_type', 'tramites.catalogo_tramites_id')
                        ->with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre,catalogo_tramites.entidad_revisora_id,catalogo_tramites.pago',
                            'aviso_entero:avisos_entero.id,avisos_entero.tramite_id,avisos_entero.estado',
                        ]);
                },
            ])
            ->with('tramite_padre')
            ->with('resolutivos', function ($resolutivo) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])
                    ->where('entidad_revisora_id', EntidadRevisora::$COMERCIO); // Un ejemplo como se debe de manejar en estos casos.
            })
            ->when($impacto_giro_comercial, function ($query) use ($impacto_giro_comercial) {
                $query->where('impacto_giro_comercial', $impacto_giro_comercial);
            })
            ->when($venta_alcohol === true || $venta_alcohol === false, function ($query) use ($venta_alcohol) {
                $query->where('venta_alcohol', $venta_alcohol);
            })
            ->when($nivel_recoleccion_basura, function ($query) use ($nivel_recoleccion_basura) {
                $query->where('nivel_recoleccion_basura', $nivel_recoleccion_basura);
            })
            ->when($nombre_del_negocio, function ($query) use ($nombre_del_negocio) {
                $query->where('nombre_del_negocio', 'iLike', "%$nombre_del_negocio%");
            })
            ->validado()
            ->orderBy('id', 'asc')
            ->get();

        return $negocios;
    }
}
