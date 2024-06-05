<?php

namespace App\Http\Controllers;

use App\Events\TramiteCargado;
use App\Helpers\EntidadRevisora;
use App\Models\EstadoRevision;
use App\Models\Negocio;
use App\Models\Revision;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ComercioAdminController extends Controller
{
    public function negociosEnRevisionSarePro(Request $request)
    {
        $perPage = $request->per_page ?? 50;
        $cargarValidados = intval($request->validado_por);
        $year = $request->input('year', Carbon::now()->year);

        $tamanoEmpresa = -1;
        if ($request->has('tamano_empresa') && $request->input('tamano_empresa')) {
            $tamanoEmpresa = $request->input('tamano_empresa');
            if($tamanoEmpresa == -1) {
                $tamanoEmpresa = null;
            }
        }

        $existeFiltro = false;
        $queryBuilder = Negocio::select('negocios.id', 'nombre_del_negocio', 'tamano_empresa', 'venta_alcohol', 'impacto_giro_comercial', 'negocios.catalogo_tramite_id', 'negocios.validado_por', 'negocios.persona_id', 'negocios.persona_moral_id', 'created_at')
            ->where('impacto_giro_comercial', 'bajo_impacto')
            ->whereHas('tramitesPadres', function (Builder $tramites) use ($year) {
                $tramites->whereYear('tramites.created_at', $year);
            })
            ->when($tamanoEmpresa != '-1', fn($query) => $query->where('tamano_empresa', $tamanoEmpresa))
            ->with([
                'giro_comercial:giro_comercial.id,giro_comercial.tipo,giro_comercial.nombre,giro_comercial.descripcion',
                'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre',
                'tramitesPadres' => function ($tramitePadre) use ($year) {
                    $tramitePadre->whereYear('tramites.created_at', $year)
                        ->with(['catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre']);
                },
                'tramites' => function ($tramite) use ($year) {
                    $tramite
                        ->whereYear('tramites.created_at', $year)
                        ->select('tramites.id', 'tramitable_id', 'tramitable_type', 'tramites.catalogo_tramites_id', 'tramites.created_at')
                        ->with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre,catalogo_tramites.entidad_revisora_id,catalogo_tramites.pago',
                            'aviso_entero:avisos_entero.id,avisos_entero.tramite_id,avisos_entero.estado',
                        ]);
                },
                'revisiones' => function ($revision) use ($year) {
                    $revision
                        ->whereYear('revision.created_at', $year)
                        ->select('revision.id', 'revision.negocio_id', 'revision.entidad_revision_id', 'revision.tramite_id', 'revision.status', 'revision.created_at')
                        ->with('entidad:entidad_revision.id,entidad_revision.nombre')->orderBy('id', 'asc');
                },
                'validador:users.id,users.nombre',
            ])
            ->orderBy('id', 'asc');

        if ($request->has('id') && $request->id != null) {
            $filtersId = $request->id;
            $queryBuilder->whereHas('tramite_padre', fn ($q) => $q->where('id', $filtersId));
            $existeFiltro = true;
        }
        if ($request->negocio && strlen($request->negocio)) {
            $filtersNegocio = $request->negocio;
            $queryBuilder->where('nombre_del_negocio', 'ilike', "%{$request->negocio}%");
            $existeFiltro = true;
        }
        if ($request->alcohol) {
            $filtersAlcohol = $request->alcohol;
            $queryBuilder->where('venta_alcohol', $filtersAlcohol);
            $existeFiltro = true;
        }
        if ($request->impacto) {
            $filtersImpacto = $request->impacto;
            $queryBuilder->where('impacto_giro_comercial', $filtersImpacto);
            $existeFiltro = true;
        }
        if ($request->progreso) {
            $existeFiltro = true;
            $filtersProgreso = $request->progreso;
            switch ($filtersProgreso) {
                case 'VISTOS_BUENOS_1':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 1);
                    break;
                case 'VISTOS_BUENOS_2':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 2);
                    break;
                case 'VISTOS_BUENOS_3':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 3);
                    break;
                case 'VISTOS_BUENOS_4':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 4);
                    break;
                case 'PENDIENTE_PROTECCION_CIVIL':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $proteccionCivilId = 2;
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['EN REVISION', 'ENVIADO']);
                        })->tieneEntidadRevision($proteccionCivilId);
                    });
                    break;
                case 'PENDIENTE_MEDIO_AMBIENTE':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $medioAmbienteId = 3;
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['EN REVISION', 'ENVIADO']);
                        })->tieneEntidadRevision($medioAmbienteId);
                    });
                    break;
                case 'PENDIENTE_SERVICIOS_PUBLICOS':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
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
            $queryBuilder->where('validado_por', $condition, 0);
            $response = $queryBuilder->paginate($perPage);
        } else {
            $response = $queryBuilder->paginate($perPage);
        }

        $response->map(function ($negocio) {
            $negocio->tramite_comercio_padre = $negocio->tramitesPadres->first();
            // Executa un listener.
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

    public function negociosEnRevision(Request $request)
    {
        $perPage = $request->per_page ?? 50;
        $cargarValidados = intval($request->validado_por);
        $year = $request->input('year', now()->year);

        $tamanoEmpresa = -1;
        if ($request->has('tamano_empresa') && $request->input('tamano_empresa')) {
            $tamanoEmpresa = $request->input('tamano_empresa');
            if($tamanoEmpresa == -1) {
                $tamanoEmpresa = null;
            }
        }

        $existeFiltro = false;
        $queryBuilder = Negocio::select('negocios.id', 'nombre_del_negocio', 'venta_alcohol', 'impacto_giro_comercial', 'negocios.catalogo_tramite_id', 'negocios.validado_por', 'negocios.persona_id', 'tamano_empresa', 'negocios.persona_moral_id')
            ->with([
                'giro_comercial:giro_comercial.id,giro_comercial.tipo,giro_comercial.nombre,giro_comercial.descripcion',
                'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre',
                'tramitesPadres' => function ($query) use ($year) {
                    $query->whereYear('tramites.created_at', $year)
                        ->with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre',
                        ]);
                },
                'tramites' => function ($tramite) use ($year) {
                    $tramite->whereYear('tramites.created_at', $year)
                        ->select('tramites.id', 'tramitable_id', 'tramitable_type', 'tramites.catalogo_tramites_id', 'tramites.created_at')
                        ->with([
                            'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre,catalogo_tramites.entidad_revisora_id,catalogo_tramites.pago',
                            'aviso_entero:avisos_entero.id,avisos_entero.tramite_id,avisos_entero.estado',
                        ]);
                },
                'revisiones' => function ($revision) use ($year) {
                    $revision
                        ->whereYear('revision.created_at', $year)
                        ->select('revision.id', 'revision.negocio_id', 'revision.entidad_revision_id', 'revision.tramite_id', 'revision.status', 'revision.created_at')
                        ->with('entidad:entidad_revision.id,entidad_revision.nombre');
                },
                'validador:users.id,users.nombre',
            ])
            ->whereHas('tramitesPadres', function (Builder $tramites) use ($year) {
                $tramites->whereYear('tramites.created_at', $year);
            })
            ->when($tamanoEmpresa != '-1', fn($query) => $query->where('tamano_empresa', $tamanoEmpresa))
            ->where('impacto_giro_comercial', 'mediano_alto_impacto')
            ->orderBy('id', 'asc');

        if ($request->id && strlen($request->id)) {
            $filtersId = $request->id;
            $queryBuilder->whereHas('tramitesPadres', function ($query) use ($filtersId) {
                $query->where('id', 'like', "%{$filtersId}%");
            });
            $existeFiltro = true;
        }
        if ($request->negocio && strlen($request->negocio)) {
            $filtersNegocio = $request->negocio;
            $queryBuilder->where('nombre_del_negocio', 'ilike', "%{$request->negocio}%");
            $existeFiltro = true;
        }
        if ($request->alcohol) {
            $filtersAlcohol = $request->alcohol;
            $queryBuilder->where('venta_alcohol', $filtersAlcohol);
            $existeFiltro = true;
        }
        if ($request->impacto) {
            $filtersImpacto = $request->impacto;
            $queryBuilder->where('impacto_giro_comercial', $filtersImpacto);
            $existeFiltro = true;
        }
        if ($request->progreso) {
            $existeFiltro = true;
            $filtersProgreso = $request->progreso;
            switch ($filtersProgreso) {
                case 'VISTOS_BUENOS_1':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 1);
                    break;
                case 'VISTOS_BUENOS_2':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 2);
                    break;
                case 'VISTOS_BUENOS_3':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 3);
                    break;
                case 'VISTOS_BUENOS_4':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['APROBADO', 'VISTO BUENO', 'VISOR']);
                        });
                    }, 4);
                    break;
                case 'PENDIENTE_PROTECCION_CIVIL':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $proteccionCivilId = 2;
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['EN REVISION', 'ENVIADO']);
                        })->tieneEntidadRevision($proteccionCivilId);
                    });
                    break;
                case 'PENDIENTE_MEDIO_AMBIENTE':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
                        $medioAmbienteId = 3;
                        $tramite->whereHas('ultima_revision', function ($revision) {
                            $revision->whereIn('status', ['EN REVISION', 'ENVIADO']);
                        })->tieneEntidadRevision($medioAmbienteId);
                    });
                    break;
                case 'PENDIENTE_SERVICIOS_PUBLICOS':
                    $queryBuilder->whereHas('tramites', function ($tramite) {
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
            $queryBuilder->where('validado_por', $condition, 0);
            $response = $queryBuilder->paginate($perPage);
        } else {
            $response = $queryBuilder->paginate($perPage);
        }

        $response->map(function ($negocio) {
            $negocio->tramite_comercio_padre = $negocio->tramitesPadres->first();
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

    public function obtenerNegocio(Request $request, Negocio $negocio)
    {
        return $negocio->load([
            'revisiones' => function ($revision) {
                $revision->with([
                    'estados_revision.negocio_requisitos.requisito.negocio_archivo',
                    'condicionantesRevision.condicionante',
                    'entidad']);
            },
            'direccion',
            'persona.direccion_notificacion',
            'persona_moral.direccion_notificacion',
            'giro_comercial',
            'catalogo_tramite',
            'tramite_padre',
            'tramites',
        ]);
    }

    public function detallesRevision($revision_id)
    {
        $__rev = Revision::where('id', $revision_id)->first();
        $negocio_id = $__rev->negocio_id;
        $negocio = Negocio::where('id', $negocio_id)
            ->with([
                'tramitesPadres' => function ($query) {
                    $query->with('aviso_entero');
                },
            ])
            ->first();

        $tramite_padre=$negocio->tramitesPadres->first()->id;

        $revision = Revision::where('id', $revision_id)
            ->with('estados_revision', function ($estados_revision) use ($__rev) {
                $estados_revision
                    ->with('revisor', function ($q) {
                        $q->select('id', 'nombre', 'apellido_pat');
                    })
                    ->with('requisitos', function ($requisitos) {
                        $requisitos->with('requisito', function ($requisito) {
                            $requisito
                                ->with('archivo');
                        });
                    })
                    ->with('negocio_requisitos', function ($negocio_requisitos) use ($__rev) {
                        $negocio_requisitos->with('requisito', function ($requisito) use ($__rev) {
                            $requisito
                                ->with('negocio_archivo', function ($archivo) use ($__rev) {
                                    $archivo->where('tramite_id', '=', $__rev->tramite_id);
                                });
                        });
                    })
                    ->orderBy('id', 'ASC');
            })
            ->with('entidad')
            ->first();


        $revision['tramite_padre_id'] = $tramite_padre;

        return response()->json($revision);
    }

    public function validarNegocio($negocio_id)
    {
        try {
            \DB::beginTransaction();
            $negocio = Negocio::find($negocio_id);
            $negocio->validado_por = Auth::user()->id;
            $negocio->save();

            // validar el subtrámite del primer órden
            $negocio = Negocio::with([
                'revisiones' => function ($query) {
                    $query->where('entidad_revision_id', 1);
                },
            ])->where('id', $negocio_id)->first();

            // if ($negocio->revisiones->first() == null) {
            //     $negocio = Negocio::with('revisiones')->where('id', $negocio_id)->first();
            // }

            if ($negocio) {
                $revision = $negocio->revisiones->first();
                if ($revision) {
                    $revision->status = 'ENVIADO';
                    $revision->save();

                    EstadoRevision::create([
                        'revision_id' => $revision->id,
                        'status' => 'ENVIADO',
                        'usuario_id' => Auth::user()->id,
                        'observaciones' => 'Revision iniciada',
                    ]);
                }
            } else {
                echo 'Negocio no encontrado.';
            }

            \DB::commit();

            //            if($negocio->tramites()->count() < 2){
            // mover aqui logica del frontend.
            //            }
            return [
                'ok' => true,
            ];

        } catch (\Throwable $th) {
            \DB::rollback();

            return [
                'ok' => false,
            ];
        }
    }

    public function observaciones(Request $request)
    {
        try {
            DB::beginTransaction();
            $status = $request->input('status');
            $user_id = $request->input('user_id');
            $observacion = $request->input('observacion');
            $negocio_id = $request->input('negocio_id');
            $entidad_id = $request->input('entidad_id');
            $revision_id = $request->input('revision_id');

            if ($status == 'EN REVISION') {
                $estado_revision = EstadoRevision::create([
                    'revision_id' => $revision_id,
                    'status' => $status,
                    'usuario_id' => $user_id,
                    'observaciones' => $observacion,
                ]);
                $negocio = Negocio::find($negocio_id);

                $this->SendMail(
                    'Trámites',
                    'Trámite de Comercio',
                    'OBSERVACIÓN DE COMERCIO',
                    $negocio->nombre_del_negocio,
                    [],
                    $observacion,
                    $negocio->user->email
                );

                DB::commit();

                return response()->json([
                    'ok' => true,
                    'status' => $status,
                    'nuevo_estado_revision' => $estado_revision,
                ]);
            }

            $estado_revision = EstadoRevision::create([
                'revision_id' => $revision_id,
                'status' => 'APROBADO',
                'usuario_id' => $user_id,
            ]);

            Negocio::where('id', $negocio_id)
                ->update(['validado_por' => Auth::user()->id]);

            DB::commit();

            return response()->json([
                'ok' => true,
                'status' => $status,
                'nuevo_estado_revision' => $estado_revision,
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
        }
    }

    public static function SendMail($subject = '', $tramite = '', $status = '', $negocio = '', $requisitos = [], $mensaje = '', $email = '')
    {
        //// ENVIAR CORREO
        try {
            $data['negocio'] = $negocio == '' ? '-' : $negocio;
            $data['last_name'] = '';
            $data['email'] = 'info.comercio@lapaz.gob.mx';
            $data['subject'] = $subject == '-' ? 'Asunto' : $subject;
            $data['status'] = $status == '' ? '-' : $status;
            $data['requisitos'] = $requisitos == '-' ? '' : $requisitos;
            $data['tramite'] = $tramite == '' ? '-' : $tramite;
            $data['observaciones'] = $mensaje == '' ? '-' : $mensaje;

            \Mail::send('emails/contact-email', $data, function ($mensaje) use ($data, $email) {
                $mensaje->from($data['email'], 'Sistema de Comercio del H.XVII Ayuntamiento de La Paz')
                    ->to($email, 'Sistema de comercio')
                    ->subject($data['subject']);
            });
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    public function crearRevisionParaEntidadRevisora(Negocio $negocio)
    {
        $tramitePadre = $negocio->tramitesPadres()->first();

        $revision = $negocio->revisiones()
            ->where('status', 'VISOR')
            ->where('entidad_revision_id', EntidadRevisora::$COMERCIO)
            ->first();

        if ($revision) {
            return ['revision_creada' => false];
        }

        $negocio->revisiones()->create([
            'status' => 'VISOR',
            'entidad_revision_id' => EntidadRevisora::$COMERCIO,
            'tramite_id' => $tramitePadre->id,
        ]);

        return ['revision_creada' => true];
    }
}
