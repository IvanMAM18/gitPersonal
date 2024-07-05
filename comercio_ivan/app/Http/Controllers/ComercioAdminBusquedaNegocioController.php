<?php

namespace App\Http\Controllers;

use App\Events\TramiteCargado;
use App\Models\Negocio;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ComercioAdminBusquedaNegocioController extends Controller
{
    //
    public function negociosEnRevision(Request $request)
    {
        $perPage = $request->per_page ?? 50;
        $cargarValidados = intval($request->validado_por);
        $year = $request->input('year', Carbon::now()->year);

        $existeFiltro = false;
        $negocios = Negocio::select('negocios.id', 'nombre_del_negocio', 'venta_alcohol', 'clave_catastral', 'impacto_giro_comercial', 'negocios.catalogo_tramite_id', 'negocios.validado_por', 'negocios.persona_id', 'negocios.persona_moral_id', 'negocios.created_at')
            ->leftJoin('users', 'negocios.persona_id', '=', 'users.id')
            ->leftJoin('personas_morales', 'negocios.persona_moral_id', '=', 'personas_morales.id')
            ->with([
                'giro_comercial:giro_comercial.id,giro_comercial.tipo,giro_comercial.nombre,giro_comercial.descripcion',
                'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre',
                'tramitesPadres' => function ($query) {
                    $query->orderByDesc('id')
                        ->with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre',
                        ]);
                },
                'tramites' => function ($query) {
                    $query
                        ->with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre,catalogo_tramites.entidad_revisora_id,catalogo_tramites.pago',
                            'aviso_entero:avisos_entero.id,avisos_entero.tramite_id,avisos_entero.estado',
                        ]);
                },
                'revisiones' => function ($query) {
                    $query->select('revision.id', 'revision.negocio_id', 'revision.entidad_revision_id', 'revision.tramite_id', 'revision.status', 'revision.created_at')
                        ->with('entidad:entidad_revision.id,entidad_revision.nombre')
                        ->orderBy('id', 'asc');
                },
                'validador:users.id,users.nombre',
            ])
            ->orderBy('id', 'asc');

        if ($request->id && strlen($request->id)) {
            $filtersId = $request->id;
            $negocios->whereHas('tramitesPadres', function ($tramiteComercioPadre) use ($filtersId) {
                $tramiteComercioPadre->where('id', 'like', "%{$filtersId}%");
            });
            $existeFiltro = true;
        }
        if ($request->negocio && strlen($request->negocio)) {
            $filtersNegocio = $request->negocio;
            $negocios->where('nombre_del_negocio', 'ilike', "%{$request->negocio}%");
            $existeFiltro = true;
        }
        if ($request->alcohol) {
            $filtersAlcohol = $request->alcohol;
            $negocios->where('venta_alcohol', $filtersAlcohol);
            $existeFiltro = true;
        }
        if ($request->rfc && strlen($request->rfc)) {
            $filtersRfc = $request->rfc;
            $negocios->porRFC($filtersRfc);
            $existeFiltro = true;
        }
        if ($request->clave_catastral && strlen($request->clave_catastral)) {
            $filtersClaveCatastral = $request->clave_catastral;
            $negocios->where('clave_catastral', 'ilike', "%{$filtersClaveCatastral}%");
            $existeFiltro = true;
        }
        if ($request->impacto) {
            $filtersImpacto = $request->impacto;
            $negocios->where('impacto_giro_comercial', $filtersImpacto);
            $existeFiltro = true;
        }
        if ($request->progreso) {
            $existeFiltro = true;
            $filtersProgreso = $request->progreso;
            switch ($filtersProgreso) {
                case 'VISTOS_BUENOS_1':
                    $negocios->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 1);
                    break;
                case 'VISTOS_BUENOS_2':
                    $negocios->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 2);
                    break;
                case 'VISTOS_BUENOS_3':
                    $negocios->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 3);
                    break;
                case 'VISTOS_BUENOS_4':
                    $negocios->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 4);
                    break;
                case 'PENDIENTE_PROTECCION_CIVIL':
                    $negocios->whereHas('tramites', function ($tramite) {
                        $proteccionCivilId = 2;
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['EN REVISION', 'ENVIADO']);
                        })->tieneEntidadRevision($proteccionCivilId);
                    });
                    break;
                case 'PENDIENTE_MEDIO_AMBIENTE':
                    $negocios->whereHas('tramites', function ($tramite) {
                        $medioAmbienteId = 3;
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['EN REVISION', 'ENVIADO']);
                        })->tieneEntidadRevision($medioAmbienteId);
                    });
                    break;
                case 'PENDIENTE_SERVICIOS_PUBLICOS':
                    $negocios->whereHas('tramites', function ($tramite) {
                        $serviciosPublicosId = 4;
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['EN REVISION', 'ENVIADO']);
                        })->tieneEntidadRevision($serviciosPublicosId);
                    });
                    break;
                default:
                    break;
            }
        }
        if (! $existeFiltro) {
            $condition = ($cargarValidados == 3 ? '>=' : ($cargarValidados == 0 ? '=' : '>'));
            $negocios->where('validado_por', $condition, 0);
            $response = $negocios->paginate($perPage);
        } else {
            $response = $negocios->paginate($perPage);
        }

        $response->map(function ($negocio) {
            $tramitePadre = $negocio->tramitePadre();
            $tramiteComercioPadre = $tramitePadre->tramitable;
            unset($tramitePadre->tramites);
            unset($negocio->tramites_padres);
            if (! $tramitePadre || ! $tramiteComercioPadre) {
                return $negocio;
            }
            $negocio->tramite_comercio_padre = new \StdClass();
            $negocio->tramite_comercio_padre->id = $tramiteComercioPadre->id;
            $negocio->tramite_comercio_padre->tramite_id = $tramiteComercioPadre->tramite_id;
            $negocio->tramite_comercio_padre->negocio_id = $tramiteComercioPadre->negocio_id;
            $negocio->tramite_comercio_padre->created_at = $tramiteComercioPadre->created_at;

            $negocio->tramite_comercio_padre->tramite = $tramitePadre;

            $negocio->tramites->each(function ($tramite) {
                $avisoEntero = $tramite ? $tramite->aviso_entero : null;
                if ($avisoEntero && $avisoEntero->vigente) {
                    TramiteCargado::dispatch($tramite);
                }
            });

            return $negocio;
        });

        return $response;
    }
}
