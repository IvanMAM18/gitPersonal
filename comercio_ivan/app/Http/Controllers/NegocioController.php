<?php

namespace App\Http\Controllers;

use App\Helpers\ClavesScian;
use App\Helpers\EntidadRevisora;
use App\Helpers\Refrendos;
use App\Models\RequisitoEntidad;

ini_set('max_execution_time', 1800);

use App\Events\TramiteCargado;
use App\Helpers\TurismoAPI;
use App\Models\AvisoEntero;
use App\Models\CatalogoTramite;
use App\Models\CondicionantesRevision;
use App\Models\DatosFacturacion;
use App\Models\Direccion;
use App\Models\EstadoRevision;
use App\Models\GiroComercial;
use App\Models\GiroComercialNegocio;
use App\Models\Negocio;
use App\Models\NegocioRequisitoRevision;
use App\Models\PersonaMoral;
use App\Models\Requisito;
use App\Models\Revision;
use App\Models\Subtramite;
use App\Models\Tramite;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class NegocioController extends Controller
{
    public $negocios = null;

    public function __construct()
    {
        $this->negocios = new Negocio();
    }

    public function detallesPorTramite(Tramite $tramite)
    {
        $tramitePadre = $tramite;
        $tramitesHijos = $tramitePadre->tramites_hijos;
        $idsTramites = $tramitesHijos->pluck('id');
        $idsTramites->add($tramitePadre->id);
        $negocio_id = $tramitePadre->tramitable->id;
        $user_id = Auth::user()->id;

        $negocio = Negocio::where('id', $negocio_id)
            ->where('persona_id', $user_id)
            ->with([
                'direccion',
                'persona',
                'giro_comercial',
                'catalogo_tramite',
                'persona_moral',
                'tramites' => function ($query) use ($idsTramites) {
                    $query->whereIn('id', $idsTramites)
                        ->with('aviso_entero')
                        ->with('catalogo_tramites');
                },
                'revisiones' => function ($query) use ($negocio_id, $idsTramites) {
                    $query->with([
                        'entidad',
                        'condicionantesRevision.condicionante',
                        'estados_revision' => function ($query) use ($negocio_id, $idsTramites) {
                            $query->with('requisitos', function ($query) {
                                $query->with('requisito', function ($query) {
                                    $query->with('archivo', function ($query) {
                                        $query->where('user_id', '=', Auth::user()->id);
                                    });
                                });
                            })
                                ->with('negocio_requisitos', function ($negocio_requisitos) use ($negocio_id, $idsTramites) {
                                    $negocio_requisitos->with('requisito', function ($requisito) use ($negocio_id, $idsTramites) {
                                        $requisito
                                            ->with('negocio_archivo', function ($archivo) use ($negocio_id, $idsTramites) {
                                                $archivo->where('negocio_id', $negocio_id)
                                                    ->whereIn('tramite_id', $idsTramites);
                                            });
                                    });
                                })
                                ->orderBy('id', 'asc');
                        }])
                        ->whereIn('tramite_id', $idsTramites)
                        ->orderBy('entidad_revision_id', 'asc');
                },
            ])
            ->first();

        $subtramites_del_tramite_padre_id = $negocio->tramitePadre()->catalogo_tramites_id;
        $subtramites = Subtramite::where('catalogo_tramite_padre_id', $subtramites_del_tramite_padre_id)
            ->with('catalogo_tramite_hijo')
            ->get();
        $negocio['subtramites'] = $subtramites;

        $negocio->tramites->map(function ($tramite) use ($idsTramites, $negocio_id) {

            $entidad_revisora_id = $tramite['catalogo_tramites'][0]['entidad_revisora_id'];

            $revision = Revision::where('entidad_revision_id', $entidad_revisora_id)
                ->whereIn('tramite_id', $idsTramites)
                ->where('negocio_id', $negocio_id)
                ->first();

            $tramite['revision_status'] = $revision['status'] ?? 'PENDIENTE';

            return $tramite;
        });

        return response($negocio);
    }

    public function show(Negocio $negocio)
    {
        $user_id = Auth::user()->id;

        $currentTramitePadre = $negocio->tramitesPadres()->first();
        $negocio = Negocio::where('id', $negocio->id)
            ->where('persona_id', $user_id)
            ->with([
                'direccion',
                'persona',
                'giro_comercial',
                'catalogo_tramite',
                'persona_moral',
                'tramites' => fn($query) => $query->with('aviso_entero')->with('catalogo_tramites')->where('tramite_padre_id', $currentTramitePadre->id),
                'tramitesPadres',
                'tramites',
                'revisiones' => function ($query) use ($negocio) {
                    $query->with('entidad')
                        ->with('condicionantesRevision.condicionante')
                        ->with('estados_revision', function ($query) use ($negocio) {
                            $query
                                ->with('requisitos', function ($query) {
                                    $query->with('requisito', function ($query) {
                                        $query->with('archivo', function ($query) {
                                            $query->where('user_id', '=', Auth::user()->id);
                                        });
                                    });
                                })
                                ->with('negocio_requisitos', function ($query) use ($negocio) {
                                    $query->with('requisito', function ($query) use ($negocio) {
                                        $query->with('negocio_archivo', function ($query) use ($negocio) {
                                            $query->where('negocio_id', '=', $negocio->id);
                                        });
                                    });
                                })
                                ->orderBy('id', 'asc');
                        })
                        ->orderBy('entidad_revision_id', 'asc');
                },
            ])
            ->first();

        $subtramites_del_tramite_padre_id = $negocio->tramitesPadres->first()->catalogo_tramites_id;
        $subtramites = Subtramite::where('catalogo_tramite_padre_id', $subtramites_del_tramite_padre_id)
            ->with('catalogo_tramite_hijo')
            ->get();

        $negocio['subtramites'] = $subtramites;

        // esto muy probablemente ni afecte en nada....
        $negocio->tramites->map(function ($tramite) use ($negocio) {
            $entidad_revisora_id = $tramite->catalogo_tramites->first()->entidad_revisora_id;
            $revision = Revision::where('entidad_revision_id', $entidad_revisora_id)->where('negocio_id', $negocio->id)->first();
            $tramite['revision_status'] = $revision['status'] ?? 'PENDIENTE';
        });

        return $negocio;
    }

    public function store(Request $request)
    {
        try {
            \DB::beginTransaction();

            $final_persona_moral_id = null;

            /** datos para Ashley */
            $catalogo_tramite_id = $request->input('catalogo_tramite_padre_id');
            $catalogo_tramite_hijo_id = $request->input('catalogo_tramite_hijo_id');
            $orden = $request->input('orden');

            $acta_constitutiva = $request->input('acta_constitutiva');
            $cajones_estacionamiento = $request->input('cajones_estacionamiento');
            $tipo_direccion_notificacion = $request->input('tipo_direccion_notificacion');
            $foto_frontal_fachada = $request->input('foto_frontal_fachada');
            $comprobante_domicilio_negocio = $request->input('comprobante_domicilio_negocio');
            $venta_alcohol = $request->input('venta_alcohol');
            $servicio_priv_recoleccion = $request->input('servicio_priv_recoleccion');

            // dirección
            $calle_principal = $request->input('calle_principal');
            $calles = $request->input('calles');
            $codigo_postal = $request->input('codigo_postal');
            $pos = $request->input('pos');
            $numero_externo = $request->input('numero_externo');
            $numero_interno = $request->input('numero_interno');
            $tipo = $request->input('tipo');
            $colonia_id = $request->input('colonia_id');
            $delegacion = $request->input('delegacion');

            $documento_predio_propiedad = $request->input('documento_predio_propiedad');
            $tipo_predio_propiedad = $request->input('tipo_predio_propiedad');

            // dirección persona moral
            $ma_calle_principal = $request->input('ma_calle_principal');
            $ma_calles = $request->input('ma_calles');
            $ma_codigo_postal = $request->input('ma_codigo_postal');
            $ma_colonia_id = $request->input('ma_colonia_id');
            $ma_numero_externo = $request->input('ma_numero_externo');
            $ma_numero_interno = $request->input('ma_numero_interno');
            $ma_tipo = $request->input('ma_tipo');
            $ma_colonia_id = $request->input('ma_colonia_id');
            $ma_delegacion = '';

            // dirección notificación
            $dn_calle_principal = $request->input('dn_calle_principal');
            $dn_calles = $request->input('dn_calles');
            $dn_codigo_postal = $request->input('dn_codigo_postal');
            $dn_colonia_id = $request->input('dn_colonia_id');
            $dn_numero_externo = $request->input('dn_numero_externo');
            $dn_numero_interno = $request->input('dn_numero_interno');
            $dn_tipo = $request->input('dn_tipo');
            $dn_colonia_id = $request->input('dn_colonia_id');
            $dn_delegacion = $request->input('dn_delegacion');

            //dirección de facturación persona física
            $pf_calle_principal = $request->input('pf_calle_principal');
            $pf_calles = $request->input('pf_calles');
            $pf_codigo_postal = $request->input('pf_codigo_postal');
            $pf_colonia_id = $request->input('pf_colonia_id');
            $pf_numero_externo = $request->input('pf_numero_externo');
            $pf_numero_interno = $request->input('pf_numero_interno');
            $pf_tipo = $request->input('pf_tipo');
            $pf_colonia_id = $request->input('pf_colonia_id');
            $pf_delegacion = '';

            $descripcion_actividad = $request->input('descripcion_actividad');
            $clave_catastral = $request->input('clave_catastral');
            $tipo_predio = $request->input('tipo_predio');
            $giro = $request->input('giro');

            $name = $request->input('name');
            $numero_licencia_funcionamiento_previa = $request->input('numero_licencia_funcionamiento_previa');
            $razon_social = $request->input('razon_social');
            $regimen_capital = $request->input('regimen_capital');
            $superficie_m2 = $request->input('superficie_m2');
            $nivel_recoleccion_basura = $request->input('nivel_recoleccion_basura');
            $tipo_persona = $request->input('tipo_persona');
            $persona_moral_id = $request->input('persona_moral_id');
            $ma_rfc = $request->input('ma_rfc');
            $carta_de_situacion_fiscal = '28DGY2DT';

            $giros_comerciales_ids = $request->input('giro_id');

            $direccion = Direccion::create([
                'calle_principal' => $calle_principal,
                'calles' => $calles,
                'numero_externo' => $numero_externo,
                'numero_interno' => $numero_interno,
                'colonia_id' => $colonia_id != null ? $colonia_id : -1,
                'codigo_postal' => $codigo_postal,
                'latitud' => $pos['lat'],
                'longitude' => $pos['lng'],
                'tipo' => $tipo,
                'delegacion' => $delegacion,
            ]);

            $direccion_de_notificacion_id = null;
            $direccion_notificacion = null;
            if ($tipo_direccion_notificacion == 'direccion_distinta') {
                // se crea una dirección de notificación especial solo para eso
                $direccion_notificacion = Direccion::create([
                    'calle_principal' => $dn_calle_principal,
                    'calles' => $dn_calles,
                    'numero_externo' => $dn_numero_externo,
                    'numero_interno' => $dn_numero_interno,
                    'colonia_id' => $dn_colonia_id != null ? $colonia_id : -1,
                    'codigo_postal' => $dn_codigo_postal,
                    'latitud' => 0,
                    'longitude' => 0,
                    'tipo' => $dn_tipo,
                    'delegacion' => $dn_delegacion,
                ]);
                $direccion_de_notificacion_id = $direccion_notificacion->id;
            } elseif ($tipo_direccion_notificacion == 'direccion_negocio') {
                // o utilizamos la de negocio, formulario en step 0
                $direccion_de_notificacion_id = $direccion->id;
            }

            // el prefijo `ma_` hace referencia a `persona_moral`
            $ma_direccion = null;

            // el prefijo `pf_` hace referencia a persona fisica
            $pf_direccion = null;

            if ($request->input('tipo_direccion_facturacion') === 'persona_moral') {
                $ma_direccion = Direccion::create([
                    'calle_principal' => $ma_calle_principal,
                    'calles' => $ma_calles,
                    'numero_externo' => $ma_numero_externo,
                    'numero_interno' => $ma_numero_interno,
                    'colonia_id' => $ma_colonia_id != null ? $ma_colonia_id : -1,
                    'codigo_postal' => $ma_codigo_postal,
                    'latitud' => 0,
                    'longitude' => 0,
                    'tipo' => $ma_tipo,
                    'delegacion' => $ma_delegacion,
                ]);

                if ($tipo_direccion_notificacion == 'direccion_facturacion') {
                    // reutilizamos la dirección de facturación, en este caso persona moral
                    $direccion_de_notificacion_id = $ma_direccion->id;
                }
            }
            if ($request->input('tipo_direccion_facturacion') === 'persona_fisica') {
                $pf_direccion = Direccion::create([
                    'calle_principal' => $pf_calle_principal,
                    'calles' => $pf_calles,
                    'numero_externo' => $pf_numero_externo,
                    'numero_interno' => $pf_numero_interno,
                    'colonia_id' => $pf_colonia_id != null ? $pf_colonia_id : -1,
                    'codigo_postal' => $pf_codigo_postal,
                    'latitud' => 0,
                    'longitude' => 0,
                    'tipo' => $pf_tipo,
                    'delegacion' => $pf_delegacion,
                    'direccion_de_notificacion_id' => $direccion_de_notificacion_id,
                ]);
                if ($tipo_direccion_notificacion == 'direccion_facturacion') {
                    // reutilizamos la dirección de facturación, en este persona física
                    $direccion_de_notificacion_id = $pf_direccion->id;
                }
            }
            if ($tipo_persona == 'moral') {
                $persona_moral = null;
                if ($persona_moral_id == 'nueva_persona') {
                    $persona_moral = PersonaMoral::create([
                        'razon_social' => $razon_social,
                        'rfc' => $ma_rfc,
                        'acta_constitutiva_path' => $acta_constitutiva,
                        'carta_de_situacion_fiscal' => $carta_de_situacion_fiscal,
                        'persona_id' => Auth::user()->id,
                        // si no se envió la dirección específica de la persona moral, se utiliza la del negocio
                        'direccion_id' => $ma_calle_principal != null ? $ma_direccion['id'] : $direccion['id'],
                        'regimen_fiscal' => $request->input('regimen_fiscal'),
                        'direccion_de_notificacion_id' => $direccion_de_notificacion_id,
                        'regimen_capital' => $regimen_capital,
                    ]);
                    $final_persona_moral_id = $persona_moral['id'];
                } else {
                    $final_persona_moral_id = $persona_moral_id;
                }
                DatosFacturacion::create([
                    'persona_id' => Auth::user()->id,
                    'persona_moral_id' => $final_persona_moral_id,
                    'direccion_id' => $request->input('tipo_direccion_facturacion') === 'persona_moral' ? $ma_direccion->id : $direccion->id,
                    'regimen_fiscal' => $persona_moral != null ? $persona_moral->regimen_fiscal : $persona_moral,
                    //"regimen_capital"=>$persona_moral != null ? $persona_moral->regimen_capital : $persona_moral,
                ]);
            } else {
                $user_ = User::where('id', Auth::user()->id)->first();
                $user_->regimen_fiscal = $request->input('pf_regimen_fiscal');
                if ($user_->direccion_de_notificacion_id == null) {
                    $user_->direccion_de_notificacion_id = $direccion_de_notificacion_id;
                }
                $user_->save();

                DatosFacturacion::create([
                    'persona_id' => Auth::user()->id,
                    'persona_moral_id' => $final_persona_moral_id,
                    'direccion_id' => $request->input('tipo_direccion_facturacion') === 'persona_fisica' ? $pf_direccion->id : $direccion->id,
                    'regimen_fiscal' => Auth::user()->regimen_fiscal,
                    //"regimen_capital"=>$regimen_capital,
                ]);
            }

            $tarifa_recoleccion_basura = $request->input('tarifa_recoleccion_id');

            $impacto_giro_comercial = 'bajo_impacto';

            foreach ($giros_comerciales_ids as $key => $giro_comercial_id) {
                $giroComercial = GiroComercial::find($giro_comercial_id);
                if ($giroComercial->tipo == 'mediano_alto_impacto') {
                    $impacto_giro_comercial = 'mediano_alto_impacto';
                }
            }

            //            Log::info('strtolower:tamano_empresa '.strtolower($request->input('tamano_empresa')));

            $negocio = Negocio::create([
                'direccion_id' => $direccion['id'],
                'tipo_de_negocio_id' => 1,
                'persona_id' => Auth::user()->id,
                'persona_moral_id' => $final_persona_moral_id,
                'nombre_del_negocio' => $name,
                'categoria_id' => 1,
                'catalogo_tramite_id' => 0,
                'status' => 'ENVIADO',
                'servicio_priv_recoleccion' => $servicio_priv_recoleccion,
                'impacto_giro_comercial' => $impacto_giro_comercial,
                'numero_licencia_funcionamiento_previa' => $numero_licencia_funcionamiento_previa,
                //'giro_comercial_id' => 1,
                'tarifa_recoleccion_id' => $tarifa_recoleccion_basura,
                'tipo_anuncio' => $request->input('tipo_anuncio'),
                'leyenda_anuncio' => $request->input('leyenda_anuncio'),
                'lugar_instalacion' => $request->input('lugar_instalacion'),
                'sector' => $request->input('sector'),
                'superficie_m2' => $superficie_m2,
                'cajones_estacionamiento' => $cajones_estacionamiento,
                'nivel_recoleccion_basura' => $nivel_recoleccion_basura,
                'foto_frontal_fachada' => $foto_frontal_fachada,
                'fecha_inicio_operaciones' => $request->input('fecha_inicio_operaciones'),
                'largo_anuncio' => $request->input('largo_anuncio'),
                'ancho_anuncio' => $request->input('ancho_anuncio'),
                'inversion' => $request->input('inversion'),
                'no_empleados_h' => $request->input('no_empleados_h'),
                'no_empleados_m' => $request->input('no_empleados_m'),
                // 'autoempleo' => $request->input('autoempleo'),
                'autoempleo' => strtolower($request->input('tamano_empresa')) === 'autoempleo',
                'tamano_empresa' => strtolower($request->input('tamano_empresa')),
                'empleados_cap_diferentes' => $request->input('empleados_cap_diferentes') === true ? 1 : 0,
                'telefono' => $request->input('telefono'),
                'horarios' => json_encode($request->input('horarios')),
                'clave_catastral' => $clave_catastral,
                'tipo_predio' => $tipo_predio,

                // added 7 feb 23
                'comprobante_domicilio' => $comprobante_domicilio_negocio,
                'venta_alcohol' => $venta_alcohol,
                'descripcion_actividad' => $descripcion_actividad,
                // added 2 mar 23
                'documento_predio_propiedad' => $documento_predio_propiedad,
                'tipo_predio_propiedad' => $tipo_predio_propiedad,
                // added 28 mar 23
                'tipo' => $tipo,
                // added 27 abr 23
                'camara_id' => $request->input('camara_id'),
            ]);

            /**
             * Registor trámites
             */
            $negocio_id = $negocio['id'];

            /**
             * Diferencia entre licencia de funcionamiento y refrendo, y luego
             * dependiendo de los giros asigna el ID de Sare o de alto impacto
             */
            $__tramite_id = null;
            $catalogo_tramite_default = CatalogoTramite::find($catalogo_tramite_id);
            $negocio->venta_alcohol = $this->saveNegocioGiroscomerciales($request->input('giro_id'), $negocio->id, $venta_alcohol);

            // REFACTORIZAR
            if ($catalogo_tramite_default->nombre == 'Licencia de funcionamiento') {
                if ($impacto_giro_comercial == 'mediano_alto_impacto' || $superficie_m2 >= 150 || $venta_alcohol == 1) {
                    $__tramite_id = $catalogo_tramite_default->id;
                    $impacto_giro_comercial = 'mediano_alto_impacto';
                } else {
                    $licencia_func_bajo = CatalogoTramite::where('nombre', 'Licencia de funcionamiento Sare')->first();
                    $__tramite_id = $licencia_func_bajo->id;
                }
            }

            if ($catalogo_tramite_default->nombre == 'Refrendo Licencia de funcionamiento') {
                if ($impacto_giro_comercial == 'mediano_alto_impacto' || $superficie_m2 >= 150 || $venta_alcohol == 1) {
                    $__tramite_id = $catalogo_tramite_default->id;
                    $impacto_giro_comercial = 'mediano_alto_impacto';
                } else {
                    $refrendo_bajo = CatalogoTramite::where('nombre', 'Refrendo Licencia de funcionamiento Sare')->first();
                    $__tramite_id = $refrendo_bajo->id;
                }
            }
            //actualizar si el impacto cambio con base a los m2 o venta_de alcohol
            $negocio->impacto_giro_comercial = $impacto_giro_comercial;
            $negocio->tramite_padre()->create([
                'catalogo_tramites_id' => $__tramite_id,
                'tramite_padre_id' => null,
            ]);

            /** Agergando el tramite al negocio (refrendo o licencia, sare o alto impacto) */
            $negocio->catalogo_tramite_id = $__tramite_id;
            $negocio->save();

            \DB::commit();

            return response()->json($negocio);
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }
    }

    public function createSubtramitesOrderOne(Request $request)
    {
        try {
            \DB::beginTransaction();
            //$subtramites = Subtramite::where('orden', 1)->where('catalogo_tramite_padre_id', $request->catalogo_tramite_id)->get();

            //$subtramites = Subtramite::where('catalogo_tramite_padre_id', $request->catalogo_tramite_id)
            $subtramites = Subtramite::where('orden', 1)->where('catalogo_tramite_padre_id', $request->catalogo_tramite_id)
                ->with('catalogo_tramite_hijo')
                ->orderBy('orden', 'asc')
                ->get();

            $tramite = Tramite::find($request->tramite_id);
            $negocio = Negocio::find($request->negocio_id);
            //$subtramites = Subtramite::where('orden', 1)->where('catalogo_tramite_padre_id', $catalogo_tramite_id)->get();

            foreach ($subtramites as $subtramite) {
                // $ids_to_skip = [13, 14, 15, 16];
                // if (in_array($subtramite->catalogo_tramite_hijo_id, $ids_to_skip)) {
                //     continue;
                // }

                if ($negocio->venta_alcohol != true && $subtramite->catalogo_tramite_hijo_unico->entidad_revisora_id == EntidadRevisora::$ALCOHOLES) {
                    continue;
                }

                $tramite_de_subtramite = $negocio->tramites()->create([
                    'catalogo_tramites_id' => $subtramite['catalogo_tramite_hijo_id'],
                    'tramite_padre_id' => $tramite['id'],
                ]);

                $catalogo_tramite = CatalogoTramite::find($subtramite['catalogo_tramite_hijo_id']);

                $revision = Revision::create([
                    'entidad_revision_id' => $catalogo_tramite['entidad_revisora_id'],
                    'status' => 'PENDIENTE',
                    'negocio_id' => $request->negocio_id,
                    'tramite_id' => $tramite_de_subtramite['id'],
                ]);

                if($tramite->created_at->year < now()->year) {
                    $tramite_de_subtramite->created_at = $tramite->created_at;
                    $tramite_de_subtramite->save();

                    $revision->created_at = $tramite->created_at;
                    $revision->save();
                }

                EstadoRevision::create([
                    'revision_id' => $revision['id'],
                    'status' => 'PENDIENTE',
                    'usuario_id' => Auth::user()->id,
                    'observaciones' => 'Revision iniciada',
                ]);
                //// Test1
                $persona = User::find($negocio['persona_id']);

                $this->SendMail('Trámites', $catalogo_tramite->nombre, $revision->status, $negocio['nombre_del_negocio'], [], 'Se inicio el trámite', $persona->email);
            }
            \DB::commit();

            return [
                'ok' => true,
            ];
        } catch (\Throwable $th) {
            \DB::rollback();

            return [
                'ok' => false,
                'error' => $th->getMessage(),
            ];
        }
    }

    public function saveNegocioGiroscomerciales($giros_comerciales_ids, $negocio_id, $venta_alcohol)
    {

        for ($i = 0; $i < count($giros_comerciales_ids); $i++) {
            GiroComercialNegocio::create([
                'giro_comercial_id' => $giros_comerciales_ids[$i],
                'negocio_id' => $negocio_id,
            ]);
            $venta_alcohol = $this->buscarGiroAlcohol($giros_comerciales_ids[$i], $venta_alcohol);
        }

        return $venta_alcohol;
    }

    public function buscarGiroAlcohol($giro, $venta_alcohol)
    {
        $actividades = [
            559, 494, 493, 558, 1020, 1019, 231, 232, 233, 234, 235, 236,
            559, 494, 493, 558, 1020, 1019, 231, 232, 233, 234, 235, 236, 993, 1011,
        ];

        if (in_array($giro, $actividades)) {
            return true;
        }

        return $venta_alcohol;
    }

    public function all()
    {
        $negocios = Negocio::where('persona_id', Auth::user()->id)
            ->with([
                'user',
                'resolutivos',
                'giro_comercial',
                'persona',
                'persona_moral',
                'tramites' => function ($query) {
                    $query->with('aviso_entero')
                        ->with('catalogo_tramite')
                        ->with('ultima_revision');
                },
                'tramite_padre' => fn($query) => $query->whereYear('tramites.created_at', now()->year),
            ])
            ->get();

        foreach ($negocios as $negocio) {
            $negocio['tramite_comercio_refrendo_current_year'] = $negocio->tramite_padre->filter(function ($tramite) {
                return in_array($tramite->catalogo_tramites_id, Refrendos::licenciasDeFuncionamiento());
            });
        }

        return response($negocios);
    }

    public function tramites(Request $request)
    {
        $user_id = Auth::user()->id;
        $year = $request->input('year', now()->year);

        $tramites = CatalogoTramite::where('tipo', 'publico')
            ->paraNegocios()
            ->where('entidad_revisora_id', null)
            ->get();

        $tramitesPersona = CatalogoTramite::where('tipo', 'publico')
            ->paraPersonas()
            ->where('entidad_revisora_id', null)
            ->get();

        $negocios = Negocio::where('persona_id', $user_id)
            ->with([
                'tramites.aviso_entero',
                'catalogo_tramite',
            ])
            // no se ocupa por lo que veo mas adelante
//            ->with('revisiones', function ($revisiones) {
//                $revisiones->with('tramites', function ($query) {
//                        $query->with('aviso_entero')
//                            ->with('catalogo_tramites');
//                    })
//                    ->with('condicionantesRevision.condicionante')
//                    ->with('estados_revision')
//                    ->with('entidad')
//                    ->orderBy('id');
//            })
            ->get();

        foreach ($negocios as $negocio) {
            foreach ($negocio->tramites as $tramite) {
                $avisoEntero = $tramite ? $tramite->aviso_entero : null;
                if ($avisoEntero && $avisoEntero->vigente) {
                    TramiteCargado::dispatch($tramite);
                }
            }
        }

        $mis_tramites = [];
        foreach ($negocios as $key => $negocio) {
            $tramitePadre = $negocio->getTramitePadrePorAño($year);

            if ($tramitePadre) {
                $tramitesHijos = $tramitePadre->tramites_hijos;
                $revisiones = $tramitesHijos->map(fn($th) => $th->revisions);
                $revisiones = $revisiones->merge($tramitePadre->revisiones);
                $revisiones = $revisiones->flatten();
                $revisiones->each(function ($r) {
                    $r->load([
                        'tramites.catalogo_tramites',
                        'tramites.aviso_entero',
                        'condicionantesRevision.condicionante',
                        'estados_revision',
                        'entidad',
                    ]);
                });
                array_push($mis_tramites, [
                    'id' => 'n' . $negocio->id,
                    'tramite_id' => $tramitePadre->id,
                    'nombre_tramite' => $tramitePadre->catalogo_tramite->nombre,
                    'nombre' => $negocio['nombre_del_negocio'],
                    'status' => $negocio['status'],
                    'link' => '/app/mis-tramites-negocio/' . $tramitePadre->id,
                    // 'tramites_aviso_entero'=> $negocio->tramites_comercio,
                    'revisiones' => $revisiones,
                    // 'pago' => $negocio->revisiones[0]->tramites[0]->catalogo_tramites[0]->pago,
                    // 'aviso_entero' => $negocio->revisiones[0]->tramites[0]->catalogo_tramites[0]->aviso_entero
                ]);
            }
        }
        $misTramitesPersona = Tramite::delUsuario(Auth::user())
            ->whereNull('tramite_padre_id')
            ->with(['tramites_hijos' => function ($tramite) {
                $tramite->with([
                    'aviso_entero',
                    'revisions' => function ($revision) {
                        $revision->with(['tramites.aviso_entero', 'entidad', 'estados_revision', 'tramites.catalogo_tramites']);
                    },
                ]);
            }])
            ->whereYear('created_at', $year)
            ->with('tramitable')
            ->with('ultima_revision')
            ->with('catalogo_tramite')->get();

        foreach ($misTramitesPersona as $tramitePadre) {
            foreach ($tramitePadre->tramites_hijos as $tramite) {
                $avisoEntero = $tramite ? $tramite->aviso_entero : null;
                if ($avisoEntero && $avisoEntero->vigente) {
                    TramiteCargado::dispatch($tramite);
                }
            }
        }

        $misTramitesPersona = $misTramitesPersona->map(function ($tramite) use ($user_id) {
            $res = new \StdClass();

            $persona = $tramite->tramitable;

            $res->user_id = $user_id;
            $res->tramite_id = $tramite->id;
            $res->nombre_tramite = $tramite->catalogo_tramite->nombre;
            $res->nombre = $persona->persona_id ? $persona->razon_social : $persona->apellido_pat . ' ' . $persona->apellido_mot . ', ' . $persona->nombre;
            $res->status = $tramite->ultima_revision->status;
            $res->link = '/app/mis-tramites/' . $tramite->id;
            $res->revisiones = $tramite->tramites_hijos->flatMap(function ($tramite) {
                return $tramite->revisions;
            });

            return $res;
        });

        return response([
            'mis_tramites' => $mis_tramites,
            'mis_tramites_persona' => $misTramitesPersona,
            'tramites' => $tramites,
            'tramites_persona' => $tramitesPersona,
        ]);
    }

    public function getTramitePadre($entidad_revision)
    {
        return $this->negocios->get_tramite_padre($entidad_revision);
    }

    /*$entidad_revision, $negocio_id*/
    public function getObservaciones(Request $request)
    {
    }

    public function getNegociosByFiltersSare(Request $request)
    {
        $tramites = null;
        $impacto_giro_comercial = $request['impacto_giro_comercial'];
        $estado = null;
        $avisoEntero = null;
        $year = $request['year'] ?? date('Y');
        $currentPageFront = $request['currentPage'];
        $pageSize = $request['pageSize'];

        if ($request['pago'] != null) {
            $estado = $request['pago'];
        }

        if ($estado != null && in_array('N/A', $estado)) {
            $avisoEntero = array_diff($estado, ['N/A']);
        }

        $status = $request['status'];
        $nombre_del_negocio = null;
        if ($request['nombre_del_negocio'] != null) {
            $nombre_del_negocio = $request['nombre_del_negocio'][0];
        }

        if ($request['tramites'] != null) {
            $tramites = $request['tramites'][0];
        }

        $entidad_revision = $request['entidad_revision'] ?? 1;

        $negocios = Negocio::select([
            'negocios.id',
            'nombre_del_negocio',
            'impacto_giro_comercial',
            'catalogo_tramite_id',
            'negocios.persona_id',
            'venta_alcohol',
            'negocios.persona_moral_id',
            'nivel_recoleccion_basura',
            'negocios.created_at',
        ])
            ->where('impacto_giro_comercial', 'bajo_impacto')
            ->when($nombre_del_negocio, function ($query) use ($nombre_del_negocio) {
                return $query->where('nombre_del_negocio', 'iLIKE', "%$nombre_del_negocio%");
            })
            ->when($impacto_giro_comercial, function ($query) use ($impacto_giro_comercial) {
                return $query->whereIn('impacto_giro_comercial', $impacto_giro_comercial);
            })
            ->with([
                'giro_comercial:giro_comercial.id,nombre',
                'catalogo_tramite:catalogo_tramites.id,nombre,pago',
                'licenciaAlcohol.licencia:id,clave',
                'revisiones' => function ($revisiones) use ($entidad_revision, $year) {
                    $revisiones->select('revision.id', 'negocio_id', 'status', 'created_at')
                        ->where('entidad_revision_id', $entidad_revision)
                        ->whereYear('created_at', $year)
                        ->with('negocio_requisitos_revision', fn($query) => $query->select('id', 'status', 'revision_id'))
                        ->deNegocio()
                        ->orderBy('id', 'desc');
                },
                'tramite_padre',
            ])
            ->with('tramites', function ($tramites) use ($entidad_revision, $estado, $avisoEntero, $year) {
                $tramites->with('aviso_entero', function ($query) use ($avisoEntero) {
                    $query->select('avisos_entero.tramite_id', 'estado')
                        ->when($avisoEntero, fn($q) => $query->whereIn('estado', $avisoEntero));
                })
                    ->with('catalogo_tramite', function ($query) use ($estado) {
                        $query->select('id', 'nombre', 'pago')
                            ->when($estado, function ($query) use ($estado) {
                                $query->where(function ($query) use ($estado) {
                                    if (in_array('N/A', $estado)) {
                                        $query->where('pago', false);
                                    }
                                });
                            });
                    })
                    ->whereYear('tramites.created_at', '=', $year)
                    ->tieneEntidadRevision($entidad_revision)
                    ->orderBy('id', 'asc');
            })
            ->when($tramites, function ($query) use ($tramites) {
                $query->whereHas('tramitesPadres', fn($q) => $q->where('id', $tramites));
            })
            ->whereHas('revisiones', function (Builder $revisiones) use ($entidad_revision, $status, $nombre_del_negocio, $tramites, $impacto_giro_comercial, $estado, $year) {
                $revisiones
                    ->whereYear('created_at', $year)
                    ->where('entidad_revision_id', $entidad_revision)
                    ->where(function ($query) use ($status, $nombre_del_negocio, $tramites, $impacto_giro_comercial, $estado) {
                        if ($status || $nombre_del_negocio || $tramites || $impacto_giro_comercial) {
                            // Realizar búsqueda con los valores de status proporcionados
                            if ($status != null) {
                                $query->whereIn('status', $status);
                            }
                            //                            else {
                            //                                $query->whereIn('status', ['ENVIADO', 'RECHAZADO', 'APROBADO', 'VISOR', 'EN REVISION', 'PENDIENTE']);
                            //                            }
                        } else {
                            // Realizar búsqueda excluyendo los valores 'RECHAZADO' y 'APROBADO'
                            if ($estado == null) {
                                $query->whereNotIn('status', ['RECHAZADO', 'APROBADO']);
                            }
                            //                            else {
                            //                                $query->whereIn('status', ['ENVIADO', 'RECHAZADO', 'APROBADO', 'VISOR', 'EN REVISION', 'PENDIENTE']);
                            //                            }
                        }
                    })
                    ->deNegocio($year);
            })
            ->validado()
            ->orderBy('id', 'asc')
            ->paginate(
                $perPage = $pageSize,
                $columns = ['*'],
                $pageName = 'page',
                $page = $currentPageFront
            );
        //->get();

        $perPageResult = $negocios->perPage();
        $totalResult = $negocios->total();
        $currentPageResult = $negocios->currentPage();
        $pagesCountResult = $negocios->lastPage();

        $negocios = $negocios->map(function ($negocio) use ($year) {
            $tramitePadre = $negocio->tramite_padre()->whereYear('created_at', $year)->first();
            if (!$tramitePadre) {
                return $negocio;
            }
            $negocio->setRelation('tramite_padre', $tramitePadre);
            $negocio->setAppends([]);
            unset($negocio->tramites_padres);

            return $negocio;
        });

        foreach ($negocios as $negocio) {
            foreach ($negocio->tramites as $tramite) {
                $avisoEntero = $tramite ? $tramite->aviso_entero : null;
                if ($avisoEntero && $avisoEntero->vigente) {
                    TramiteCargado::dispatch($tramite);
                }
            }
        }

        //return $negocios;
        return response()->json([
            'negocios' => $negocios,
            'perPageResult' => $perPageResult,
            'totalResult' => $totalResult,
            'currentPageResult' => $currentPageResult,
            'pagesCountResult' => $pagesCountResult,
        ]);
    }

    public function allNotApproved($entidad_revision)
    {
        if ($entidad_revision == 5) {
            $entidad_revision = 6;
        }
        $year = Carbon::now()->year;
        $negocios = Negocio::select([
            'negocios.id',
            'nombre_del_negocio',
            'impacto_giro_comercial',
            'catalogo_tramite_id',
            'negocios.persona_id',
            'venta_alcohol',
            'negocios.persona_moral_id',
            'nivel_recoleccion_basura',
            'negocios.created_at',
        ])
            ->where('impacto_giro_comercial', 'mediano_alto_impacto')
            ->with('giro_comercial:giro_comercial.id,nombre')
            ->with('catalogo_tramite:catalogo_tramites.id,nombre')
            ->with('licenciaAlcohol.licencia:id,clave')
            ->with([
                'revisiones' => function ($revisiones) use ($entidad_revision, $year) {
                    $revisiones->whereYear('revision.created_at', $year)->select(['revision.id', 'negocio_id', 'status', 'revision.created_at'])
                        ->with('negocio_requisitos_revision', function ($q) {
                            $q->select(['id', 'status', 'revision_id']);
                        })
                        ->where('entidad_revision_id', $entidad_revision)
                        ->deNegocio()
                        ->orderBy('id', 'desc');
                },
            ])
            ->with([
                'tramites' => function ($tramites) use ($entidad_revision, $year) {
                    $tramites->whereYear('tramites.created_at', $year)->select(['tramites.id', 'catalogo_tramites_id', 'tramites.created_at'])
                        ->with('aviso_entero:avisos_entero.tramite_id,estado')
                        ->with('catalogo_tramite:catalogo_tramites.id,nombre,pago')
                        ->tieneEntidadRevision($entidad_revision)
                        ->orderBy('id', 'asc');
                },
            ])
            ->whereHas('tramites', function (Builder $tramites) use ($year) {
                $tramites->whereNull('tramite_padre_id')
                    ->whereYear('created_at', $year);
            })
            ->whereHas('revisiones', function (Builder $revisiones) use ($entidad_revision) {
                $currentYear = Carbon::now()->year;
                $revisiones
                    ->whereYear('created_at', $currentYear)
                    ->where('entidad_revision_id', '=', $entidad_revision)
                    ->whereNotIn('status', ['RECHAZADO', 'APROBADO'])
                    ->deNegocio();
            })
            ->validado()
            ->orderBy('id', 'asc')
            ->get();

        $negocios = $negocios->map(function ($negocio) {
            $tramitePadre = $negocio->tramites->first(function ($tramite) {
                return $tramite->tramite_padre_id === null;
            });
            $negocio->tramite_padre = new \StdClass();
            $negocio->tramite_padre->id = $tramitePadre->id;
            $negocio->tramite_padre->negocio_id = $negocio->id;
            $negocio->tramite_padre->created_at = $tramitePadre->created_at;

            return $negocio;
        });

        foreach ($negocios as $negocio) {
            foreach ($negocio->tramites as $tramite) {
                $avisoEntero = $tramite ? $tramite->aviso_entero : null;
                if ($avisoEntero && $avisoEntero->vigente) {
                    TramiteCargado::dispatch($tramite);
                }
            }
        }

        return $negocios;
        // return $this->negocios->allNotApproved($entidad_revision);
    }

    public function allNotApprovedSare($entidad_revision, $selected_year)
    {
        $year = $selected_year;
        $negocios = Negocio::select([
            'negocios.id',
            'nombre_del_negocio',
            'impacto_giro_comercial',
            'catalogo_tramite_id',
            'negocios.persona_id',
            'venta_alcohol',
            'negocios.persona_moral_id',
            'nivel_recoleccion_basura',
            'negocios.created_at',
        ])
            ->where('impacto_giro_comercial', 'bajo_impacto')
            ->with([
                'giro_comercial:giro_comercial.id,nombre',
                'catalogo_tramite:catalogo_tramites.id,nombre',
                'licenciaAlcohol.licencia:id,clave',
                'revisiones' => function ($revisiones) use ($entidad_revision, $year) {
                    $revisiones->whereYear('revision.created_at', $year)
                        ->select(['revision.id', 'negocio_id', 'status', 'revision.created_at'])
                        ->with('negocio_requisitos_revision', function ($q) {
                            $q->select(['id', 'status', 'revision_id']);
                        })
                        ->where('entidad_revision_id', $entidad_revision)
                        ->deNegocio()
                        ->orderBy('id', 'desc');
                },
                'tramites' => function ($tramites) use ($entidad_revision, $year) {
                    $tramites->select(['tramitable_id', 'tramitable_type', 'tramites.id', 'catalogo_tramites_id', 'tramites.created_at'])
                        ->whereYear('tramites.created_at', $year)
                        ->with('aviso_entero:avisos_entero.tramite_id,estado')
                        ->with('catalogo_tramite:catalogo_tramites.id,nombre,pago')
                        ->tieneEntidadRevision($entidad_revision)
                        ->orderBy('id', 'asc');
                },
                'tramite_padre' => fn($query) => $query->whereYear('tramites.created_at', $year),
            ])
            ->whereHas('tramite_padre', fn($query) => $query->whereYear('tramites.created_at', $year))
            ->whereHas('revisiones', function (Builder $revisiones) use ($entidad_revision, $year) {
                $revisiones
                    ->whereYear('created_at', $year)
                    ->where('entidad_revision_id', '=', $entidad_revision)
                    ->whereNotIn('status', ['RECHAZADO', 'APROBADO'])
                    ->deNegocio();
            })
            ->validado()
            ->orderBy('id', 'asc')
            ->get();

        $negocios = $negocios->map(function ($negocio) {
            $tramitePadre = $negocio->tramite_padre->first();
            if (!$tramitePadre) {
                return $negocio;
            }
            unset($negocio->tramite_padre);
            $negocio->tramite_padre = new \StdClass();
            $negocio->tramite_padre->id = $tramitePadre->id;
            $negocio->tramite_padre->negocio_id = $negocio->id;
            $negocio->tramite_padre->created_at = $tramitePadre->created_at;
            $negocio->setAppends([]);

            return $negocio;
        });

        foreach ($negocios as $negocio) {
            foreach ($negocio->tramites as $tramite) {
                $avisoEntero = $tramite ? $tramite->aviso_entero : null;
                if ($avisoEntero && $avisoEntero->vigente) {
                    TramiteCargado::dispatch($tramite);
                }
            }
        }

        return $negocios;
        // return $this->negocios->allNotApproved($entidad_revision);
    }

    public function getNegociosRequisitosJSON()
    {
        try {
            \DB::commit();

            $negocios = Negocio::select('id')
                ->with(['revisiones.negocio_requisitos_revision.negocio_requisito_archivo'])
                ->whereHas('revisiones', function ($query) {
                    $query->where('status', 'APROBADO')
                        ->whereHas('negocio_requisitos_revision', function ($query) {
                            $query->where('status', 'APROBADO');
                        });
                })
                ->with([
                    'revisiones' => function ($query) {
                        $query->select('id', 'entidad_revision_id', 'negocio_id', 'status');
                        $query->where('status', 'APROBADO');
                        $query->whereHas('negocio_requisitos_revision', function ($query) {
                            $query->where('status', 'APROBADO');
                        });
                    },
                    'revisiones.negocio_requisitos_revision' => function ($query) {
                        $query->select('id', 'status', 'revision_id', 'requisito_id');
                        $query->where('status', 'APROBADO');
                    },
                    'revisiones.negocio_requisitos_revision.negocio_requisito_archivo' => function ($query) {
                        $query->select('id', 'archivo_path', 'negocio_id', 'requisito_id');
                    },
                ])
                ->orderBy('id', 'asc')
                ->get();

            foreach ($negocios as $negocio) {
                foreach ($negocio->revisiones as $revision) {
                    foreach ($revision->negocio_requisitos_revision as $negocio_requisitos_revision) {
                        if ((!empty($negocio_requisitos_revision)) && (!empty($negocio_requisitos_revision->negocio_requisito_archivo->archivo_path))) {
                            $archivo = $negocio_requisitos_revision->negocio_requisito_archivo->archivo_path;
                            if (!empty($archivo)) {
                                if (!Storage::exists($archivo)) {
                                    $negocioRequisitoRevision = NegocioRequisitoRevision::find($negocio_requisitos_revision->id);
                                    $negocioRequisitoRevision->status = 'EN REVISION';
                                    $negocioRequisitoRevision->save();
                                }
                            }
                        }
                    }
                }
            }
            \DB::commit();

            return response()->json($negocios);
        } catch (\Throwable $th) {
            \DB::rollback();
            dd($th);
        }
    }

    public function getNegociosRequisitosRechazadosJSON()
    {
        try {
            \DB::commit();

            $negocios = Negocio::select('id')
                ->with(['revisiones.negocio_requisitos_revision.negocio_requisito_archivo'])
                ->whereHas('revisiones', function ($query) {
                    $query->where('status', 'APROBADO')
                        ->whereHas('negocio_requisitos_revision', function ($query) {
                            $query->where('status', 'RECHAZADO');
                        });
                })
                ->with([
                    'revisiones' => function ($query) {
                        $query->select('id', 'entidad_revision_id', 'negocio_id', 'status');
                        $query->where('status', 'APROBADO');
                        $query->whereHas('negocio_requisitos_revision', function ($query) {
                            $query->where('status', 'RECHAZADO');
                        });
                    },
                    'revisiones.negocio_requisitos_revision' => function ($query) {
                        $query->select('id', 'status', 'revision_id', 'requisito_id');
                        $query->where('status', 'RECHAZADO');
                    },
                    'revisiones.negocio_requisitos_revision.negocio_requisito_archivo' => function ($query) {
                        $query->select('id', 'archivo_path', 'negocio_id', 'requisito_id');
                    },
                ])
                ->orderBy('id', 'asc')
                ->get();

            foreach ($negocios as $negocio) {
                foreach ($negocio->revisiones as $revision) {
                    foreach ($revision->negocio_requisitos_revision as $negocio_requisitos_revision) {
                        if ((!empty($negocio_requisitos_revision)) && (!empty($negocio_requisitos_revision->negocio_requisito_archivo->archivo_path))) {
                            $archivo = $negocio_requisitos_revision->negocio_requisito_archivo->archivo_path;
                            if (!empty($archivo)) {
                                if (!Storage::exists($archivo)) {
                                    $negocioRequisitoRevision = NegocioRequisitoRevision::find($negocio_requisitos_revision->id);
                                    $negocioRequisitoRevision->status = 'EN REVISION';
                                    $negocioRequisitoRevision->save();
                                }
                            }
                        }
                    }
                }
            }
            \DB::commit();

            return response()->json($negocios);
        } catch (\Throwable $th) {
            \DB::rollback();
            dd($th);
        }
    }

    // SCRIPT EN PROCESO
    // public function getRequisitosJSON() {

    //     try {
    //         \DB::beginTransaction();
    //         $negocio_id = 43;
    //         $year = "2023";
    //         $entidad_revision_id = 4;
    //         $revision_id = null;

    //         // Subconsulta para obtener los ID más recientes
    //         $idsMasRecientes = NegocioRequisito::onlyTrashed()
    //             ->selectRaw('MAX(id) as id')
    //             ->whereYear('created_at', 2023)
    //             //->whereYear('updated_at', 2023)
    //             //->whereYear('deleted_at', 2023)
    //             ->groupBy('negocio_id', 'requisito_id')
    //             ->pluck('id');

    //         // Consulta principal utilizando los ID más recientes
    //         $requisitos = NegocioRequisito::onlyTrashed()
    //             ->whereIn('id', $idsMasRecientes)
    //             ->with(['negocio' => function($negocio) {
    //                 $negocio->select('id');
    //             }, 'negocio_requisito_revision' => function($negocio_requisito_revision) {
    //                 $negocio_requisito_revision
    //                 ->select('id', 'revision_id', 'requisito_id', 'catalogo_id', 'estado_revision_id', 'status')
    //                 ->with(['revision' => function($q) {
    //                     $q->select('id', 'entidad_revision_id', 'negocio_id', 'tramite_id', 'status', 'created_at', 'deleted_at');
    //                 }]);
    //             }])
    //             ->whereHas('negocio_requisito_revision.revision', function($query) {
    //                 // Aquí aplicas la condición dentro de whereHas
    //                 $query->whereYear('created_at', 2023);
    //             })
    //         ->get();

    //         // Suponiendo que $requisitos es tu colección obtenida
    //         foreach ($requisitos as $requisito) {
    //             // Asumiendo que cada requisito tiene una relación 'negocio_requisito_revision'
    //             // y que dentro de esta hay una relación 'revision' de donde obtendrás el 'tramite_id'

    //             $tramiteId = $requisito->negocio_requisito_revision->revision->tramite_id ?? null;
    //             //echo("\n". $tramiteId);
    //             if ($tramiteId) {
    //                 //echo("\n". $requisito->id);
    //                 // Actualizar tramite_id y establecer deleted_at a null en NegocioRequisito
    //                 // Asegúrate de tener el ID del NegocioRequisito para poder hacer el update
    //                 $negocioRequisito = NegocioRequisito::withTrashed()
    //                 ->where('id', $requisito->id)
    //                 ->update([
    //                     'tramite_id' => $tramiteId,
    //                     'deleted_at' => null // Esto "activará" el registro
    //                 ]);

    //                 //echo("\n". $negocioRequisito);
    //             }
    //         }

    //         \DB::commit();
    //         return response()->json($requisitos);

    //     } catch (\Throwable $th) {
    //         \DB::rollback();
    //         dd($th);
    //         return false;
    //     }
    // }

    public function getTramitesCondicionantesDocumentosNegociosByYear(Request $request)
    {

        $request->validate([
            'negocio_id' => ['required'],
            'year' => ['required'],
            'entidad_revision_id' => ['required'],
        ]);

        $negocio_id = $request['negocio_id'];
        $year = $request['year'];
        $entidad_revision_id = $request['entidad_revision_id'];
        $revision_id = null;

        $revision = Revision::where('negocio_id', $negocio_id)
            ->where('entidad_revision_id', $entidad_revision_id)
            ->whereYear('created_at', $year)
            ->first();

        if ($revision != null) {
            $revision_id = $revision->tramite_id;
        }

        $negocios = Negocio::select([
            'negocios.id',
            'nombre_del_negocio',
            'impacto_giro_comercial',
            'catalogo_tramite_id',
            'negocios.persona_id',
            'venta_alcohol',
            'negocios.persona_moral_id',
            'nivel_recoleccion_basura',
            'negocios.created_at',
        ])
            ->with('giro_comercial:giro_comercial.id,nombre')
            ->with('catalogo_tramite:catalogo_tramites.id,nombre')
            ->with('licenciaAlcohol.licencia:id,clave')
            ->with('revisiones', function ($revisiones) use ($negocio_id, $year, $entidad_revision_id, $revision_id) {
                $revisiones
                    ->with('condicionantesRevision.condicionante')
                    ->with('entidad')
                    ->with('estados_revision', function ($estados_revision) use ($negocio_id, $revision_id) {
                        $estados_revision
                            ->with('requisitos', function ($requisitos) {
                                $requisitos->with('requisito', function ($requisito) {
                                    $requisito->with('archivo');
                                });
                            })
                            ->with('negocio_requisitos', function ($negocio_requisitos) use ($negocio_id, $revision_id) {
                                $negocio_requisitos
                                    ->with('requisito', function ($requisito) use ($negocio_id, $revision_id) {
                                        $requisito
                                            ->with('negocio_archivo', function ($archivo) use ($negocio_id, $revision_id) {
                                                $archivo->where('negocio_id', '=', $negocio_id);
                                                if (!is_null($revision_id)) {
                                                    $archivo->where('tramite_id', '=', $revision_id);
                                                }
                                            });
                                    })
                                    ->with('negocio_requisito_archivo', function ($negocio_requisito_archivo) use ($negocio_id) {
                                        $negocio_requisito_archivo->where('negocio_id', $negocio_id);
                                    });
                            })
                            ->orderBy('id', 'asc')
                            ->with('revisor')
                            ->get();
                    })
                    ->whereYear('created_at', $year)
                    ->where('entidad_revision_id', $entidad_revision_id)
                    ->where('negocio_id', $negocio_id);
            })
            ->whereHas('revisiones', function ($query) use ($negocio_id, $year, $entidad_revision_id) {
                $query->whereYear('created_at', $year)
                    ->where('entidad_revision_id', $entidad_revision_id)
                    ->where('negocio_id', $negocio_id);
            })
            ->where('id', $negocio_id)
            ->get();

        return response()->json($negocios);
    }

    public function documentosFaltantes(array $request, $entidad_id, $nuevo_estado_revision_id, $revision_id)
    {
        try {
            foreach ($request as $document) {
                $documento_id = $document['id'];
                //$requisito_catalogo = DB::select(DB::raw("select id from requisitos_entidad where catalogo_requisito_id = '$documento_id' and entidad_revisora_id = '$entidad_id'"));
                $requisitoCatalogo = RequisitoEntidad::where('catalogo_requisito_id', $documento_id)
                    ->where('entidad_revisora_id', $entidad_id)
                    ->select('id')
                    ->first();
                // dd($requisito_catalogo);
                NegocioRequisitoRevision::create([
                    'requisito_id' => $document['id'],
                    'revision_id' => $revision_id,
                    'catalogo_id' => $requisitoCatalogo->id,
                    'status' => 'PENDIENTE',
                    'estado_revision_id' => $nuevo_estado_revision_id,
                ]);
            }
        } catch (\Throwable $th) {
            //throw $th;
            dd($th);
        }

    }

    public function rechazarDocumentos(array $request, $revision_id)
    {
        foreach ($request as $document) {
            $documento_id = $document['id'];
            $negocio_requisito_revision = NegocioRequisitoRevision::where('requisito_id', $documento_id)
                ->where('revision_id', $revision_id)
                ->orderBy('id', 'DESC')
                ->first();
            $negocio_requisito_revision->status = 'RECHAZADO';
            $negocio_requisito_revision->save();
        }
    }

    public function rechazarDocumento(Request $request)
    {
        try {
            $documento_id = $request['id'];
            $revision_id = $request['revision_id'];
            $negocio_requisito_revision = NegocioRequisitoRevision::where('requisito_id', $documento_id)
                ->where('revision_id', $revision_id)
                ->orderBy('id', 'DESC')
                ->first();
            $negocio_requisito_revision->status = 'RECHAZADO';
            $negocio_requisito_revision->save();

            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }

    public function quitarDocumento(Request $request)
    {
        //dd($request);
        try {
            $documento_id = $request['documento_id'];
            $revision_id = $request['revision_id'];
            $negocio_requisito_revision = NegocioRequisitoRevision::where('requisito_id', $documento_id)
                ->where('revision_id', $revision_id)
                ->orderBy('id', 'DESC')
                ->first();
            $negocio_requisito_revision->delete();

            //dd($negocio_requisito_revision);
            return true;
        } catch (\Throwable $th) {
            dd($th);

            return false;
        }
    }

    public function documentoProgramaInterno($negocio_id)
    {
        $negocio = Negocio::find($negocio_id)->first();
        if ($negocio->tieneProgramaInterno) {
            $programaInterno = Requisito::where('nombre', 'Programa interno de proteccion civil')->get();

            return $programaInterno;
        } else {
            return null;
        }
    }

    public function aprobarDocumento(Request $request)
    {
        try {
            $documento_id = $request['id'];
            $revision_id = $request['revision_id'];
            $negocio_id = $request['negocio_id'];
            $negocio_requisito_revision = NegocioRequisitoRevision::where('requisito_id', $documento_id)
                ->where('revision_id', $revision_id)
                ->orderBy('id', 'DESC')
                ->first();
            // dd($negocio_requisito_revision);
            $negocio_requisito_revision->status = 'APROBADO';
            $negocio_requisito_revision->save();

            $revision = Revision::find($revision_id);
            $negocio = Negocio::find($negocio_id);

            $this->sendMailNegocios($negocio, $revision, $negocio_requisito_revision);

            return true;
        } catch (\Throwable $th) {
            //throw $th;
            return false;
        }
    }

    public function updateImpactoGiroComercial(Request $request)
    {
        try {
            \DB::beginTransaction();
            // Buscar el negocio por su identificador
            $negocio = Negocio::find($request['id']);

            // Si el negocio existe, actualizar el campo "impacto_giro_comercial"
            if ($negocio) {
                $negocio->impacto_giro_comercial = $request['impacto_giro_comercial'];
                $negocio->save();
            }
            \DB::commit();

            return true;
        } catch (\Throwable $th) {
            \DB::rollback();

            return false;
        }
    }

    public function aprobarDocumentos(array $request, $entidad_revision_id, $revision_id)
    {
        try {
            foreach ($request as $document) {
                // $documento_id = $document['id'];
                $documento_negocio_requisito_id = $document['negocio_requisito_id'];

                $entidad_revision = DB::table('entidad_revision')
                    ->select('entidad_revision.*')
                    ->join('revision', 'entidad_revision.id', '=', 'revision.entidad_revision_id')
                    ->join('negocio_requisito_revision', 'revision.id', '=', 'negocio_requisito_revision.revision_id')
                    ->where('negocio_requisito_revision.id', '=', $documento_negocio_requisito_id)
                    ->get();

                if ($entidad_revision[0]->id == $entidad_revision_id) {
                    $negocio_requisito_revision = DB::table('negocio_requisito_revision')
                        ->select('negocio_requisito_revision.*')
                        ->join('revision', 'negocio_requisito_revision.revision_id', '=', 'revision.id')
                        ->join('entidad_revision', 'revision.entidad_revision_id', '=', 'entidad_revision.id')
                        ->where('negocio_requisito_revision.id', '=', $documento_negocio_requisito_id)
                        ->update(['status' => 'APROBADO']);
                }
            }
        } catch (\Throwable $th) {
            dd('Error; ', $th);

            return false;
        }
    }

    public function createRevision($nombre_entidad, $revision, $entidadRevision, $newTramite, $fecha = null)
    {
        sleep(0.3);
        $status = 'ENVIADO';
        if (
            stripos($nombre_entidad, 'ecología') !== false ||
            stripos($nombre_entidad, 'ecologia') !== false ||
            stripos($nombre_entidad, 'ambiente') !== false
        ) {
            if (stripos($nombre_entidad, 'sare') !== false) {
                $status = 'VISOR';
            }
        }
        $revision = Revision::create([
            'tramite_id' => $newTramite->id,
            'negocio_id' => $revision->negocio_id,
            'entidad_revision_id' => $entidadRevision->entidad_revisora_id,
            'status' => $status,
        ]);

        if($fecha) {
            $revision->created_at = $fecha;
            $revision->save();
        }

        //// ENVIAR CORREO /////////////TODO Mover a una función
        $n = Negocio::find($revision->negocio_id);
        $persona = User::find($n['persona_id']);
        $tramite = Tramite::find($revision->tramite_id);
        $c_tramite = CatalogoTramite::find($tramite->catalogo_tramites_id);
        if (app()->isProduction()) {
            $this->SendMail(
                'Trámites',
                $c_tramite->nombre,
                $status,
                $n['nombre_del_negocio'],
                [],
                'Proceso de revisión de documento iniciado.',
                $persona->email
            );
        }
        ///////////////////////////////////////////////////////////////////

        if ($status == 'VISOR') {
            $estado_revision = 'APROBADO';
        } else {
            $estado_revision = 'ENVIADO';
        }
        EstadoRevision::create([
            'observaciones' => '',
            'revision_id' => $revision->id,
            'status' => $estado_revision,
        ]);
    }

    public function sendMailNegocios($negocio, $revision, $documento_aprobados)
    {
        try {
            if (app()->isProduction()) {
                $persona = User::find($negocio['persona_id']);
                $tramite = Tramite::find($revision->tramite_id);
                $c_tramite = CatalogoTramite::find($tramite->catalogo_tramites_id);
                $requisitos = [];

                if ($documento_aprobados['accepted'] === true) {
                    $item = 'Documento aprobado: ' . $documento_aprobados['nombre'];
                } else {
                    $item = 'Documento aprobado: ' . $documento_aprobados['nombre'];
                }
                array_push($requisitos, $item);

                $this->SendMail(
                    'Trámites',
                    $c_tramite->nombre,
                    'VISTO BUENO',
                    $negocio['nombre_del_negocio'],
                    $requisitos,
                    '',
                    $persona->email
                );
            }
        } catch (\Throwable $th) {
        }
    }

    public function getClavesScianEcologiaFromJson()
    {
        // Construir la ruta absoluta al archivo JSON
        $ruta = base_path('resources/data/ecologia_scian.json');

        // Verificar si el archivo existe antes de intentar obtener su contenido
        if (file_exists($ruta)) {
            // Obtener el contenido del archivo JSON
            $contenido = file_get_contents($ruta);

            // Decodificar el JSON a un array asociativo
            $datos = json_decode($contenido, true);

            return $datos;
        } else {
            // Manejar el caso donde el archivo no existe
            return null; // o lanzar una excepción, dependiendo de tus necesidades
        }
    }

    public function aprobarRevision(Request $request, ClavesScian $clavesScian)
    {
        try {

            $revision = Revision::find($request['revision_id']);
            $createTramiteEcologia = false;

            if ($revision->status != 'APROBADO' && $revision->status != 'RECHAZADO') {
                \DB::beginTransaction();
                $negocio = Negocio::with('revisiones')->where('id', $request['negocio_id'])->get();

                $negocio->status = 'ENVIADO';
                $revision = Revision::where('id', $request['revision_id'])->first();
                $revision->status = 'APROBADO';
                $revision->save();
                $revisiones = $negocio[0]->revisiones->where('entidad_revision_id', $revision->entidad_revision_id);
                $revisiones = $revisiones->filter(function ($value) {
                    return $value->created_at->year === 2024; // assuming, that your timestamp gets converted to a Carbon object.
                });

                if (count($revisiones) > 2) {
                    //dd("ACTUALIZAR LAS REVISIONES EN VEZ DE CREARLAS");
                    // $ids = $negocio[0]->revisiones->pluck('id');
                    // Revision::whereIn('id', $ids)->update(['status' => 'ENVIADO']);

                    $revisiones->each(function ($revision) {
                        if ($revision->status == 'PENDIENTE') {
                            $revision->status = 'ENVIADO';
                            $revision->save();

                            EstadoRevision::create([
                                'observaciones' => '',
                                'usuario_id' => Auth::user()->id,
                                'revision_id' => $revision->id,
                                'status' => 'ENVIADO',
                            ]);
                        }
                    });
                } else {
                    self::establecerRevisionAtendida(
                        $negocio[0]->id,
                        $revision->entidad_revision_id
                    );

                    EstadoRevision::create([
                        'observaciones' => '',
                        'usuario_id' => Auth::user()->id,
                        'revision_id' => $revision->id,
                        'status' => 'APROBADO',
                    ]);

                    $tramite = Tramite::find($revision->tramite_id);
                    $cat_tramite = $tramite->catalogo_tramites_id;
                    $tramitePadreId = $tramite->tramite_padre_id ? $tramite->tramite_padre_id : $tramite->id;
                    $tramitePadre = Tramite::find($tramitePadreId);

                    // NO BORRAR- este codigo es un fix que se debe plantear en BD, por logica de negocio, no existe uso de suelo y refrendo, solo uso de suelo sare.
                    //pero actualmente el cambio de giro cambia el uso de suelo.
                    $currentOrder = Subtramite::
                    when($tramitePadre->catalogo_tramites_id == 3 && $tramite->catalogo_tramites_id == 6, function ($q) {
                        $q->where('catalogo_tramite_padre_id', 3)
                            ->where('catalogo_tramite_hijo_id', 5);
                    }, function ($q) use ($tramitePadre, $tramite) {
                        $q->where('catalogo_tramite_padre_id', $tramitePadre->catalogo_tramites_id)
                            ->where('catalogo_tramite_hijo_id', $tramite->catalogo_tramites_id);
                    })->first();
                    //

                    $getSubtramitesCurrentOrders = Subtramite::where('catalogo_tramite_padre_id', $tramitePadre->catalogo_tramites_id)
                        ->where('orden', ($currentOrder == null && $cat_tramite == 12) ? 2 : $currentOrder->orden)
                        ->get();

                    $tramitesRevisionNotApproved = [];

                    if (count($getSubtramitesCurrentOrders) > 1) {
                        foreach ($getSubtramitesCurrentOrders as $subtramiteOrden) {
                            $tramite = Tramite::where('catalogo_tramites_id', $subtramiteOrden->catalogo_tramite_hijo_id)
                                ->where('tramite_padre_id', $tramitePadreId)
                                ->with('revisions', function ($revisions) {
                                    $revisions
                                        ->orderBy('id', 'desc')
                                        ->first();
                                })
                                ->get();

                            if (isset($tramite[0]) && isset($tramite[0]->revisions[0]) && $tramite[0]->revisions[0]->status != 'APROBADO') {
                                $tramitesRevisionNotApproved[] = $tramite;
                            }
                        }
                    }

                    //dd($tramitesRevisionNotApproved);

                    if (empty($tramitesRevisionNotApproved)) {
                        $getSubtramiteOrdenes = Subtramite::where('catalogo_tramite_padre_id', $tramitePadre->catalogo_tramites_id)
                            ->get();

                        $fetchData = false;
                        foreach ($getSubtramiteOrdenes as $subtramiteOrden) {
                            if ($subtramiteOrden->orden == (($currentOrder == null && $cat_tramite == 12) ? 2 : $currentOrder->orden) + 1) {
                                $fetchData = true;
                                break;
                            }
                        }
                        if ($fetchData == true) {
                            $subtramitesNewOrder = Subtramite::where('catalogo_tramite_padre_id', $currentOrder->catalogo_tramite_padre_id)
                                ->where('orden', (($currentOrder == null && $cat_tramite == 12) ? 2 : $currentOrder->orden) + 1)
                                ->with('catalogo_tramite_hijo')
                                ->get();

                            //// ENVIAR CORREO /////////////TODO Mover a una función
                            //$this->sendMailNegocios($negocio[0], $revision, $request['documentos_aprobados']);
                            ////////////////////////////////////////////////////////////////////

                            if (count($subtramitesNewOrder) > 0) {
                                foreach ($subtramitesNewOrder as $new_order) {
                                    //dd($subtramitesNewOrder[1]->catalogo_tramite_hijo[0]->nombre);
                                    if ($negocio[0]->venta_alcohol != true && $new_order->catalogo_tramite_hijo_unico->entidad_revisora_id == 6) {
                                        continue;
                                    }

                                    $giros_comerciales = $negocio[0]->giro_comercial;
                                    $claves_a_comparar = $clavesScian->items()->pluck('CLAVE_SCIAN');

                                    // Verifica si alguna CLAVE_SCIAN de los giros comerciales está en la lista de claves a comparar
                                    $coincidencia_encontrada = $giros_comerciales->pluck('clave_scian')->intersect($claves_a_comparar)->isNotEmpty();

                                    if ($coincidencia_encontrada == false && (stripos($new_order->catalogo_tramite_hijo[0]->nombre, "medio ambiente") !== false)) {
                                        // Prende la bandera o realiza la acción que necesites
                                        //dd($coincidencia_encontrada);
                                        continue;
                                    }

                                    if (($negocio[0]->nivel_recoleccion_basura == 'cuenta_propia' || $negocio[0]->nivel_recoleccion_basura == 'servicio_privado') && $new_order->catalogo_tramite_hijo_id == 9) {
                                        $catalogo_tramite_hijo_id = 12;
                                    } else {
                                        $catalogo_tramite_hijo_id = $new_order->catalogo_tramite_hijo_id;
                                    }

                                    $newTramite = $negocio[0]->tramites()->create([
                                        'catalogo_tramites_id' => $catalogo_tramite_hijo_id,
                                        'tramite_padre_id' => $tramitePadreId
                                    ]);

                                    $esDeAnnioAnterior = $tramitePadre->created_at->year < now()->year;

                                    if($esDeAnnioAnterior) {
                                        $newTramite->created_at = $tramitePadre->created_at;
                                        $newTramite->save();
                                    }

                                    $entidadRevision = CatalogoTramite::select('entidad_revisora_id')
                                        ->where('id', $new_order->catalogo_tramite_hijo_id)
                                        ->first();

                                    $nombre_entidad = $new_order->catalogo_tramite_hijo[0]->nombre;

                                    $fecha = $esDeAnnioAnterior ? $tramitePadre->created_at : null;

                                    $this->createRevision($nombre_entidad, $revision, $entidadRevision, $newTramite, $fecha);
                                }
                            }
                        }
                    }
                }

                // TRAMITE PADRE
                // original: array:6 [
                //     "id" => 302
                //     "catalogo_tramites_id" => 3
                //     "created_at" => "2023-01-26 15:42:52"
                //     "updated_at" => "2023-01-26 15:42:52"
                //     "tramite_padre_id" => null
                //     "deleted_at" => null
                // ]

                // TRAMITE
                // attributes: array:6 [
                //     "id" => 1267
                //     "catalogo_tramites_id" => 7
                //     "created_at" => "2023-02-07 19:51:05"
                //     "updated_at" => "2023-02-13 17:38:29"
                //     "tramite_padre_id" => 302
                //     "deleted_at" => null
                // ]

                // tramitePadreId
                // 302

                // dd($tramitePadreId);

                //$this->aprobarDocumentos($request['documentos_aprobados'], $request['entidad_revision_id'], $request['revision_id']);
            }
            \DB::commit();

            return true;
        } catch (\Throwable $th) {
            \DB::rollback();
            dd('Error; ', $th);

            return false;
        }
    }

    public function rechazarRevision(Request $request)
    {
        try {
            \DB::beginTransaction();
            $revision = null;
            $negocio = Negocio::find($request['negocio_id']);
            $negocio->status = 'RECHAZADO';
            $negocio->save();

            if ($request['entidad_revision_id'] == 1) {
                $revision = Revision::where('negocio_id', $request['negocio_id'])->first();
                $revision->status = 'RECHAZADO';
                $revision->save();

                self::establecerRevisionAtendida(
                    $negocio->id,
                    $revision->entidad_revision_id
                );
            } else {
                $revision = Revision::where('entidad_revision_id', $request['entidad_revision_id'])
                    ->where('negocio_id', $request['negocio_id'])->first();
                $revision->status = 'RECHAZADO';
                $revision->save();

                self::establecerRevisionAtendida(
                    $negocio->id,
                    $revision->entidad_revision_id
                );
            }

            EstadoRevision::create([
                'observaciones' => '',
                'usuario_id' => Auth::user()->id,
                'revision_id' => $revision->id,
                'status' => 'RECHAZADO',
            ]);

            //// ENVIAR CORREO /////////////TODO Mover a una función
            try {
                // if (app()->isProduction()) {
                $persona = User::find($negocio['persona_id']);
                $tramite = Tramite::find($revision->tramite_id);
                $c_tramite = CatalogoTramite::find($tramite->catalogo_tramites_id);
                $this->SendMail(
                    'Trámites',
                    $c_tramite->nombre,
                    'RECHAZADO',
                    $negocio['nombre_del_negocio'],
                    [],
                    '',
                    $persona->email
                );
                // }
            } catch (\Throwable $th) {
                //throw $th;
            }

            ////////////////////////////////////////////////////////////////////
            \DB::commit();

            return true;
        } catch (\Throwable $th) {
            \DB::rollback();

            return false;
        }
    }

    public function newRevision(Request $request)
    {
        //dd($request['documentos_faltantes']);
        try {
            if (Auth::user() == null) {
                return redirect('/login');
            }
            \DB::beginTransaction();
            $entidad_id = $request['entidad_id'];

            $negocio = Negocio::find($request['negocio_id']);

            self::establecerRevisionAtendida(
                $negocio->id,
                $entidad_id
            );

            $negocio->status = 'EN REVISION';
            $negocio->save();
            $nuevo_estado_revision = EstadoRevision::create([
                'revision_id' => $request['revision_id'],
                'status' => $request['status'],
                'usuario_id' => Auth::user()->id,
                'observaciones' => $request['observacion'],
            ]);

            if ($request['documentos_faltantes'] != null && count($request['documentos_faltantes']) > 0) {
                $this->documentosFaltantes($request['documentos_faltantes'], $entidad_id, $nuevo_estado_revision->id, $request['revision_id']);
            }

            if ($request['documentos_rechazados'] != null && count($request['documentos_rechazados']) > 0) {
                $this->rechazarDocumentos($request['documentos_rechazados'], $request['revision_id']);
            }
            if ($request['condicionantes'] != null && count($request['condicionantes']) > 0) {
                foreach ($request['condicionantes'] as $condicionantes) {
                    $newCondicionante = CondicionantesRevision::create([
                        'revision_id' => $request['revision_id'],
                        'condicionante_id' => $condicionantes['id'],
                        'estado_id' => 1,
                    ]);
                }
            }

            //// ENVIAR CORREO /////////////TODO Mover a una función
            try {
                // if (app()->isProduction()) {
                $persona = User::find($negocio['persona_id']);
                $revision = Revision::find($request['revision_id']);
                $tramite = Tramite::find($revision->tramite_id);
                $c_tramite = CatalogoTramite::find($tramite->catalogo_tramites_id);
                $requisitos = [];
                if (count($request['documentos_faltantes']) > 0) {
                    for ($i = 0; $i < count($request['documentos_faltantes']); $i++) {
                        array_push($requisitos, 'Documento solicitado: ' . $request['documentos_faltantes'][$i]['descripcion']);
                    }
                }

                if (count($request['documentos_rechazados']) > 0) {
                    for ($i = 0; $i < count($request['documentos_rechazados']); $i++) {
                        array_push($requisitos, 'Documento rechazado: ' . $request['documentos_rechazados'][$i]['descripcion']);
                    }
                }
                if ($request['condicionantes'] != null && count($request['condicionantes']) > 0) {
                    foreach ($request['condicionantes'] as $condicionante) {
                        array_push($requisitos, 'Condicionante: ' . $condicionante['nombre']);
                    }
                }
                $this->SendMail(
                    'Trámites',
                    $c_tramite->nombre,
                    $request['status'],
                    $negocio['nombre_del_negocio'],
                    $requisitos,
                    $request['observacion'],
                    $persona->email
                );
                // }
            } catch (\Throwable $th) {
                // return false;
            }

            ///////////////////////////////////////////////////////////////////
            \DB::commit();

            return true;
        } catch (\Throwable $th) {
            \DB::rollback();
            dd('ERROR: ', $th);

            return false;
        }
    }

    public function getEntidadDocumentos($entidad_id)
    {
        $requisitos = Requisito::join('requisitos_entidad', 'requisitos.id', '=', 'requisitos_entidad.catalogo_requisito_id')
            ->where('requisitos_entidad.entidad_revisora_id', '=', $entidad_id)
            ->select('requisitos.id', 'requisitos.nombre', 'requisitos.descripcion')
            ->whereNull('requisitos_entidad.deleted_at')
            ->get();

        return $requisitos;
    }

    public function getDetailsNoDocuments($negocio_id)
    {
        $negocioDetail = DB::select(DB::raw("select requisitos.* from requisito_revision, requisitos, revision, estados, estados_revision, negocios
        where estados_revision.id_estado = estados.id
        and estados.revision = 1
        and negocios.id = '$negocio_id'
        and not requisitos.id = requisito_revision.requisito_id"));

        return $negocioDetail;
    }

    public function detailEntity($negocio_id)
    {
        if (Auth::user() == null) {
            return redirect('/login');
        }
        $user_id = Auth::user()->id;
        $negocio = Negocio::whereRaw("id = $negocio_id AND persona_id = $user_id")
            ->with('direccion')
            ->with('persona')
            ->with('persona_moral')
            ->with('revisiones', function ($revisiones) {
                $revisiones
                    ->with('requisitos', function ($requisitos) {
                        $requisitos->with('requisito', function ($requisito) {
                            $requisito
                                ->with('archivo', function ($archivo) {
                                    $archivo->where('user_id', '=', Auth::user()->id);
                                });
                        });
                    })
                    ->with('estados_revision');
            })
            ->first();

        return response()->json($negocio);
    }

    public function getSubtramitesFromTramitePadre($tramite_padre)
    {
        $tramites = Tramite::where('catalogo_tramites_id', '=', $tramite_padre)
            ->with('subtramites')
            ->get();

        return $tramites;
    }

    public function getRequisitos()
    {
        $requisitos = Requisito::all();

        return $requisitos;
    }

    public static function establecerRevisionAtendida($negocio_id, $entidad_revisora_id)
    {
        /**
         * Actualizando elementos de ENVIADO a EN REVISION
         * eso hace que desaparezca el ícono verde de cambios en
         * la tabla de la entidad revisora
         */
        $negocio = Negocio::where('id', $negocio_id)
            ->with('revisiones', function ($revisiones) use ($entidad_revisora_id) {
                $revisiones
                    ->with(
                        'estados_revision',
                        function ($estados_revision) {
                            $estados_revision->with('negocio_requisitos', function ($q) {
                                $q->where('status', 'ENVIADO');
                            });
                        }
                    )
                    ->where('entidad_revision_id', $entidad_revisora_id)
                    ->first();
            })
            ->first();

        foreach ($negocio->revisiones as $revision) {
            foreach ($revision->estados_revision as $estado_revision) {
                foreach ($estado_revision->negocio_requisitos as $negocio_requisito) {
                    $negocio_requisito->update(['status' => 'EN REVISION']);
                }
            }
        }
    }

    public function detailsEntidadRevisora($negocio_id, $entidad_revisora_id, $selected_year)
    {
        //$year = Carbon::now()->year;
        //dd($selected_year);
        $year = $selected_year;
        $negocio = Negocio::find($negocio_id);
        $negocio->status = $negocio->status === 'APROBADO' ? 'APROBADO' : 'EN REVISION';
        $negocio->save();

        /**
         * Getting
         */
        $negocio = Negocio::where('id', $negocio_id)->
            with('licenciaAlcohol')
            ->with('direccion')
            ->with('tramite_padre', function ($tramite) use ($year) {
                $tramite->whereYear('created_at', $year);
            })
            ->with('catalogo_tramite', function ($q) {
                $q->select(['id', 'nombre']);
            })
            ->with('usuario_requisitos', function ($usuario_requisitos) {
                $usuario_requisitos->with('requisito');
            })
            ->with('persona', function ($persona_moral) {
                $persona_moral->with('direccion_notificacion');
            })
            ->with('persona_moral', function ($persona_moral) {
                $persona_moral->with('direccion_notificacion');
            })
            ->with('giro_comercial')
            ->with('revisiones', function ($revisiones) use ($negocio_id, $year, $entidad_revisora_id) {
                $revisiones
                    ->with('entidad')
                    ->with(
                        'tramites',
                        function ($tramites) {
                            $tramites
                                ->with(
                                    'subtramites',
                                    function ($subtramites) {
                                        $subtramites
                                            ->with('catalogo_tramite_hijo');
                                    }
                                )
                                ->with(
                                    'catalogo_tramites',
                                    function ($catalogo_tramites) {
                                        $catalogo_tramites
                                            ->with('entidad_revisora');
                                    }
                                );
                        }
                    )
                    ->with('estados_revision', function ($estados_revision) use ($negocio_id) {
                        $estados_revision
                            ->with(
                                'negocio_requisitos',
                                function ($negocio_requisitos) use ($negocio_id) {
                                    $negocio_requisitos
                                        ->with('requisito')
                                        ->with('negocio_requisito_archivo', function ($negocio_requisito_archivo) use ($negocio_id) {
                                            $negocio_requisito_archivo->where('negocio_id', $negocio_id);
                                        })
                                        ->get();
                                }
                            )
                            ->with('revisor')
                            //->where()
                            ->get();
                    })
                    ->whereYear('created_at', $year)
                    ->where('entidad_revision_id', $entidad_revisora_id)
                    ->get();
            })
            ->with("tramites", function($tramite){
                $tramite->with("catalogo")->with("avisos_entero");
            })
            ->first(); 
        return response()->json($negocio);
    }

    public function detallesResolutivos($negocio_id, $year)
    {
        $negocio = Negocio::where('id', $negocio_id)
            // ->where('persona_id', $user_id)
            ->with('direccion', function ($direccion) {
                $direccion->with('colonia');
            })
            ->with('licenciaAlcohol', function ($query) {
                $query->with('licencia');
            })
            ->with('tramite_padre:tramites_comercio.tramite_id as id,tramites_comercio.negocio_id')
            ->with('persona')
            ->with('persona_moral')
            ->with('giro_comercial')
            ->with('revisiones', function ($query) {
                $query->with('negocio_requisitos_revision', function ($q) {
                    $q->with('requisito');
                });
            })
            ->with('tramites', function ($query) use ($year) {
                $query->whereYear('created_at', $year)
                    ->with('avisos_entero')
                    ->with('catalogo_tramite:id,nombre,resolutivo,pago,entidad_revisora_id');
            })
            ->with('tramite_padre', function ($tramitePadre) use ($year) {
                $tramitePadre
                    ->select('tramites.id', 'tramitable_id', 'tramitable_type', 'tramites.catalogo_tramites_id', 'tramites.created_at')
                    ->whereYear('tramites.created_at', $year)
                    ->with([
                        'catalogo_tramite:catalogo_tramites.id,catalogo_tramites.nombre',
                    ]);
            })
            ->
            whereHas('tramite_padre', function (Builder $tramites) use ($year) {
                $tramites->whereYear('tramites.created_at', $year);
            })
            ->first();
        if (count($negocio['tramite_padre']) === 0) {
            $negocio['tramite_comercio_padre'] = null;
        } else {
            $negocio['tramite_comercio_padre'] = $negocio['tramite_padre'][0];
            unset($negocio['tramite_padre']);
        }
        // $subtramites_del_tramite_padre_id = $negocio->tramites_comercio[0]["tramites"][0]->catalogo_tramites_id;
        // $subtramites = Subtramite::where("catalogo_tramite_padre_id", $subtramites_del_tramite_padre_id)->with("catalogo_tramite_hijo")->get();
        // $negocio["subtramites"] = $subtramites;

        return response()->json($negocio);
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

    public function borrarNegocio(Negocio $negocio)
    {
        $el_negocio_tiene_pagos = false;
        $tramites_comercio = $negocio->tramites()->get();

        foreach ($tramites_comercio as $tramite_comercio) {
            foreach ($tramite_comercio->tramites as $tramite) {
                if ($tramite->aviso_entero && $tramite->aviso_entero->pagado) {
                    $el_negocio_tiene_pagos = true;
                    break;
                }
            }
        }

        if ($el_negocio_tiene_pagos) {
            return response()->json([
                'ok' => false,
                'message' => 'El negocio no puede ser eliminado porque tiene pagos realizados.',
            ]);
        }

        try {
            DB::beginTransaction();

            $negocio = Negocio::where('id', $negocio_id)->first();

            Revision::where('negocio_id', $negocio_id)->delete();

            foreach ($tramites_comercio as $tramite_comercio) {
                Tramite::where('id', $tramite_comercio->tramite_id)->delete();
                $tramite_comercio->delete();
            }

            $negocio->delete();

            DB::commit();

            return response()->json([
                'ok' => true,
            ]);
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollback();
        }
    }

    public function apiTurismo()
    {
        $claves = TurismoAPI::$CLAVES_SCIAN;
        $negocios = Negocio::select(
            'id',
            'nombre_del_negocio',
            'descripcion_actividad',
            'telefono',
            'horarios',
            'foto_frontal_fachada',
            'direccion_id',
            'persona_id'
        )->tieneGiroConClaveSCIAN($claves)->tieneResolutivoActivo()->with('direccion')->with('giro_comercial')->with('user')->get();

        return $negocios->map(function ($negocio) {
            $res = new \stdClass();
            $res->id = $negocio->id;
            $res->nombre = $negocio->nombre_del_negocio;
            $res->descripcion = $negocio->descripcion_actividad;
            $res->telefono = $negocio->telefono;
            $res->contribuyente_nombre = $negocio->user->nombre . ' ' . $negocio->user->apellido_pat . ' ' . $negocio->user->apellido_mot;
            $res->contribuyente_correo = $negocio->user->email;
            $res->horarios = TurismoAPI::formatearHorarios($negocio->horarios);
            $res->foto_frontal = $negocio->foto_frontal_fachada ? url($negocio->foto_frontal_fachada) : null;
            $res->direccion = $negocio->direccion ? $negocio->direccion->calle_principal . ' ' . $negocio->direccion->calles
                . ' ' . $negocio->direccion->numero_exterior . ' ' . $negocio->direccion->numero_externo : '';
            $res->latlng = $negocio->direccion ? [
                'latitude' => $negocio->direccion->latitud,
                'longitude' => $negocio->direccion->longitude,
            ] : null;
            $res->giros_comerciales = $negocio->giro_comercial->map(function ($giro) {
                return $giro->nombre;
            });

            return $res;
        });
    }

    public function updateRecoleccionPrivado(Request $request)
    {
        try {
            $year = $request['year'];
            if ($request['entidad_revision_id'] == 4) {
                $negocio = Negocio::where('id', $request['negocio_id'])->first();
                $negocio->update([
                    'nivel_recoleccion_basura' => $request['privado_o_propia'],
                    'servicio_priv_recoleccion' => ($request['privado_o_propia'] == 'servicio_privado') ? $request['empresa'] : null,
                    'tarifa_recoleccion_id' => ($request['privado_o_propia'] == 'servicio_privado') ? 94 : 93,
                ]);
                $tramite = $negocio->tramites->whereIn('catalogo_tramites_id', [12, 9])->filter(function ($value) use ($year) {

                    return $value->created_at->year == $year;
                })->first();

                $tramite->catalogo_tramites_id = 12;
                $tramite->save();
                $revision = $tramite->revisiones->first();
                $revision->status = 'ENVIADO';
                $revision->save();
                $aviso = $tramite->avisos_entero->first();

                if (isset($aviso)) {
                    $mensaje = "<strong>Numero de Aviso: </strong>{ $aviso->no_aviso}\n" .
                        "<strong>Total: </strong>{ $aviso->total}\n" .
                        "<strong>Nombre del Negocio: </strong>{$negocio->nombre_del_negocio}\n" .
                        "<strong>Estado: </strong>{ $aviso->estado}\n" .
                        "<strong>Tramite Padre: </strong>{$tramite->tramite_padre->id}\n" .
                        "<strong>Nombre del Tramite: </strong>{$tramite->catalogo_tramite->nombre}\n" .
                        "<strong>Id del Tramite: </strong>{ $aviso->tramite_id}";
                    app('App\Http\Controllers\BotTelegramController')->enviarMensaje($mensaje);
                    $aviso = AvisoEntero::where('no_aviso', $aviso->no_aviso)->where('estado', '!=', 'PAGADO')->delete();
                }

                return response()->json([
                    'ok' => true,
                    'message' => 'Se ha actualizado el tipo recoleccion de basura.',
                ]);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'ok' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function updateRecoleccionPublico(Request $request)
    {
        try {
            $year = $request['year'];
            if ($request['entidad_revision_id'] == 4) {
                $negocio = Negocio::where('id', $request['negocio_id'])->first();
                $negocio->update([
                    'nivel_recoleccion_basura' => str_replace(' ', '_', $request['periodo']),
                    'tarifa_recoleccion_id' => $request['tarifa_recoleccion_id'],
                    'servicio_priv_recoleccion' => null,
                ]);

                $tramite = $negocio->tramites->whereIn('catalogo_tramites_id', [12])->filter(function ($value) use ($year) {
                    return $value->created_at->year == $year;
                })->first();

                $tramite->catalogo_tramites_id = 9;
                $tramite->save();
                $revision = $tramite->revisiones->first();
                $revision->status = 'ENVIADO';
                $revision->save();
                $aviso = $tramite->avisos_entero->first();

                if (isset($aviso)) {
                    $mensaje = "<strong>Numero de Aviso: </strong>{ $aviso->no_aviso}\n" .
                        "<strong>Total: </strong>{ $aviso->total}\n" .
                        "<strong>Nombre del Negocio: </strong>{$negocio->nombre_del_negocio}\n" .
                        "<strong>Estado: </strong>{ $aviso->estado}\n" .
                        "<strong>Tramite Padre: </strong>{$tramite->tramite_padre->id}\n" .
                        "<strong>Nombre del Tramite: </strong>{$tramite->catalogo_tramite->nombre}\n" .
                        "<strong>Id del Tramite: </strong>{ $aviso->tramite_id}";
                    app('App\Http\Controllers\BotTelegramController')->enviarMensaje($mensaje);
                    $aviso = AvisoEntero::where('no_aviso', $aviso->no_aviso)->where('estado', '!=', 'PAGADO')->delete();
                }

                return response()->json([
                    'ok' => true,
                    'message' => 'Se ha actualizado el tipo recoleccion de basura.',
                ]);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'ok' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function getNegocioDetallesView(Negocio $negocio)
    {
        return view('comercio.informacion_negocio_detalles', ['negocio' => $negocio]);
    }

    public function detailsForNegocioQrBanner(Negocio $negocio)
    {
        $negocio->load([
            'direccion',
            'persona',
            'persona_moral'
        ]);
        return response($negocio);
    }
}
