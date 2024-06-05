<?php

namespace App\Http\Controllers;

use App\Imports\RequisitosRefrendoLicenciaAlcoholImport;
use App\Models\CatalogoTramite;
use App\Models\CatalogoTramiteRequisito;
use App\Models\DatosFacturacion;
use App\Models\Direccion;
use App\Models\EstadoRevision;
use App\Models\Negocio;
use App\Models\PersonaMoral;
use App\Models\RequisitoRevision;
use App\Models\Revision;
use App\Models\Subtramite;
use App\Models\Tramite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

class TramiteController extends Controller
{
    private $entidades_revision = [1, 2, 3, 4];

    private $entidadesRevision = [
        'uso_de_suelo' => 1,
        'proteccion_civil' => 2,
        'medio_ambiente' => 3,
        'servicios_publicos' => 4,
    ];

    private $tramitesValidados = [
        'comercio' => 0,
        'uso_de_suelo' => 0,
        'proteccion_civil' => 0,
        'servicios_publicos' => 0,
        'medio_ambiente' => 0,
    ];

    // ESTE METODO NO SE USA EN NINGUNA PARTE
    public function totalTramitesValidadosComercio()
    {
        $tramitesValidadosComercio = Tramite::whereNull('tramite_padre_id')
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) {
                $query->where('validado_por', '<>', '0');
            })
            ->count();

        return response()->json($tramitesValidadosComercio);
    }

    public function iniciarTramite(Request $request)
    {
        $catalogoTramite = CatalogoTramite::find($request->catalogo_tramites_id);

        if (! $catalogoTramite || $catalogoTramite->esTipoNegocio()) {
            abort(404);
        }

        return $this->iniciarTramitePersona($request);
    }

    public function iniciarTramitePersona(Request $request)
    {
        $catalogoTramitesId = $request->catalogo_tramites_id;

        try {
            DB::beginTransaction();

            $datosPersona = $request->datos_persona;
            $persona = self::registrarPersona($datosPersona);

            $tramitePadre = $persona->tramites()->create([
                'catalogo_tramites_id' => $catalogoTramitesId,
                'tramite_padre_id' => null,
            ]);

            $revisionPadre = Revision::create([
                'entidad_revision_id' => 0,
                'status' => 'ENVIADO',
                'negocio_id' => 0,
                'tramite_id' => $tramitePadre->id,
            ]);

            $estadoRevisionPadre = EstadoRevision::create([
                'revision_id' => $revisionPadre->id,
                'status' => 'ENVIADO',
                'usuario_id' => Auth::user()->id,
                'observaciones' => 'Revision iniciada',
            ]);

            $subtramites = Subtramite::where('orden', 1)
                ->where('catalogo_tramite_padre_id', $catalogoTramitesId)
                ->get();

            foreach ($subtramites as $subtramite) {
                $tramiteHijo = $persona->tramites()->create([
                    'catalogo_tramites_id' => $subtramite->catalogo_tramite_hijo_id,
                    'tramite_padre_id' => $tramitePadre->id,
                ]);

                $revision = Revision::create([
                    'entidad_revision_id' => $subtramite->catalogo_tramite_hijo_unico->entidad_revisora_id,
                    'status' => 'ENVIADO',
                    'negocio_id' => 0,
                    'tramite_id' => $tramiteHijo->id,
                ]);

                $estadoRevision = EstadoRevision::create([
                    'revision_id' => $revision->id,
                    'status' => 'ENVIADO',
                    'usuario_id' => Auth::user()->id,
                    'observaciones' => 'Revision iniciada',
                ]);

                $catalogoTramitesRequisitos = CatalogoTramiteRequisito::where(
                    'catalogo_tramites_id',
                    $tramiteHijo->catalogo_tramites_id
                )->get();

                foreach ($catalogoTramitesRequisitos as $catalogoTramiteRequisito) {
                    $requisitoRevision = RequisitoRevision::create([
                        'requisito_id' => $catalogoTramiteRequisito->requisito_id,
                        'revision_id' => $revision->id,
                        'estado_revision_id' => $estadoRevision->id,
                        'status' => 'PENDIENTE',
                    ]);
                }

                $this->SendMailTramitePersona('Trámites', $tramitePadre->catalogo_tramite->nombre, $revision->status, $persona->nombre, [], 'Se inicio el trámite', $persona->email);
            }

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
        }

        return $tramitePadre;
    }

    public function detallesTramitePadre($tramiteId)
    {
        $userId = Auth::user()->id;

        $tramite = Tramite::delUsuario(Auth::user())
            ->whereNull('tramite_padre_id')
            ->where('id', $tramiteId)
            ->firstOrFail();

        $persona = $tramite->tramitable;

        $tramite->load([
            'tramites_hijos' => function ($tramite) use ($persona) {
                $tramite->with([
                    'ultima_revision.estados_revision.requisitos.requisito.persona_requisito' => function ($query) use ($persona) {
                        $query->where([
                            'persona_type' => $persona::class,
                            'persona_id' => $persona->id,
                        ]);
                    },
                    'aviso_entero',
                    'catalogo_tramites',
                ])->has('ultima_revision');
            },
            'catalogo_tramites',
            'tramitable',
        ]);

        $tramite->tramites = $tramite->tramites_hijos->map(function ($tramite) {
            $tramite->revision_status = $tramite->ultima_revision->status;

            return $tramite;
        });

        unset($tramite->tramites_hijos);

        return $tramite;
    }

    public function rechazar(Request $request, $tramiteId)
    {
        $user = Auth::user();

        if ($user->entidad_revision_id == null) {
            abort(401);
        }

        $tramitePadreId = $tramiteId;
        $entidadRevisionId = $user->entidad_revision_id;

        try {
            DB::beginTransaction();

            if ($entidadRevisionId == 6 || $entidadRevisionId == 5) {
                $tramiteHijo = Tramite::where('tramite_padre_id', $tramitePadreId)->
                whereHas('ultima_revision', function ($revision) {
                    $revision->where('entidad_revision_id', 6);
                })->first();
            } else {
                $tramiteHijo = Tramite::where('tramite_padre_id', $tramitePadreId)->
                whereHas('ultima_revision', function ($revision) use ($entidadRevisionId) {
                    $revision->where('entidad_revision_id', $entidadRevisionId);
                })->first();
            }

            $revision = $tramiteHijo->ultima_revision;

            if (! $revision->enRevision) {
                abort(400, 'Este tramite ya ha sido aprobado o rechazado.');
            }

            $revision->status = 'RECHAZADO';
            $revision->save();

            $revision->estados_revision()->create([
                'status' => 'RECHAZADO',
                'usuario_id' => $user->id,
                'observaciones' => '',
            ]);

            $revision->requisito_revision()->enRevision()->update([
                'status' => 'RECHAZADO',
            ]);

            $tramiteHijo->load('ultima_revision');

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
        }

        return $tramiteHijo;
    }

    public function aprobar(Request $request, $tramiteId)
    {
        $user = Auth::user();

        if ($user->entidad_revision_id == null) {
            abort(401);
        }

        $tramitePadreId = $tramiteId;
        $entidadRevisionId = $user->entidad_revision_id;

        try {
            DB::beginTransaction();

            if ($entidadRevisionId == 6 || $entidadRevisionId == 5) {
                $tramiteHijo = Tramite::where('tramite_padre_id', $tramitePadreId)->
                whereHas('ultima_revision', function ($revision) {
                    $revision->where('entidad_revision_id', 6);
                })->first();
            } else {
                $tramiteHijo = Tramite::where('tramite_padre_id', $tramitePadreId)->
                whereHas('ultima_revision', function ($revision) use ($entidadRevisionId) {
                    $revision->where('entidad_revision_id', $entidadRevisionId);
                })->first();
            }

            $revision = $tramiteHijo->ultima_revision;

            if (! $revision->enRevision) {
                abort(400, 'Este tramite ya ha sido aprobado o rechazado.');
            }

            $revision->status = 'APROBADO';
            $revision->save();

            $revision->estados_revision()->create([
                'status' => 'APROBADO',
                'usuario_id' => $user->id,
                'observaciones' => '',
            ]);

            $revision->requisito_revision()->enRevision()->update([
                'status' => 'APROBADO',
            ]);

            $tramiteHijo->load('ultima_revision');

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
        }

        return $tramiteHijo;
    }

    public function revision(Request $request, $tramiteId)
    {
        $user = Auth::user();

        if ($user->entidad_revision_id == null) {
            abort(401);
        }

        $tramitePadreId = $tramiteId;
        $entidadRevisionId = $user->entidad_revision_id;

        try {
            DB::beginTransaction();

            $observaciones = $request->input('observaciones', '');
            $requisitosSolicitados = array_map(function ($requisito) {
                return $requisito['id'];
            }, $request->requisitos_solicitados);
            $requisitosRechazados = array_map(function ($requisito) {
                return $requisito['id'];
            }, $request->requisitos_rechazados);

            if ($entidadRevisionId == 6 || $entidadRevisionId == 5) {
                $tramiteHijo = Tramite::where('tramite_padre_id', $tramitePadreId)->
                whereHas('ultima_revision', function ($revision) {
                    $revision->where('entidad_revision_id', 6);
                })->first();
            } else {
                $tramiteHijo = Tramite::where('tramite_padre_id', $tramitePadreId)->
                whereHas('ultima_revision', function ($revision) use ($entidadRevisionId) {
                    $revision->where('entidad_revision_id', $entidadRevisionId);
                })->first();
            }

            $revision = $tramiteHijo->ultima_revision;

            if (! $revision->enRevision) {
                abort(400, 'Este tramite ya ha sido aprobado o rechazado.');
            }

            $revision->status = 'EN REVISION';
            $revision->save();

            $estadoRevision = $revision->estados_revision()->create([
                'status' => 'EN REVISION',
                'usuario_id' => $user->id,
                'observaciones' => $observaciones,
            ]);

            $revision->requisito_revision()->enRevision()->update([
                'status' => 'EN REVISION',
            ]);

            $revision->requisito_revision()->enRevision()->
                whereIn('id', $requisitosRechazados)->update([
                    'status' => 'RECHAZADO',
                ]);

            foreach ($requisitosSolicitados as $requisito) {
                $revision->requisito_revision()->create([
                    'requisito_id' => $requisito,
                    'estado_revision_id' => $estadoRevision->id,
                    'status' => 'PENDIENTE',
                ]);
            }

            $tramiteHijo->load('ultima_revision');

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
        }

        return $tramiteHijo;
    }

    public static function registrarPersona($datosPersona)
    {
        $esMoral = $datosPersona['tipo_persona'] == 'moral';

        if ($esMoral && $datosPersona['persona_moral_id'] != 'nueva_persona') {
            return PersonaMoral::findOrFail($datosPersona['persona_moral_id']);
        }

        if ($esMoral) {
            $carta_de_situacion_fiscal = '28DGY2DT';

            $acta_constitutiva = $datosPersona['acta_constitutiva'];
            $razon_social = $datosPersona['razon_social'];
            $regimen_capital = $datosPersona['regimen_capital'];
            $regimen_fiscal = $datosPersona['regimen_fiscal'];
            $rfc = $datosPersona['ma_rfc'];

            // Puse la validacion aqui por lo pronto.
            if(PersonaMoral::where('rfc', trim($rfc))->first()) {
                throw ValidationException::withMessages(['rfc' => 'El rfc ingresado esta en registrado por otra persona moral.']);
            }

            $personaMoral = PersonaMoral::create([
                'razon_social' => $razon_social,
                'rfc' => $rfc,
                'acta_constitutiva_path' => $acta_constitutiva,
                'carta_de_situacion_fiscal' => $carta_de_situacion_fiscal,
                'persona_id' => Auth::user()->id,
                'direccion_id' => 0,
                'regimen_fiscal' => $regimen_fiscal,
                'direccion_de_notificacion_id' => 0,
                'regimen_capital' => $regimen_capital,
            ]);

            $ma_calle_principal = $datosPersona['ma_calle_principal'];
            $ma_calles = $datosPersona['ma_calles'];
            $ma_codigo_postal = $datosPersona['ma_codigo_postal'];
            $ma_colonia_id = $datosPersona['ma_colonia_id'];
            $ma_numero_externo = $datosPersona['ma_numero_externo'];
            $ma_numero_interno = $datosPersona['ma_numero_interno'];
            $ma_tipo = '';

            $direccionFacturacion = Direccion::create([
                'calle_principal' => $ma_calle_principal,
                'calles' => $ma_calles,
                'numero_externo' => $ma_numero_externo,
                'numero_interno' => $ma_numero_interno,
                'colonia_id' => $ma_colonia_id != null ? $ma_colonia_id : -1,
                'codigo_postal' => $ma_codigo_postal,
                'latitud' => 0,
                'longitude' => 0,
                'tipo' => $ma_tipo,
            ]);

            $dn_calle_principal = null;
            if ($datosPersona['tipo_direccion_notificacion'] != 'existente') {
                if (array_key_exists('dn_calle_principal', $datosPersona)) {
                    $dn_calle_principal = $datosPersona['dn_calle_principal'];
                    $dn_calles = $datosPersona['dn_calles'];
                    $dn_codigo_postal = $datosPersona['dn_codigo_postal'];
                    $dn_colonia_id = $datosPersona['dn_colonia_id'];
                    $dn_numero_externo = $datosPersona['dn_numero_externo'];
                    $dn_numero_interno = $datosPersona['dn_numero_interno'];
                    $dn_tipo = '';
                    $dn_colonia_id = $datosPersona['dn_colonia_id'];
                }

                $direccionNotificacion = $dn_calle_principal ? Direccion::create([
                    'calle_principal' => $dn_calle_principal,
                    'calles' => $dn_calles,
                    'numero_externo' => $dn_numero_externo,
                    'numero_interno' => $dn_numero_interno,
                    'colonia_id' => $dn_colonia_id != null ? $dn_colonia_id : -1,
                    'codigo_postal' => $dn_codigo_postal,
                    'latitud' => 0,
                    'longitude' => 0,
                    'tipo' => $dn_tipo,
                ]) : $direccionFacturacion;

                $personaMoral->direccion_de_notificacion_id = $direccionNotificacion->id;
                $personaMoral->save();
            }

            DatosFacturacion::create([
                'persona_id' => Auth::user()->id,
                'persona_moral_id' => $personaMoral->id,
                'direccion_id' => $direccionFacturacion->id,
                'regimen_fiscal' => $personaMoral->regimen_fiscal,
            ]);

            return $personaMoral;
        }

        $regimen_fiscal = $datosPersona['pf_regimen_fiscal'];

        $personaFisica = Auth::user();
        $personaFisica->regimen_fiscal = $regimen_fiscal;
        $personaFisica->save();

        $pf_calle_principal = $datosPersona['pf_calle_principal'];
        $pf_calles = $datosPersona['pf_calles'];
        $pf_codigo_postal = $datosPersona['pf_codigo_postal'];
        $pf_colonia_id = $datosPersona['pf_colonia_id'];
        $pf_numero_externo = $datosPersona['pf_numero_externo'];
        $pf_numero_interno = $datosPersona['pf_numero_interno'];
        $pf_tipo = '';

        $direccionFacturacion = Direccion::create([
            'calle_principal' => $pf_calle_principal,
            'calles' => $pf_calles,
            'numero_externo' => $pf_numero_externo,
            'numero_interno' => $pf_numero_interno,
            'colonia_id' => $pf_colonia_id != null ? $pf_colonia_id : -1,
            'codigo_postal' => $pf_codigo_postal,
            'latitud' => 0,
            'longitude' => 0,
            'tipo' => $pf_tipo,
        ]);

        $dn_calle_principal = null;

        if (array_key_exists('dn_calle_principal', $datosPersona)) {
            $dn_calle_principal = $datosPersona['dn_calle_principal'];
            $dn_calles = $datosPersona['dn_calles'];
            $dn_codigo_postal = $datosPersona['dn_codigo_postal'];
            $dn_colonia_id = $datosPersona['dn_colonia_id'];
            $dn_numero_externo = $datosPersona['dn_numero_externo'];
            $dn_numero_interno = $datosPersona['dn_numero_interno'];
            $dn_tipo = '';
            $dn_colonia_id = $datosPersona['dn_colonia_id'];
        }

        $direccionNotificacion = $dn_calle_principal ? Direccion::create([
            'calle_principal' => $dn_calle_principal,
            'calles' => $dn_calles,
            'numero_externo' => $dn_numero_externo,
            'numero_interno' => $dn_numero_interno,
            'colonia_id' => $dn_colonia_id != null ? $dn_colonia_id : -1,
            'codigo_postal' => $dn_codigo_postal,
            'latitud' => 0,
            'longitude' => 0,
            'tipo' => $dn_tipo,
        ]) : $direccionFacturacion;

        $personaFisica->direccion_de_notificacion_id = $direccionNotificacion->id;
        $personaFisica->save();

        DatosFacturacion::create([
            'persona_id' => Auth::user()->id,
            'persona_moral_id' => null,
            'direccion_id' => $direccionFacturacion->id,
            'regimen_fiscal' => $regimen_fiscal,
        ]);

        return $personaFisica;
    }

    public function importarLicenciasAlcohol(Request $request)
    {
        $licencias = Excel::toArray(
            new RequisitosRefrendoLicenciaAlcoholImport(),
            $request->file('licencias')
        );

        return count($licencias) > 0 ? $licencias[0] : $licencias;
    }

    public static function SendMailTramitePersona($subject = '', $tramite = '', $status = '', $solicitante = '', $requisitos = [], $mensaje = '', $email = '')
    {
        //// ENVIAR CORREO
        try {
            $data['solicitante'] = $solicitante == '' ? '-' : $solicitante;
            $data['last_name'] = '';
            $data['email'] = 'info.comercio@lapaz.gob.mx';
            $data['subject'] = $subject == '-' ? 'Asunto' : $subject;
            $data['status'] = $status == '' ? '-' : $status;
            $data['requisitos'] = $requisitos == '-' ? '' : $requisitos;
            $data['tramite'] = $tramite == '' ? '-' : $tramite;
            $data['observaciones'] = $mensaje == '' ? '-' : $mensaje;

            \Mail::send('emails/estado-tramite-persona.blade', $data, function ($mensaje) use ($data, $email) {
                $mensaje->from($data['email'], 'Sistema de Comercio del H.XVII Ayuntamiento de La Paz')
                    ->to($email, 'Sistema de comercio')
                    ->subject($data['subject']);
            });
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
