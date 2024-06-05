<?php

namespace App\Http\Controllers;

use App\Helpers\EntidadRevisora;
use App\Models\CatalogoServicioPrivadoRecoleccionBasura;
use App\Models\Direccion;
use App\Models\EntidadRevision;
use App\Models\LicenciaAlcohol;
use App\Models\Negocio;
use App\Models\NegocioLicencia;
use App\Models\PersonaMoral;
use App\Models\Resolutivo;
use App\Models\Revision;
use App\Models\Roles;
use App\Models\Tramite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ResolutivoController extends Controller
{
    public function getNegociosByPagoResolutivoAndER($entidad_revisora_id, $year)
    {

        $negocios = Negocio::select(['id', 'nombre_del_negocio', 'venta_alcohol', 'impacto_giro_comercial'])
            ->with(['giro_comercial:nombre'])
            ->with('licenciaAlcohol', function ($query) {
                $query->with('licencia');
            })
            ->with('tramite_padre', fn ($query) => $query->whereYear('tramites.created_at', $year)->with([
                'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre',
            ]))
            ->whereHas('tramite_padre', fn ($query) => $query->whereYear('tramites.created_at', $year))
            ->with('tramites_padres', function ($tramitePadre) use ($year) {
                $tramitePadre
                    ->select('tramites.id', 'tramitable_id', 'tramitable_type', 'tramites.catalogo_tramites_id')
                    ->whereYear('tramites.created_at', $year)
                    ->with([
                        'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre',
                    ]);
            })
            ->with('tramites', function ($query) use ($year) {
                $query->select(['id', 'tramitable_id', 'tramitable_type', 'id as tramite_id', 'catalogo_tramites_id', 'created_at'])
                    ->whereYear('created_at', $year)
                    ->with('avisos_entero')
                    ->with('catalogo_tramites');
            })
            ->with('resolutivos', function ($resolutivo) use ($entidad_revisora_id, $year) {
                $resolutivo->whereHas('tramite', function ($q) use ($year) {
                    $q->whereYear('created_at', $year);
                })->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])->where('entidad_revisora_id', $entidad_revisora_id);
            })
            ->whereHas('tramites', function ($query) use ($entidad_revisora_id, $year) {
                $query->whereYear('created_at', $year)
                    ->whereHas('avisos_entero', function ($aviso_entero) {
                        $aviso_entero->where('estado', 'PAGADO');
                    })
                    ->whereHas('catalogo_tramites', function ($q) use ($entidad_revisora_id) {
                        if ($entidad_revisora_id !== 5 && $entidad_revisora_id !== '5') {
                            $q->where('entidad_revisora_id', $entidad_revisora_id)
                                ->where('resolutivo', '1');
                        } else {
                            $q->where('resolutivo', '1')
                                ->orwhere('resolutivo', '0');
                        }
                    });
            })
            ->with('revisiones', function ($revisiones) use ($entidad_revisora_id, $year) {
                if ($entidad_revisora_id !== 5 && $entidad_revisora_id !== '5') {
                    $revisiones
                        ->whereYear('created_at', $year)
                        ->select([
                            'id',
                            'entidad_revision_id',
                            'negocio_id',
                            'tramite_id',
                        ])
                        ->where('entidad_revision_id', $entidad_revisora_id)
                        ->with('estados_revision', function ($estados_revision) {
                            $estados_revision->select([
                                'id',
                                'revision_id',
                                'status',
                            ])->where('status', 'APROBADO')->orWhere('status', 'VISTO BUENO');
                        });
                } else {
                    $revisiones
                        ->whereYear('created_at', $year)
                        ->select([
                            'id',
                            'entidad_revision_id',
                            'negocio_id',
                            'tramite_id',
                            'status',
                            'created_at',
                        ])
                        ->with('estados_revision', function ($estados_revision) {
                            $estados_revision->select([
                                'id',
                                'revision_id',
                                'status',
                            ])->where('status', 'APROBADO')->orWhere('status', 'VISTO BUENO');
                        });
                }
            })
            ->whereHas('revisiones', function ($revisiones) use ($entidad_revisora_id) {
                if ($entidad_revisora_id !== 5 && $entidad_revisora_id !== '5') {
                    $revisiones
                        ->where('entidad_revision_id', $entidad_revisora_id)
                        ->whereHas('estados_revision', function ($estados_revision) {
                            $estados_revision->where('status', 'APROBADO')->orWhere('status', 'VISTO BUENO');
                        });
                } else {
                    $revisiones
                        ->whereHas('estados_revision', function ($estados_revision) {
                            $estados_revision->where('status', 'APROBADO')->orWhere('status', 'VISTO BUENO');
                        });
                }
            });

        if ($entidad_revisora_id == EntidadRevisora::$COMERCIO && $year > 2023) {

            // $negocios->whereHas('resolutivos', function ($query) use ($entidad_revisora_id, $year) {
            //     $query->whereYear('created_at', $year - 1)
            //         ->whereHas('tramite', function ($query) use ($year) {
            //             $query->whereYear('created_at', $year - 1);
            //         })
            //         ->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])
            //         ->where('entidad_revisora_id', $entidad_revisora_id);
            // });
            $negocios->orWhereHas('tramites', function ($query) use ($entidad_revisora_id, $year) {
                $query->whereYear('tramites.created_at', $year - 1)
                    ->whereHas('catalogo_tramites', function ($q) use ($entidad_revisora_id) {
                        $q->where('entidad_revisora_id', $entidad_revisora_id);
                    })
                    ->whereHas('resolutivo', function ($query) use ($year) {
                        $query->whereYear('created_at', $year - 1);
                    });
            });
        }
        $negocios = $negocios->get();

        $user_er_id = Auth::user()->entidad_revision_id;
        $user_role_id = Auth::user()->rol_id;
        $comercio_director = Roles::where('nombre', 'ComercioDirector')->first();
        $new_negocios = [];

        for ($i = 0; $i < count($negocios); $i++) {
//            if ( $negocios[$i]['revisiones'] == null || $revisiones->isEmpty() || count($negocios[$i]['revisiones'])<3) {
//                continue;
//            }
            if ($user_role_id === $comercio_director->id || $user_er_id === EntidadRevisora::$COMERCIO) {
                $negocio_valido = self::validarNegocioAprobadoSinAdeudosComercio($negocios[$i], $user_er_id, $year);
            } else {
                $negocio_valido = self::validarNegocioAprobadoSinAdeudosEntidadRevisora($negocios[$i], $user_er_id);
            }

            if ($negocio_valido === true) {
                $negocios[$i]['ultimo_estado'] = 'APROBADO';
                unset($negocios[$i]['revisiones']);

                $giros = [];
                foreach ($negocios[$i]['giro_comercial'] as $key => $item) {
                    array_push($giros, $item['nombre']);
                }

                $negocios[$i]['nombre_tramite_padre'] = $negocios[$i]['tramite_padre'][0]['catalogo_tramite']['nombre'];
                $negocios[$i]['tipo_tramite'] = $negocios[$i]['tramites'][0]['catalogo_tramites'][0]['tipo_tramite'];
                $negocios[$i]['giros'] = $giros;
                $negocios[$i]['tramite_comercio_padre'] = count($negocios[$i]['tramites_padres']) === 0 ? null : $negocios[$i]['tramites_padres'][0]['tramite_comercio'];
                unset($negocios[$i]['giro_comercial']);
                unset($negocios[$i]['tramites_comercio']);

                $negocios[$i]['tramite_padre_id'] = $negocios[$i]['tramite_padre']->first()->id;

                unset($negocios[$i]['tramite_padre']);
                array_push($new_negocios, $negocios[$i]);
            }
        }

        return $new_negocios;
    }

    public static function validarNegocioAprobadoSinAdeudosComercio($negocio, $user_er_id, $year)
    {
        $negocio_valido = false;
        if ($year != now()->year) {
            $date = \Carbon\Carbon::parse('2023-12-31');
        } else {
            $date = now();
        }
        $revisiones = $negocio->revisiones->filter(function ($r) use ($date) {

            return $r->created_at <= ($date);
        });
        if ((count($revisiones)>=3) && $revisiones !== null && ! $revisiones->isEmpty()) {
            $allowedStatuses = ['ENVIADO', 'EN REVISION', 'RECHAZADO'];
            $filteredRevisiones = [];

            foreach ($revisiones as $revision) {
                if (in_array($revision['status'], $allowedStatuses) && $revision['entidad_revision_id'] != 6) {
                    array_push($filteredRevisiones, $revision);
                }
            }

            if (empty($filteredRevisiones)) { // Todas las revisiones estan aprobadas o son Visor
                $negocio_valido = true;
                $tramites_comercio = $negocio->tramites->filter(function ($r) use ($date) {

                    return $r->created_at <= ($date);
                });

                foreach ($tramites_comercio as $tramiteComercio) {
                    $infoDelCatalogo = $tramiteComercio['catalogo_tramites'][0];

                    $pago = $infoDelCatalogo['pago'];
                    if ($pago === false || $infoDelCatalogo->id == 13) {
                        continue;
                    }
                    $avisosEntero = $tramiteComercio['avisos_entero'];
                    $aeLength = count($avisosEntero);

                    if ($aeLength === 0) {
                        $negocio_valido = false;
                        break;
                    }

                    $ultimoAvisoEntero = $avisosEntero[$aeLength - 1];
                    $negocio_valido = $ultimoAvisoEntero['pagado'];
                    if ($negocio_valido === false) {
                        break;
                    }
                }
            }
        }

        return $negocio_valido;
    }

    public static function validarNegocioAprobadoSinAdeudosEntidadRevisora($negocio, $user_er_id)
    {

        $revisiones = $negocio['revisiones'];
        $tramites_comercio = $negocio['tramites'];
        if ($revisiones !== null) {
            $allowedStatuses = ['ENVIADO', 'EN REVISION', 'RECHAZADO'];
            $revisionParaEntidadRevisora = null;
            foreach ($revisiones as $revision) {
                if ($revision['entidad_revision_id'] != 6 && $revision['entidad_revision_id'] === $user_er_id) {
                    $revisionParaEntidadRevisora = $revision;
                    break;
                }
            }

            if ($revisionParaEntidadRevisora !== null && in_array($revisionParaEntidadRevisora['status'], $allowedStatuses)) {
                return false;
            }

            $tramiteComercioParaEntidadRevisora = null;
            foreach ($tramites_comercio as $tramiteComercio) {
                $infoDelCatalogo = $tramiteComercio['catalogo_tramites'][0];
                if ($infoDelCatalogo['entidad_revisora_id'] === $user_er_id) {
                    $tramiteComercioParaEntidadRevisora = $tramiteComercio;
                    break;
                }
            }

            $infoDelCatalogo = $tramiteComercioParaEntidadRevisora['catalogo_tramites'][0];
            $pago = $infoDelCatalogo['pago'];
            if ($pago === false) {
                return true;
            }

            $avisosEntero = $tramiteComercioParaEntidadRevisora['avisos_entero'];
            $aeLength = count($avisosEntero);
            if ($aeLength === 0) {
                return false;
            }

            $ultimoAvisoEntero = $avisosEntero[$aeLength - 1];

            return $ultimoAvisoEntero['pagado'];
        }

        return false;
    }

    public function getNegociosByPagoResolutivoAlcoholes($entidad_revisora_id)
    {

        $negocios = Negocio::select(['id', 'nombre_del_negocio', 'venta_alcohol', 'impacto_giro_comercial'])
            ->conVentaAlcoholes()
            ->with(['giro_comercial:nombre'])
            ->with('tramite_padre:tramites_comercio.tramite_id as id,tramites_comercio.negocio_id')
            ->with('tramites', function ($query) {
                $query->with('avisos_entero')
                    ->with('catalogo_tramites:id,nombre,resolutivo,pago,entidad_revisora_id');
            })
            ->with('resolutivos', function ($resolutivo) use ($entidad_revisora_id) {
                $resolutivo->select(['id', 'negocio_id', 'entidad_revisora_id', 'folio'])
                    ->where('entidad_revisora_id', $entidad_revisora_id);
            })
            ->with('licenciaAlcohol', function ($query) {
                $query->with('licencia');
            })
            ->whereHas('licenciaAlcohol')
            ->whereHas('tramites', function ($query) {
                $query->whereHas('avisos_entero', function ($aviso_entero) {
                    $aviso_entero->where('estado', 'PAGADO');
                })
                    ->whereHas('catalogo_tramites', function ($q) {
                        $q->where('resolutivo', '1')->orwhere('resolutivo', '0');
                    });
            })
            ->with('revisiones', function ($revisiones) {
                $revisiones
                    ->with('estados_revision', function ($estados_revision) {
                        $estados_revision->where('status', 'APROBADO')->orWhere('status', 'VISTO BUENO');
                    });
            })
            ->whereHas('revisiones', function ($revisiones) {
                $revisiones
                    ->whereHas('estados_revision', function ($estados_revision) {
                        $estados_revision->where('status', 'APROBADO')->orWhere('status', 'VISTO BUENO');
                    });
            })->get();

        return $negocios;
    }

    public static function getRevisiones($revisiones)
    {
        $revisiones_return = [];
        foreach ($revisiones as $r) {
            $aprobados = self::getAprobados($r['estados_revision']);
            if (count($aprobados) > 0) {
                array_push($revisiones_return, $r);
            }
        }

        return $revisiones_return;
    }

    public static function getAprobados($estados_revision)
    {
        $er_return = [];
        foreach ($estados_revision as $er) {
            if ($er['status'] == 'APROBADO' || $er['status'] == 'VISTO BUENO') {
                array_push($er_return, $er);
            }
        }

        return $er_return;
    }

    public function getDireccionNotificacionNegocio($negocio_id)
    {
        $negocio = Negocio::find($negocio_id);

        if (isset($negocio->persona_moral_id)) {
            if ($negocio->persona_moral_id !== null) {
                $persona_moral = PersonaMoral::find($negocio->persona_moral_id);
                if ($persona_moral !== null) {
                    $direccion = Direccion::find($persona_moral->direccion_de_notificacion_id);
                    if ($direccion !== null) {
                        return $direccion;
                    }
                }
            }
        }
        if (isset($negocio->persona_id)) {
            $user = User::find($negocio->persona_id);
            $direccion = Direccion::find($user->direccion_de_notificacion_id);
            if ($direccion !== null) {
                return $direccion;
            }

            $direccion = Direccion::find($negocio->direccion_id);
            if ($direccion !== null) {
                return $direccion;
            } else {
                $user = User::find($negocio_id);
                $direccion = Direccion::find($user->direccion_de_notificacion_id);
                if ($direccion !== null) {
                    return $direccion;
                }
            }
        }

        $direccion = Direccion::find($negocio_id);
        if ($direccion !== null) {
            return $direccion;
        }

        return '';
    }

    public function getResolutivoImage(Request $request)
    {
        return Storage::download($request->url);
    }

    public function saveResolutivoInfo(Request $request)
    {
        if (Auth::user() == null) {
            return redirect('/login');
        }
        $resolutivo = Resolutivo::create([
            'fecha_expedicion' => date('Y-m-d H:i:s'),
            'fecha_expiracion' => date('Y-m-d H:i:s', strtotime('+1 year', strtotime(date('Y-m-d H:i:s')))),
            'tipo_de_registro' => 1,
            'servidor_publico' => Auth::user()->id,
            'detalles' => $request->input('formDataAsString'),
            'observaciones' => $request->input('Observaciones'),
            'entidad_revisora_id' => $request->input('entidad_revisora_id'),
            'negocio_id' => $request->input('negocio_id'),
            'folio' => '',
            'tramite_id' => $request->input('tramite_id'),
        ]);
        if ($request->file('compatibilidad') !== null) {
            self::saveResolutivoImage($request, 'compatibilidad', $resolutivo);
        }
        if ($request->file('intensidad_uso_suelo') !== null) {
            self::saveResolutivoImage($request, 'intensidad_uso_suelo', $resolutivo);
        }
        if ($request->file('plano_macrolocalizacion') !== null) {
            self::saveResolutivoImage($request, 'plano_macrolocalizacion', $resolutivo);
        }

        return $resolutivo;
    }

    public static function saveResolutivoImage($request, $fileFieldName, $resolutivo)
    {
        $path = $request->file($fileFieldName)->store(
            'resolutivos/uso_suelo/resolutivo_'.$resolutivo->id
        );
        $detallesObject = json_decode($resolutivo->detalles);
        $detallesObject->{$fileFieldName} = $path;
        $detallesString = json_encode($detallesObject);
        $resolutivo->detalles = $detallesString;
        $resolutivo->save();
    }

    public function getResolutivosPorEntidadRevisora($entidad_revisora_id)
    {
        $comercio_admin = EntidadRevision::where('nombre', 'Comercio')->first();
        if ($comercio_admin->id === $entidad_revisora_id) {
            return json_encode(Resolutivo::all(), JSON_INVALID_UTF8_SUBSTITUTE);
        } else {
            return json_encode(Resolutivo::where('entidad_revisora_id', $entidad_revisora_id)->get(), JSON_INVALID_UTF8_SUBSTITUTE);
        }
    }

    public function checkAndGetResolutivoPorNegocioAndER(Request $request)
    {
        $negocioId = $request->query('negocio_id');
        $entidadRevisoraId = $request->query('er_id');
        $year = $request->query('year');
        $resolutivo = Resolutivo::where('negocio_id', $negocioId)->where('entidad_revisora_id', $entidadRevisoraId)
            ->conTramite($year)
            ->first();

        if ($resolutivo !== null && $resolutivo->folio === null) {
            $resolutivo->folio = '';
            $resolutivo->save();
        }

        return json_encode($resolutivo, JSON_INVALID_UTF8_IGNORE);
    }

    public function checkAndGetResolutivoPorNegocioERAndObservaciones(Request $request)
    {
        $tramiteId = $request->query('tramite_id');
        $entidadRevisoraId = $request->query('er_id');
        $observaciones = $request->query('observaciones');
        $year = $request->query('year');
        $resolutivo = Resolutivo::where('tramite_id', $tramiteId)
            ->whereNull('negocio_id')
            ->where('entidad_revisora_id', $entidadRevisoraId)
            ->conTramite($year)
            ->where('observaciones', $observaciones)
            ->first();

        if ($resolutivo !== null && $resolutivo->folio === null) {
            $resolutivo->folio = '';
            $resolutivo->save();
        }

        return json_encode($resolutivo, JSON_INVALID_UTF8_IGNORE);
    }

    public function firmarResolutivo(Request $request)
    {
        $negocioId = $request->negocio_id;
        $entidadRevisoraId = $request->er_id;
        $year = $request->year;

        $resolutivo = Resolutivo::where('negocio_id', $negocioId)
            ->conTramite($year)
            ->where('entidad_revisora_id', $entidadRevisoraId)
            ->first();

        if ($resolutivo === null || $resolutivo === '') {
            return null;
        }
        $timestamp = strtotime($resolutivo->created_at);
        $day = date('d', $timestamp);
        $month = date('m', $timestamp);
        $year = date('y', $timestamp);
        $resolutivo->folio = $day.$month.$year.'-'.$resolutivo->id;
        $resolutivo->save();

        // self::SendMail($resolutivo);
        return json_encode($resolutivo, JSON_INVALID_UTF8_IGNORE);
    }

    public function saveResolutivoLicenciaFuncionamiento(Request $request)
    {
        if (Auth::user() == null) {
            return redirect('/login');
        }
        $negocioId = $request->input('negocio_id');
        $entidadRevisoraId = $request->input('entidad_revisora_id');
        $year = $request->input('year_creacion_tramite');
        $resolutivo = Resolutivo::where('negocio_id', $negocioId)
            ->conTramite($year)
            ->where('entidad_revisora_id', $entidadRevisoraId)
            ->first();

        $giros = Negocio::select('negocios.id', 'nombre_del_negocio', 'negocios.catalogo_tramite_id')
            ->with('giro_comercial:giro_comercial.id,giro_comercial.tipo,giro_comercial.nombre,giro_comercial.descripcion')
            ->where('id', $negocioId)
            ->get();
        $nombresGiros = $giros->pluck('giro_comercial.*.nombre')->flatten();
        foreach ($nombresGiros as $nombre) {
            if ($nombre == 'Recolección de residuos no peligrosos por el sector privado') {
                $nombreComercial = $request->input('nombre_comercial');
                $tramiteId = $request->input('tramite_id');
                $buscar = CatalogoServicioPrivadoRecoleccionBasura::where('tramite_id', $tramiteId)
                    ->first();
                if ($buscar === null) {
                    CatalogoServicioPrivadoRecoleccionBasura::create([
                        'tramite_id' => $tramiteId,
                        'nombre' => $nombreComercial,
                    ]);
                }
            }
        }

        if ($resolutivo === null || $resolutivo === '') {
            $resolutivo_nuevo = Resolutivo::create([
                'fecha_expedicion' => date('Y-m-d H:i:s'),
                'fecha_expiracion' => date('Y-m-d H:i:s', strtotime('+1 year', strtotime(date('Y-m-d H:i:s')))),
                'tipo_de_registro' => 1,
                'servidor_publico' => Auth::user()->id,
                'detalles' => $request->input('formDataAsString'),
                'observaciones' => $request->input('Observaciones'),
                'entidad_revisora_id' => $request->input('entidad_revisora_id'),
                'negocio_id' => $request->input('negocio_id'),
                'folio' => '',
                'tramite_id' => $request->input('tramite_id'),
            ]);

            if (app()->isProduction()) {
                self::SendMail($resolutivo_nuevo);
            }

            return $resolutivo_nuevo;
        }

        $timestamp = strtotime($resolutivo->created_at);
        $day = date('d', $timestamp);
        $month = date('m', $timestamp);
        $year = date('y', $timestamp);
        $resolutivo->folio = $day.$month.$year.'-'.$resolutivo->id;
        $resolutivo->detalles = $request->input('formDataAsString');
        $resolutivo->tramite_id = $request->input('tramite_id');
        $resolutivo->save();
        if (app()->isProduction()) {
            self::SendMail($resolutivo);
        }

        return $resolutivo;
    }

    public function saveResolutivoProteccionCivil(Request $request)
    {
        if (Auth::user() == null) {
            return redirect('/login');
        }
        $negocioId = $request->input('negocio_id');
        $entidadRevisoraId = $request->input('entidad_revisora_id');
        $year = $request->input('year');
        $resolutivo = Resolutivo::where('negocio_id', $negocioId)
            ->with('tramite')
            ->conTramite($year)
            ->where('entidad_revisora_id', $entidadRevisoraId)
            ->first();

        if ($resolutivo === null || $resolutivo === '') {
            $resolutivo_nuevo = Resolutivo::create([
                'fecha_expedicion' => date('Y-m-d H:i:s'),
                'fecha_expiracion' => date('Y-m-d H:i:s', strtotime('+1 year', strtotime(date('Y-m-d H:i:s')))),
                'tipo_de_registro' => 1,
                'servidor_publico' => Auth::user()->id,
                'detalles' => $request->input('formDataAsString'),
                'observaciones' => $request->input('observaciones'),
                'entidad_revisora_id' => $request->input('entidad_revisora_id'),
                'negocio_id' => $request->input('negocio_id'),
                'folio' => '',
                'tramite_id' => $request->input('tramite_id'),
            ]);
            if ($request->input('firmar') === 1) {
                $timestamp = strtotime($resolutivo_nuevo->created_at);
                $day = date('d', $timestamp);
                $month = date('m', $timestamp);
                $year = date('y', $timestamp);
                $resolutivo_nuevo->folio = $day.$month.$year.'-'.$resolutivo_nuevo->id;
                $resolutivo_nuevo->save();
                self::SendMail($resolutivo);
            }

            return $resolutivo_nuevo;
        }
        $resolutivo->detalles = $request->input('formDataAsString');
        $resolutivo->tramite_id = $request->input('tramite_id');
        if ($request->input('firmar') === 1) {
            $timestamp = strtotime($resolutivo->created_at);
            $day = date('d', $timestamp);
            $month = date('m', $timestamp);
            $year = date('y', $timestamp);
            $resolutivo->folio = $day.$month.$year.'-'.$resolutivo->id;
            self::SendMail($resolutivo);
        }
        $resolutivo->save();

        return $resolutivo;
    }

    public function saveResolutivosContaloria(Request $request)
    {
        if (Auth::user() == null) {
            return redirect('/login');
        }
        $negocioId = $request->input('negocio_id');
        $entidadRevisoraId = $request->input('entidad_revisora_id');
        $year = $request->input('year');
        $resolutivo = Resolutivo::where('negocio_id', $negocioId)
            ->where('entidad_revisora_id', $entidadRevisoraId)
            ->conTramite($year)
            ->where('observaciones', $request->input('observaciones'))
            ->first();
        if ($resolutivo === null || $resolutivo === '') {
            $resolutivo_nuevo = Resolutivo::create([
                'fecha_expedicion' => date('Y-m-d H:i:s'),
                'fecha_expiracion' => date('Y-m-d H:i:s', strtotime('+1 year', strtotime(date('Y-m-d H:i:s')))),
                'tipo_de_registro' => 1,
                'servidor_publico' => Auth::user()->id,
                'detalles' => $request->input('formDataAsString'),
                'observaciones' => $request->input('observaciones'),
                'entidad_revisora_id' => $request->input('entidad_revisora_id'),
                'negocio_id' => $request->input('negocio_id'),
                'folio' => '',
                'tramite_id' => $request->input('tramite_id'),
            ]);
            if ($request->input('firmar') === 1) {
                $timestamp = strtotime($resolutivo_nuevo->created_at);
                $day = date('d', $timestamp);
                $month = date('m', $timestamp);
                $year = date('y', $timestamp);
                $resolutivo_nuevo->folio = $day.$month.$year.'-'.$resolutivo_nuevo->id;
                $resolutivo_nuevo->save();
                self::SendMail($resolutivo);
            }

            return $resolutivo_nuevo;
        }
        $resolutivo->detalles = $request->input('formDataAsString');
        $resolutivo->tramite_id = $request->input('tramite_id');
        if ($request->input('firmar') === 1) {
            $timestamp = strtotime($resolutivo->created_at);
            $day = date('d', $timestamp);
            $month = date('m', $timestamp);
            $year = date('y', $timestamp);
            $resolutivo->folio = $day.$month.$year.'-'.$resolutivo->id;
            self::SendMail($resolutivo);
        }
        $resolutivo->save();

        return $resolutivo;
    }

    public function firmarResolutivoPorId(Request $request)
    {
        $resolutivoId = $request->resolutivo_id;
        $tramiteId = $request->tramite_id;
        $resolutivo = Resolutivo::where('id', $resolutivoId)->first();
        if ($resolutivo === null || $resolutivo === '') {
            return null;
        }
        $timestamp = strtotime($resolutivo->created_at);
        $day = date('d', $timestamp);
        $month = date('m', $timestamp);
        $year = date('y', $timestamp);
        $resolutivo->folio = $day.$month.$year.'-'.$resolutivo->id;
        $resolutivo->tramite_id = $tramiteId;
        $resolutivo->save();
        //check if is Licencia funcionamiento
        if ($resolutivo->entidad_revisora_id === 5 || $resolutivo->entidad_revisora_id === '5') {
            $revisionComercio = Revision::where('entidad_revision_id', 5)->where('negocio_id', $resolutivo->negocio_id)->first();

            if ($revisionComercio === null) {
                Revision::create([
                    'negocio_id' => $resolutivo->negocio_id,
                    'entidad_revision_id' => 5,
                    'status' => 'APROBADO',
                    'tramite_id' => $tramiteId,
                ]);
            } else {
                $revisionComercio->status = 'APROBADO';
                $revisionComercio->save();
            }

            $negocio = Negocio::find($resolutivo->negocio_id);
            $negocio->status = 'APROBADO';
            $negocio->save();
        }

        if (app()->isProduction() && $resolutivo->negocio_id !== null) {
            self::SendMail($resolutivo);
        }

        return json_encode($resolutivo, JSON_INVALID_UTF8_IGNORE);
    }

    public function getResolutivoViewByFolio(Resolutivo $resolutivo)
    {
        return view('comercio.resolutivo_view', ['resolutivo' => $resolutivo]);
    }

    public function getResolutivoDataByFolio($folio)
    {
        $resolutivo = Resolutivo::where('folio', $folio)->first();
        $negocio = Negocio::where('id', $resolutivo->negocio_id)
            ->with('persona', function ($persona_moral) {
                $persona_moral->with('direccion_notificacion');
            })
            ->with('persona_moral', function ($persona_moral) {
                $persona_moral->with('direccion_notificacion');
            })
            ->with('giro_comercial')
            ->with('direccion')
            ->first();
        $resolutivo->negocio = $negocio;

        return json_encode($resolutivo, JSON_INVALID_UTF8_IGNORE);
    }

    public function getTramitePersona($tramite_id)
    {
        $tramite = Tramite::where('id', $tramite_id)
            ->with('tramitable')
            ->first();

        return json_encode($tramite, JSON_INVALID_UTF8_IGNORE);
    }

    public static function SendMail($resolutivo)
    {
        $negocio = Negocio::where('id', $resolutivo->negocio_id)
            ->with('persona')
            ->first();
        $entidad_revisora = EntidadRevision::find($resolutivo->entidad_revisora_id);

        $nombre_entidad_revisora = $entidad_revisora->nombre;
        $subject = 'Resolutivo generado en '.$nombre_entidad_revisora;
        $email_destino = $negocio->persona->email;

        $data['entidad'] = $nombre_entidad_revisora ?? '';
        $data['negocio'] = $negocio->nombre_del_negocio ?? '';
        $data['folio'] = $resolutivo->folio;

        \Mail::send('emails/resolutivo-listo-email', $data, function ($mensaje) use ($subject, $email_destino) {
            $mensaje->from('info.comercio@lapaz.gob.mx', 'Sistema de Comercio del H.XVII Ayuntamiento de La Paz')
                ->to($email_destino, 'Sistema de comercio')
                ->subject($subject);
        });
        //El resolutivo para su trámite en ".$nombre_entidad_revisora." ha sido generado.
    }

    public function getNegocioById($negocio_id)
    {
        $negocio = Negocio::where('id', $negocio_id)
            ->with('direccion', function ($direccion) {
                $direccion->with('colonia');
            })
            ->with('tramite_padre:tramites_comercio.tramite_id as id,tramites_comercio.negocio_id')
            ->with('persona')
            ->with('persona_moral')
            ->with('licenciaAlcohol', function ($query) {
                $query->with('licencia');
            })
            ->first();

        return $negocio;
    }

    public function detallesResolutivosAlcohol($negocio_id)
    {
        $negocio = Negocio::select(['id', 'catalogo_tramite_id', 'categoria_id', 'created_at'])
            ->where('id', $negocio_id)
            ->with('direccion', function ($direccion) {
                $direccion->with('colonia');
            })
            ->with('licenciaAlcohol', function ($query) {
                $query->with('negocioOperador')
                    ->with('negocioPropietario');
            })
            ->with('tramites', function ($query) {
                $query->with('avisos_entero')
                    ->with('catalogo_tramites:id,nombre,resolutivo,pago,entidad_revisora_id');
            })
            ->first();

        $negocio_operador = $this::getNegocioById($negocio['licenciaAlcohol']['negocioOperador']['id']);
        if ($negocio->licenciaAlcohol->propietario != null) {
            $negocio_propietario = $negocio->licenciaAlcohol->propietario;
            $negocio_propietario->nombre_del_negocio = $negocio_propietario->nombre;
        } else {
            $negocio_propietario = $this::getNegocioById($negocio['licenciaAlcohol']['negocioPropietario']['id']);
        }

        unset($negocio['propietario']);
        $negocio['operador'] = $negocio_operador;
        $negocio['propietario_'] = $negocio_propietario;
        unset($negocio['licenciaAlcohol']);

        return $negocio;
    }

    public function getTramitesConTramitePersona()
    {

        if (Auth::user() == null) {
            return redirect('/login');
        }
        if (Auth::user()->entidad_revision_id !== 7) {
            return [];
        }

        $tramites = Tramite::whereHasMorp('tramitable', [User::class, PersonaMoral::class])
            ->whereHas('catalogo_tramite', function ($catalogo_tramite) {
                $catalogo_tramite->where('entidad_revisora_id', 7);
            })
            ->whereNotNull('tramite_padre_id')
            ->with('resolutivo', function ($resolutivo) {
                $resolutivo->whereNull('negocio_id');
            })
            ->with('catalogo_tramite')
            ->with('ultima_revision')
            ->with('aviso_entero')
            ->with('rtamitable')
            ->get();
        //return $tramites;
        $statuses = ['APROBADO', 'VISTO BUENO', 'VISOR'];
        $tramitesToReturn = [];
        foreach ($tramites as $tramite) {
            $tramite['pagado'] = $tramite['aviso_entero'] !== null ? $tramite['aviso_entero']['pagado'] : false;

            if (in_array($tramite['ultima_revision']['status'], $statuses) && $tramite['pagado'] === true) {
                $catalogoTramite = $tramite['catalogo_tramite'];

                $tramite['nombre_tramite'] = $catalogoTramite['nombre'];
                $tramite['tipo_tramite'] = $catalogoTramite['tipo_tramite'];
                $tramite['catalogo_tramite_id'] = $catalogoTramite['id'];

                $tramitePersona = $tramite->tramitable;
                $tramite['tramite_persona_id'] = $tramitePersona['tramite_padre_id'];
                if ($tramitePersona['persona_type'] == "App\Models\User") {
                    $tramite['nombre_persona'] = $tramitePersona['persona']['nombre'].' '.$tramitePersona['persona']['apellido_pat'].' '.$tramitePersona['persona']['apellido_mot'];
                    $tramite['curp'] = $tramitePersona['persona']['curp'];
                    $tramite['tipo_persona'] = 'Física';
                }

                if ($tramitePersona['persona_type'] == "App\Models\PersonaMoral") {
                    $tramite['nombre_persona'] = $tramitePersona['persona']['razon_social'];
                    $tramite['curp'] = 'N/A';
                    $tramite['tipo_persona'] = 'Moral';
                }
                $tramite['status'] = $tramite['ultima_revision']['status'];
                $tramite['status_resolutivo'] = 'por defiunir';
                $tramite['pagado'] = $tramite['aviso_entero'] !== null ? $tramite['aviso_entero']['pagado'] : false;

                unset($tramite['ultima_revision']);
                unset($tramite['aviso_entero']);
                unset($tramite['tramitable']);
                unset($tramite['catalogo_tramite']);
                array_push($tramitesToReturn, $tramite);
            }
        }

        return $tramitesToReturn;
    }

    public function getTramitesConTramitePersonaAlcoholes()//////////////////////////////////////////////////////////////////////////////////////////
    {

        if (Auth::user() == null) {
            return redirect('/login');
        }
        if (Auth::user()->entidad_revision_id !== 6) {
            return [];
        }

        $tramites = Tramite::whereHasMorph('tramitable', [User::class, PersonaMoral::class])
            ->whereHas('catalogo_tramite', function ($catalogo_tramite) {
                $catalogo_tramite->where('entidad_revisora_id', EntidadRevisora::$ALCOHOLES);
            })->whereNotNull('tramite_padre_id')
            ->with('resolutivo')
            ->with('catalogo_tramite')
            ->with('ultima_revision', function ($q) {
                $q->with('requisitos', function ($q) {
                    $q->where('requisito_id', 54);
                });
            })
            ->with('aviso_entero')
            ->with('tramitable', function ($query) {
                $query->with('licencias', function ($l) {
                    $l->with('negocioPropietario', function ($np) {
                        $np->with('licenciaAlcoholPropietario', function ($lap) {
                            $lap->with('licencia');
                        });
                    })->with('negocioOperador', function ($no) {
                        $no->with('licenciaAlcohol', function ($la) {
                            $la->with('licencia');
                        })->with('direccion')->with('resolutivos', function ($r) {
                            $r->where('entidad_revisora_id', 6);
                        });
                    })->with('propietario');
                });
            })
            ->get();

        //return $tramites;
        $statuses = ['APROBADO', 'VISTO BUENO', 'VISOR'];
        $tramitesToReturn = [];
        foreach ($tramites as $tramite) {
            $tramite['pagado'] = $tramite['aviso_entero'] === null ? false : $tramite['aviso_entero']['pagado'];

            if (in_array($tramite['ultima_revision']['status'], $statuses) && $tramite['pagado'] === true) {
                $catalogoTramite = $tramite['catalogo_tramite'];

                $tramite['nombre_tramite'] = $catalogoTramite['nombre'];
                $tramite['tipo_tramite'] = $catalogoTramite['tipo_tramite'];
                $tramite['catalogo_tramite_id'] = $catalogoTramite['id'];

                $tramitePersona = $tramite->tramitable;
                $tramite['tramite_persona_id'] = $tramitePersona['tramite_padre_id'];
                if ($tramitePersona['persona_type'] == "App\Models\User") {
                    $tramite['nombre_persona'] = $tramitePersona['persona']['nombre'].' '.$tramitePersona['persona']['apellido_pat'].' '.$tramitePersona['persona']['apellido_mot'];
                    $tramite['curp'] = $tramitePersona['persona']['curp'];
                    $tramite['tipo_persona'] = 'Física';
                }

                if ($tramitePersona['persona_type'] == "App\Models\PersonaMoral") {
                    $tramite['nombre_persona'] = $tramitePersona['persona']['razon_social'];
                    $tramite['curp'] = 'N/A';
                    $tramite['tipo_persona'] = 'Moral';
                }
                $tramite['status'] = $tramite['ultima_revision']['status'];
                $tramite['status_resolutivo'] = 'por definir';
                $tramite['pagado'] = $tramite['aviso_entero'] !== null ? $tramite['aviso_entero']['pagado'] : false;

                $tramite['persona_id'] = $tramitePersona['persona']['id'];

                if (count($tramitePersona->persona->licencias) > 0) {
                    $licencias = $tramitePersona->persona->licencias;
                    $tramite['licencia'] = NegocioLicencia::with(['licencia', 'negocioOperador.licenciaAlcohol.licencia', 'propietario'])->where('licencia_id', LicenciaAlcohol::where(
                        'clave',
                        $tramite->ultima_revision->requisitos->first()->valor
                    )->get()->first()->id)->get()->first();
                } else {
                    $tramite['licencia'] = null;
                }

                unset($tramite['ultima_revision']);
                unset($tramite['aviso_entero']);
                unset($tramite['tramitable']);
                unset($tramite['catalogo_tramite']);
                if (count($tramitePersona->persona->licencias) > 0) {
                    if ($tramite['licencia'] != null) {
                        array_push($tramitesToReturn, $tramite);
                    }
                }
            }
        }

        return $tramitesToReturn;
    }
}
