<?php

namespace App\Http\Controllers;

use App\Helpers\Refrendos;
use App\Models\CatalogoTramite;
use App\Models\EstadoRevision;
use App\Models\GiroComercial;
use App\Models\GiroComercialNegocio;
use App\Models\Negocio;
use App\Models\NegocioDocumentoActualizado;
use App\Models\Revision;
use App\Models\Subtramite;
use App\Models\Tramite;
use App\Models\User;
use App\Services\TramitesComercio;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RefrendosByYearController extends Controller
{
    public function resetComprobanteDomicilioANegociosConRefrendo2024()
    {
        $year = 2024;
        // ESTA FUNCION TIENE QUE DESAPARECER por:
        //        $negocios_tramites = DB::select('SELECT * FROM get_negocios_tramites_comercio(?)', [$year]);
        $negocios_tramites = TramitesComercio::fetch($year)->get();

        foreach ($negocios_tramites as $negocio_tramite) {
            // Acceder a las propiedades del objeto utilizando la notación de flecha
            $negocio = $negocio_tramite->tramitable;

            if ($negocio !== null && $negocio->comprobante_domicilio != null) {
                $data = [
                    'negocio_id' => $negocio->id,
                    'docto' => 'Comprobante de domicilio',
                    'ruta' => $negocio->comprobante_domicilio,
                    'tramite_id' => $negocio->tramite_comercio_padre->id,
                    'año_refrendo' => 2023,
                ];
                // Create a new NegocioDocumentoActualizado record
                NegocioDocumentoActualizado::create($data);

                $negocio->comprobante_domicilio = null;
                $negocio->save();
            }
        }

        return $negocios_tramites;
    }

    public function CrearRefrendoIndividualParaAñoEnCurso(Request $request)
    {
        try {
            DB::beginTransaction();

            $negocio = Negocio::find($request->negocio_id);
            $huboCambioDeGiros = false;
            if ($request->hasUpdates === true) {

                $newGirosIds = $request->girosIds;
                $currentGirosNegocios = GiroComercialNegocio::where('negocio_id', $negocio->id)->get();

                foreach ($currentGirosNegocios as $giroComercio) {
                    if (in_array($giroComercio->giro_comercial_id, $newGirosIds) === false) {
                        $giroComercio->delete();
                    } else {
                        $newGirosIds = array_diff($newGirosIds, [$giroComercio->giro_comercial_id]);
                    }
                }
                if (count($newGirosIds) > 0) {
                    $huboCambioDeGiros = true;
                    foreach ($newGirosIds as $newGirosId) {
                        GiroComercialNegocio::create([
                            'giro_comercial_id' => $newGirosId,
                            'negocio_id' => $negocio->id,
                        ]);
                    }
                }

                $negocio->ancho_anuncio = $request->ancho_anuncio;
                $negocio->empleados_cap_diferentes = $request->empleados_cap_diferentes;
                $negocio->horarios = $request->horarios;
                $negocio->impacto_giro_comercial = $request->impacto_giro_comercial;
                $negocio->inversion = $request->inversion;
                $negocio->largo_anuncio = $request->largo_anuncio;
                $negocio->leyenda_anuncio = $request->leyenda_anuncio;
                $negocio->lugar_instalacion = $request->lugar_instalacion;
                $negocio->no_empleados_h = $request->no_empleados_h;
                $negocio->no_empleados_m = $request->no_empleados_m;
                $negocio->sector = $request->sector;
                $negocio->tipo_anuncio = $request->tipo_anuncio;
                $negocio->venta_alcohol = $request->venta_alcohol;
                $negocio->tamano_empresa = $request->tamano_empresa;
                $negocio->superficie_m2 = $request->superficie_m2;
                $negocio->nombre_del_negocio = $request->nombre_del_negocio;
                $negocio->save();

            }

            $SCIAN_CODES_TO_CREATE_TRAMITE_MEDIO_AMBIENTE = config('constants.SCIAN_CREATE_MEDIO_AMBIENTE');
            $currentGirosIds = GiroComercialNegocio::where('negocio_id', $negocio->id)->get();
            $girosIdsToCreateTramiteMedioAmbiente = GiroComercial::whereIn('clave_scian', $SCIAN_CODES_TO_CREATE_TRAMITE_MEDIO_AMBIENTE)->get();
            $intersect = $currentGirosIds->pluck('giro_comercial_id')->intersect($girosIdsToCreateTramiteMedioAmbiente->pluck('id'));

            $generarTramiteEcologiaAltoImpacto = count($intersect) > 0;

            $generarDictamenUsoSuelo = $negocio->impacto_giro_comercial === 'mediano_alto_impacto' && $huboCambioDeGiros === true;

            $year = now()->year;

            $hasRefrendos = Tramite::where('tramitable_id', $negocio->id)->whereIn("catalogo_tramites_id", Refrendos::licenciasDeFuncionamiento())
                ->whereYear("created_at", $year)
                ->get();

            if (count($hasRefrendos) == 0) {

                if ($negocio->impacto_giro_comercial == 'mediano_alto_impacto' || $negocio->superficie_m2 >= 150 || $negocio->venta_alcohol == 1 || $generarDictamenUsoSuelo === true) {
                    $refrendo = CatalogoTramite::where('nombre', 'Refrendo Licencia de funcionamiento')->first();
                } else {
                    $refrendo = CatalogoTramite::where('nombre', 'Refrendo Licencia de funcionamiento Sare')->first();
                }
                $__tramite_id = $refrendo->id;

                $tramite = $negocio->tramites()->create([
                    'catalogo_tramites_id' => $__tramite_id,
                ]);

                $this->crearTramitesParaRecoleccionDeBasura($negocio, $tramite);

                /** Agergando el tramite al negocio (refrendo o licencia, sare o alto impacto) */
                $negocio->catalogo_tramite_id = $__tramite_id;

                $currentYear = Carbon::now()->year;
                $data = [
                    'negocio_id' => $negocio->id,
                    'docto' => 'Comprobante de domicilio',
                    'ruta' => $negocio['comprobante_domicilio'],
                    'tramite_id' => $tramite->id,
                    'año_refrendo' => $currentYear,
                ];

                // Create a new NegocioDocumentoActualizado record
                $documento = NegocioDocumentoActualizado::create($data);

                $negocio->save();

                $subtramites = Subtramite::where('orden', 1)->where('catalogo_tramite_padre_id', $__tramite_id)->get();
                $generateAllSubtramites = true;
                $tramiteUsoSuelo = [5, 6];

                foreach ($subtramites as $subtramite) {
                    $catalogoTramiteId = $subtramite['catalogo_tramite_hijo_id'];

                    // 5 y 6 son los catalogo id para los tramites de "Uso de Suelo Sare" y "Uso de Suelo" respectivamente
                    if ($generarDictamenUsoSuelo && in_array($generarDictamenUsoSuelo, $tramiteUsoSuelo)) {
                        $catalogoTramiteId = 6;
                        $generateAllSubtramites = false;
                    }

                    $tramite_de_subtramite = $negocio->tramites()->create([
                        'catalogo_tramites_id' => $catalogoTramiteId,
                        'tramite_padre_id' => $tramite->id,
                    ]);

                    $catalogo_tramite = CatalogoTramite::find($catalogoTramiteId);

                    $revision = Revision::create([
                        'entidad_revision_id' => $catalogo_tramite['entidad_revisora_id'],
                        'status' => $generarDictamenUsoSuelo ? 'ENVIADO' : 'VISOR',
                        'negocio_id' => $negocio->id,
                        'tramite_id' => $tramite_de_subtramite['id'],
                    ]);
                    EstadoRevision::create([
                        'revision_id' => $revision->id,
                        'status' => $generarDictamenUsoSuelo ? 'ENVIADO' : 'APROBADO',
                        'usuario_id' => Auth::user()->id,
                        'observaciones' => 'Revision iniciada',
                    ]);

                    $persona = User::find($negocio['persona_id']);

                    // Cambiar por Notifications
                    self::SendMail('Trámites', $catalogo_tramite->nombre, $revision->status, $negocio['nombre_del_negocio'], [], 'Se inicio el trámite', $persona->email);
                }
                if ($generateAllSubtramites === true) {
                    $subtramites = Subtramite::where('orden', 2)->where('catalogo_tramite_padre_id', $__tramite_id)->get();
                    foreach ($subtramites as $subtramite) {
                        if (in_array($subtramite['catalogo_tramite_hijo_id'], [13, 14, 15, 16]) && $negocio->venta_alcohol != true) {
                            continue;
                        }
                        if (in_array($subtramite['catalogo_tramite_hijo_id'], [9, 12])) {
                            continue;
                        }
                        $catalogoTramiteId = $subtramite['catalogo_tramite_hijo_id'];
                        //10 y 11 son los catalogo id para los tramites "Medio Ambiente Sare" y  "Dictamen de Medio Ambiente" respectivamente
                        if ($generarTramiteEcologiaAltoImpacto === true && $catalogoTramiteId === 10) {
                            $catalogoTramiteId = 11;
                        }
                        if ($generarTramiteEcologiaAltoImpacto === false && $catalogoTramiteId === 11) {
                            $catalogoTramiteId = 10;
                        }

                        $tramite_de_subtramite = $negocio->tramites()->create([
                            'catalogo_tramites_id' => $catalogoTramiteId,
                            'tramite_padre_id' => $tramite['id'],
                        ]);

                        $catalogo_tramite = CatalogoTramite::find($catalogoTramiteId);
                        if ($catalogo_tramite->id == 10) {
                            $revision = Revision::create([
                                'entidad_revision_id' => $catalogo_tramite['entidad_revisora_id'],
                                'status' => 'VISOR',
                                'negocio_id' => $negocio->id,
                                'tramite_id' => $tramite_de_subtramite->id,
                            ]);
                            EstadoRevision::create([
                                'revision_id' => $revision->id,
                                'status' => 'APROBADO',
                                'usuario_id' => Auth::user()->id,
                                'observaciones' => 'Revision iniciada',
                            ]);
                        } else {
                            $revision = Revision::create([
                                'entidad_revision_id' => $catalogo_tramite['entidad_revisora_id'],
                                'status' => 'ENVIADO',
                                'negocio_id' => $negocio->id,
                                'tramite_id' => $tramite_de_subtramite['id'],
                            ]);
                            EstadoRevision::create([
                                'revision_id' => $revision->id,
                                'status' => 'ENVIADO',
                                'usuario_id' => Auth::user()->id,
                                'observaciones' => 'Revision iniciada',
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return response()->json($negocio);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function CrearRefrendosParaAñoEnCurso(Request $request)
    {
        try {
            if (Auth::user() == null) {
                return redirect('/login');
            }

            DB::beginTransaction();
            $negocios = Negocio::whereIn('id', $request->negocio_ids)->get();
            foreach ($negocios as $negocio) {
                $year = now()->year;
                $hasRefrendos = Tramite::where('tramitable_id', $negocio->id)->whereIn("catalogo_tramites_id", [3, 4])
                    ->whereYear("created_at", $year)
                    ->get();
                if (count($hasRefrendos) > 0) {
                    continue;
                }
                $__tramite_id = null;
                if ($negocio->impacto_giro_comercial == 'mediano_alto_impacto' || $negocio->superficie_m2 >= 150 || $negocio->venta_alcohol == 1) {
                    $refrendo = CatalogoTramite::where('nombre', 'Refrendo Licencia de funcionamiento')->first();
                } else {
                    $refrendo = CatalogoTramite::where('nombre', 'Refrendo Licencia de funcionamiento Sare')->first();
                }
                $__tramite_id = $refrendo->id;
                $tramite = $negocio->tramites()->create([
                    'catalogo_tramites_id' => $__tramite_id,
                    'tramite_padre_id' => null,
                ]);

                /** Agergando el tramite al negocio (refrendo o licencia, sare o alto impacto) */
                $negocio->catalogo_tramite_id = $__tramite_id;
                $negocio_id = $negocio->id;

                $currentYear = Carbon::now()->year;
                $data = [
                    'negocio_id' => $negocio['id'],
                    'docto' => 'Comprobante de domicilio',
                    'ruta' => $negocio['comprobante_domicilio'],
                    'tramite_id' => $tramite['id'],
                    'año_refrendo' => $currentYear,
                ];

                // Create a new NegocioDocumentoActualizado record
                $documento = NegocioDocumentoActualizado::create($data);

                //$negocio['comprobante_domicilio'] = null;
                $negocio->save();

                $this->crearTramitesParaRecoleccionDeBasura($negocio, $tramite);

                $subtramites = Subtramite::where('orden', 1)->where('catalogo_tramite_padre_id', $__tramite_id)->get();

                foreach ($subtramites as $subtramite) {
                    $tramite_de_subtramite = $negocio->tramites()->create([
                        'catalogo_tramites_id' => $subtramite['catalogo_tramite_hijo_id'],
                        'tramite_padre_id' => $tramite['id'],
                    ]);

                    $catalogo_tramite = CatalogoTramite::find($subtramite['catalogo_tramite_hijo_id']);

                    $revision = Revision::create([
                        'entidad_revision_id' => $catalogo_tramite['entidad_revisora_id'],
                        'status' => 'VISOR',
                        'negocio_id' => $negocio_id,
                        'tramite_id' => $tramite_de_subtramite['id'],
                    ]);
                    EstadoRevision::create([
                        'revision_id' => $revision['id'],
                        'status' => 'APROBADO',
                        'usuario_id' => Auth::user()->id,
                        'observaciones' => 'Revision iniciada',
                    ]);

                    $persona = User::find($negocio['persona_id']);
                    if (app()->isProduction()) {
                        self::SendMail('Trámites', $catalogo_tramite->nombre, $revision->status, $negocio['nombre_del_negocio'], [], 'Se inicio el trámite', $persona->email);
                    }
                }

                $subtramites = Subtramite::where('orden', 2)->where('catalogo_tramite_padre_id', $__tramite_id)->get();

                foreach ($subtramites as $subtramite) {
                    if (in_array($subtramite['catalogo_tramite_hijo_id'], [13, 14, 15, 16]) && $negocio->venta_alcohol != true) {
                        continue;
                    }
                    if (in_array($subtramite['catalogo_tramite_hijo_id'], [9, 12])) {
                        continue;
                    }
                    $tramite_de_subtramite = $negocio->tramites()->create([
                        'catalogo_tramites_id' => $subtramite['catalogo_tramite_hijo_id'],
                        'tramite_padre_id' => $tramite['id'],
                    ]);

                    $catalogo_tramite = CatalogoTramite::find($subtramite['catalogo_tramite_hijo_id']);

                    if ($catalogo_tramite->id == 10) {
                        $revision = Revision::create([
                            'entidad_revision_id' => $catalogo_tramite['entidad_revisora_id'],
                            'status' => 'VISOR',
                            'negocio_id' => $negocio_id,
                            'tramite_id' => $tramite_de_subtramite['id'],
                        ]);
                        EstadoRevision::create([
                            'revision_id' => $revision['id'],
                            'status' => 'APROBADO',
                            'usuario_id' => Auth::user()->id,
                            'observaciones' => 'Revision iniciada',
                        ]);
                    } else {
                        $revision = Revision::create([
                            'entidad_revision_id' => $catalogo_tramite['entidad_revisora_id'],
                            'status' => 'ENVIADO',
                            'negocio_id' => $negocio_id,
                            'tramite_id' => $tramite_de_subtramite['id'],
                        ]);
                        EstadoRevision::create([
                            'revision_id' => $revision['id'],
                            'status' => 'ENVIADO',
                            'usuario_id' => Auth::user()->id,
                            'observaciones' => 'Revision iniciada',
                        ]);
                    }
                }
            }
            DB::commit();

            return response()->json($negocio);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
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

    /**
     * Crear tramites para recoleccion de basura.
     */
    protected function crearTramitesParaRecoleccionDeBasura(Negocio $negocio, Tramite $tramite)
    {
        $data = [
            'catalogo_tramites_id' => 9, // Contrato de Recoleccion de Basura
            'tramite_padre_id' => $tramite->id,
        ];

        if (in_array($negocio->nivel_recoleccion_basura, ['cuenta_propia', 'servicio_privado'])) {
            $data['catalogo_tramites_id'] = 12; // Recoleccion de Basura Externo
        }

        $tramiteBasura = $negocio->tramites()->create($data);

        $revision = Revision::create([
            'entidad_revision_id' => $tramiteBasura->catalogo->entidad_revisora_id,
            'status' => 'ENVIADO',
            'negocio_id' => $negocio->id,
            'tramite_id' => $tramiteBasura->id,
        ]);

        $revision->estados_revision()->create([
            'status' => 'ENVIADO',
            'usuario_id' => Auth::user()->id,
            'observaciones' => 'Revision iniciada',
        ]);
    }
}
