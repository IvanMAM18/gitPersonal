<?php

namespace App\Http\Controllers;

use App\Models\AvisoEntero;
use App\Models\CatalogoGirosComercialesRecoleccionBasura;
use App\Models\CatalogoTramite;
use App\Models\CodigoPostal;
use App\Models\Concepto;
use App\Models\Condicionantes;
use App\Models\EntidadRevision;
use App\Models\EstadoRevision;
use App\Models\GiroComercial;
use App\Models\Negocio;
use App\Models\Requisito;
use App\Models\Revision;
use App\Models\Roles;
use App\Models\Subtramite;
use App\Models\TarifaRecoleccionBasura;
use App\Models\Trabajador;
use App\Models\Tramite;
use App\Models\User;
use App\Services\CatastroGateway;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminCrudController extends Controller
{
    public function index()
    {
        return view('administrador.cruds_catalogos');
    }

    public function checkProteccionCivilSare()
    {
        $columnas = ['id', 'nombre_del_negocio', 'impacto_giro_comercial', 'catalogo_tramite_id', 'created_at', 'updated_at'];
        $nma = Negocio::select($columnas)->where('impacto_giro_comercial', 'mediano_alto_impacto')
            ->with('revisiones', function ($query) {
                $query->where('entidad_revision_id', 2)->with('entidad', 'tramites')->orderby('created_at', 'asc');
            })
            ->whereHas('revisiones', function ($query) {
                $query->where('entidad_revision_id', 2);
            })
            ->orderby('created_at', 'asc')
            ->get();

        for ($i = 0; $i < count($nma); $i++) {
            $tramite_id = $nma[$i]['revisiones'][0]['tramites'][0]['id'];
            $tramite = Tramite::find($tramite_id);
            $tramite->catalogo_tramites_id = 8;
            //$nma[$i]["revisiones"][0]["tramites"][0]["catalogo_tramites_id"] = 8;
            $tramite->save();
        }
        $nmaU = Negocio::select($columnas)->where('impacto_giro_comercial', 'mediano_alto_impacto')
            ->with('revisiones', function ($query) {
                $query->where('entidad_revision_id', 2)->with('entidad', 'tramites')->orderby('created_at', 'asc');
            })
            ->whereHas('revisiones', function ($query) {
                $query->where('entidad_revision_id', 2);
            })
            ->orderby('created_at', 'asc')
            ->get();

        return ['UPDATED' => $nmaU, 'NEGOCIOS' => $nma];
    }

    public function updateMedioAmbienteAltoImpacto()
    {
        $nma = Negocio::where('impacto_giro_comercial', 'mediano_alto_impacto')
            ->with('revisiones', function ($query) {
                $query->where('entidad_revision_id', 3)->with('entidad')->orderby('created_at', 'asc');
            })
            ->whereHas('revisiones', function ($query) {
                $query->where('entidad_revision_id', 3);
            })
            ->orderby('created_at', 'asc')
            ->get();

        for ($i = 0; $i < count($nma); $i++) {
            $revision_status = $nma[$i]['revisiones'][0]['status'];
            if ($revision_status == 'APROBADO') {
                $revision_id = $nma[$i]['revisiones'][0]['id'];
                ///$nma[$i]["revisiones"][0]["status"] = "HELOOOOO".$revision_id;
                $revision = Revision::find($revision_id);
                $revision->status = 'ENVIADO';
                $revision->save();
            }
        }
        $nmaU = Negocio::where('impacto_giro_comercial', 'mediano_alto_impacto')
            ->with('revisiones', function ($query) {
                $query->where('entidad_revision_id', 3)->with('entidad')->orderby('created_at', 'asc');
            })
            ->whereHas('revisiones', function ($query) {
                $query->where('entidad_revision_id', 3);
            })
            ->orderby('created_at', 'asc')
            ->get();

        return ['UPDATED' => $nmaU, 'NEGOCIOS' => $nma];

        return ['ENTIDADES REVISORAS' => $entidades, 'NEGOCIOS' => $nma];
    }

    public function updateMedioAmbienteBajoImpacto()
    {
        $nma = Negocio::where('impacto_giro_comercial', 'bajo_impacto')
            ->with('revisiones', function ($query) {
                $query->where('entidad_revision_id', 3)->with('entidad')->orderby('created_at', 'asc');
            })
            ->whereHas('revisiones', function ($query) {
                $query->where('entidad_revision_id', 3);
            })
            ->orderby('created_at', 'asc')
            ->get();

        for ($i = 0; $i < count($nma); $i++) {
            $revision_status = $nma[$i]['revisiones'][0]['status'];
            if ($revision_status == 'APROBADO') {
                $revision_id = $nma[$i]['revisiones'][0]['id'];
                $revision = Revision::find($revision_id);
                $revision->status = 'VISOR';
                $revision->save();
            }
        }
        $nmaU = Negocio::where('impacto_giro_comercial', 'bajo_impacto')
            ->with('revisiones', function ($query) {
                $query->where('entidad_revision_id', 3)->with('entidad')->orderby('created_at', 'asc');
            })
            ->whereHas('revisiones', function ($query) {
                $query->where('entidad_revision_id', 3);
            })
            ->orderby('created_at', 'asc')
            ->get();

        return ['UPDATED' => $nmaU, 'NEGOCIOS' => $nma];

        return ['ENTIDADES REVISORAS' => $entidades, 'NEGOCIOS' => $nma];
    }

    public function getServiciosPublicosParaGiros()
    {
        return CatalogoGirosComercialesRecoleccionBasura::all();
    }

    public function getTramites()
    {
        return CatalogoTramite::all();
    }

    public static function SendMail($subject = 'TESTING', $tramite = 'TRAMITE', $status = 'STATUS', $negocio = 'NEGOCIO', $requisitos = [], $email = 'h.ayuntamientodelapaz@gmail.com')
    {
        //// ENVIAR CORREO Revision iniciada
        $data['negocio'] = $negocio == '' ? '-' : $negocio;
        $data['observaciones'] = 'OBSERVACIONES';
        $data['email'] = 'no-responder@lapaz.gob.mx';
        $data['subject'] = $subject == '-' ? 'Asunto' : $subject;
        $data['status'] = $status == '' ? '-' : $status;
        $data['requisitos'] = $requisitos == '-' ? '' : $requisitos;
        $data['tramite'] = $tramite == '' ? '-' : $tramite;

        \Mail::send('emails/contact-email', $data, function ($mensaje) use ($data) {
            $mensaje->from($data['email'], 'Sistema de Comercio del H.XVII Ayuntamiento de La Paz')
                ->to('felipe.grandecs@gmail.com', 'Sistema de comercio')
                ->subject($data['subject']);
        });
    }

    public function storeTramite(Request $request)
    {
        $tramite = CatalogoTramite::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'link' => $request->link,
            'entidad_revisora_id' => $request->entidad_revisora_id,
            'departamento_id' => $request->entidad_revisora_id === null ? -1 : $request->entidad_revisora_id,
            'pago' => $request->pago === 'true' || $request->pago === '1' ? 1 : 0,
            'resolutivo' => $request->resolutivo === 'true' || $request->resolutivo === '1' ? 1 : 0,
            'en_linea' => $request->en_linea === 'true' || $request->en_linea === '1' ? 1 : 0,
            'tipo' => $request->tipo,
            'tipo_tramite' => $request->tipo_tramite,
        ]);

        return $tramite;
    }

    public function updateTramite(Request $request)
    {
        $tramite = CatalogoTramite::where('id', $request->id)->first();
        if ($tramite !== null) {
            $tramite->nombre = $request->nombre;
            $tramite->descripcion = $request->descripcion;
            $tramite->link = $request->link;
            $tramite->tipo = $request->tipo;
            $tramite->tipo_tramite = $request->tipo_tramite;
            $tramite->entidad_revisora_id = $request->entidad_revisora_id;
            $tramite->departamento_id = $request->entidad_revisora_id === null ? -1 : $request->entidad_revisora_id;
            $tramite->pago = $request->pago === 'true' || $request->pago === '1' ? 1 : 0;
            $tramite->resolutivo = $request->resolutivo === 'true' || $request->resolutivo === '1' ? 1 : 0;
            $tramite->en_linea = $request->en_linea === 'true' || $request->en_linea === '1' ? 1 : 0;
            $tramite->save();
        }

        return $tramite;
    }

    public function deleteTramite(CatalogoTramite $t)
    {
        $t->delete();
    }

    public function getGiros()
    {
        return GiroComercial::with('servicios_publicos')->get();
    }

    public function storeGiro(Request $request)
    {
        $giro = GiroComercial::create([
            'nombre' => $request->nombre,
            'clave_scian' => $request->clave_scian,
            'descripcion' => $request->descripcion,
            'servicio_publico_id' => $request->servicio_publico_id,
            'tipo' => $request->tipo,

        ]);

        return $giro;
    }

    public function updateGiro(Request $request)
    {
        $giro = GiroComercial::find($request->id);
        if ($giro !== null) {
            $giro->update($request->all());
        }

        return $giro;
    }

    public function deleteGiro(GiroComercial $g)
    {
        $g->delete();
    }

    public function getSubtramites()
    {
        return Subtramite::all();
    }

    public function storeSubtramite(Request $request)
    {
        // dd($request);
        return Subtramite::storeSubTramite($request);
    }

    public function updateSubtramite(Request $request)
    {
        return Subtramite::updateSubTramite($request);
    }

    public function deleteSubtramite(Subtramite $st)
    {
        $st->delete();
    }

    public function getEntidadesRevisoras()
    {
        return json_encode(EntidadRevision::all(), JSON_INVALID_UTF8_SUBSTITUTE);
    }

    public function getCondicionantes()
    {
        return json_encode(Condicionantes::with('entidades_revisoras')->get(), JSON_INVALID_UTF8_SUBSTITUTE);
    }

    public function storeCondicionante(Request $request)
    {
        return Condicionantes::storeCondicionante($request);
    }

    public function updateCondicionante(Request $request)
    {
        return Condicionantes::updateCondicionante($request);
    }

    public function deleteCondicionante(Condicionantes $c)
    {
        $c->delete();
    }

    public function getRequisitos()
    {
        return json_encode(Requisito::with('entidades_revisoras')->get(), JSON_INVALID_UTF8_SUBSTITUTE);
    }

    public function storeRequisito(Request $request)
    {
        return Requisito::storeRequisito($request);
    }

    public function updateRequisito(Request $request)
    {
        return Requisito::updateRequisito($request);
    }

    public function deleteRequisito(Requisito $r)
    {
        $r->delete();
    }

    public function getEntidadRevisoraDirectorRolId()
    {
        return Roles::where('nombre', 'EntidadRevisoraDirector')->first();
    }

    public function getEntidadRevisoraComercioAdminDirectorRolId()
    {
        return Roles::where('nombre', 'ComercioDirector')->first();
    }

    public function getCodigosPostales()
    {
        return CodigoPostal::select('codigo_postal')->distinct()->get();
    }

    public function getCodigosPostalesFromBCS()
    {
        return CodigoPostal::select('codigo_postal')->where('clave_estado', 'BCS')->where('clave_municipio', 3)->distinct()->get();
    }

    public function getColoniasByCodigoPostal(string $codigo_postal)
    {
        return CodigoPostal::where('codigo_postal', $codigo_postal)->get();
    }

    public function getTrabajadores()
    {
        return Trabajador::all();
    }

    public function storeTrabajador(Request $request)
    {
        return Trabajador::storeTrabajador($request);
    }

    public function updateTrabajador(Request $request)
    {
        return Trabajador::updateTrabajador($request);
    }

    public function deleteTrabajador(Trabajador $t)
    {
        $t->delete();
    }

    public function getUsuarios()
    {
        return User::orderby('id', 'asc')->get();
    }

    public function storeUsuario(Request $request)
    {

        return User::create([
            'nombre' => $request['nombre'],
            'apellido_pat' => $request['apellido_pat'],
            'apellido_mot' => $request['apellido_mot'],
            'email' => $request['email'],
            'role_id' => $request['role_id'],
            'email_verified_at' => Carbon::now(),
            'entidad_revision_id' => $request['entidad_revision_id'],
            'password' => Hash::make($request->password),
        ]);
    }

    public function updateUsuario(Request $request)
    {
        $user = User::find($request['id']);
        $user->nombre = $request['nombre'];
        $user->apellido_pat = $request['apellido_pat'];
        $user->apellido_mot = $request['apellido_mot'];
        $user->email = trim(strtolower($request['email']));
        $user->role_id = $request['role_id'];
        $user->entidad_revision_id = $request['entidad_revision_id'];
        $user->save();

        return $user;
    }

    public function updatePasswordUsuario(Request $request)
    {
        $user = User::find($request['id']);
        $user->password = Hash::make($request->password);
        $user->save();

        return $user;
    }

    public function deleteUsuario(User $u)
    {
        $u->delete();
    }

    public function getConceptos()
    {
        return Concepto::all();
    }

    public function storeConcepto(Request $request)
    {
        return Concepto::create([
            'nombre' => $request['nombre'],
            'entidad_revisora_id' => $request['entidad_revisora_id'],
            'catalogo_tramites_id' => $request['catalogo_tramites_id'],
        ]);
    }

    public function updateConcepto(Request $request)
    {
        $concepto = Concepto::find($request['id']);
        $concepto->nombre = $request['nombre'];
        $concepto->entidad_revisora_id = $request['entidad_revisora_id'];
        $concepto->catalogo_tramites_id = $request['catalogo_tramites_id'];
        $concepto->save();

        return $concepto;
    }

    public function deleteConcepto(Concepto $concepto)
    {
        $concepto->delete();
    }

    public function getColoniaById($colonia_id)
    {
        return CodigoPostal::find($colonia_id);
    }

    public function getRecoleccionBasuraInfoByTarifaId($tarifa_recoleccion_id)
    {
        return json_encode(TarifaRecoleccionBasura::find($tarifa_recoleccion_id), JSON_INVALID_UTF8_SUBSTITUTE);
    }

    public function validarRFC(CatastroGateway $catastro, Request $request)
    {
        return $catastro->validarRfc($request->input('rfc'));
    }

    public function getUserDataById($id)
    {
        $user = User::find($id);

        return $user;
    }

    public function actualizarUsuario(Request $request)
    {

        $user = User::find($request->user_id);
        $user->nombre = $request->nombre;
        $user->apellido_mot = $request->apellido_mot;
        $user->apellido_pat = $request->apellido_pat;
        if ($request->password != '' && $request->password != null && $request->password) {
            $user->password = Hash::make($request->password);
        }
        $email_updated = 0;
        if (strtolower($user->email) != strtolower($request->email)) {
            $userByEmail = User::where('email', $request->email)->get();
            if (count($userByEmail) == 0) {
                $user->email_verified_at = null;
                $user->email = $request->email;
                $user->save();
                $user->sendEmailVerificationNotification();
                $email_updated = 1;
            } else {
                $email_updated = 3;
            }
        }
        $user->save();

        return [
            'user' => $user,
            'email_updated' => $email_updated,
        ];
    }

    public function updateNegocioInfo(Request $request)
    {
        $negocio = Negocio::find($request->id);
        if ($negocio->superficie_m2 != intval($request->superficie_m2)) {
            $this->updateRevisionesProteccionCivil($negocio->id);
        }
        $negocio->nombre_del_negocio = $request->nombre_del_negocio;
        $negocio->cajones_estacionamiento = $request->cajones_estacionamiento;
        $negocio->superficie_m2 = intval($request->superficie_m2);
        $negocio->tipo_anuncio = $request->tipo_anuncio;
        $negocio->leyenda_anuncio = $request->leyenda_anuncio;
        $negocio->lugar_instalacion = $request->lugar_instalacion;
        $negocio->largo_anuncio = $request->largo_anuncio;
        $negocio->ancho_anuncio = $request->ancho_anuncio;
        $negocio->clave_catastral = $request->clave_catastral;
        $negocio->horarios = $request->horarios;
        $negocio->save();

        return Negocio::select('id')
            ->where('id', $request->id)
            ->with('tramites', function ($query) {
                $query->whereHas('catalogo_tramite', function ($catalogo) {
                    $catalogo->where('entidad_revisora_id', 2)->where('resolutivo', 1);
                });
                $query->with('catalogo_tramite', function ($catalogo) {
                    $catalogo->where('entidad_revisora_id', 2)
                        ->where('resolutivo', 1);
                })
                    ->with('aviso_entero')
                    ->with('catalogo_tramite:id,nombre,resolutivo,pago,entidad_revisora_id');
            })
            ->first();
    }

    private static function updateRevisionesProteccionCivil($negocio_id)
    {
        //update revisiones
        try {
            if (Auth::user() == null) {
                return redirect('/login');
            }

            \DB::beginTransaction();
            $negocio = Negocio::select('id', 'nombre_del_negocio')->where('id', $negocio_id)
                ->with('tramites_comercio', function ($query) {
                    $query->whereHas('tramite', function ($query) {
                        $query->
                        whereHas('catalogo_tramite', function ($catalogo) {
                            $catalogo->where('entidad_revisora_id', 2)->where('resolutivo', 1);
                        });
                    })->with('tramite', function ($query) {
                        $query->
                        whereHas('catalogo_tramite', function ($catalogo) {
                            $catalogo->where('entidad_revisora_id', 2)->where('resolutivo', 1);
                        })->
                        with('aviso_entero')->
                        with('catalogo_tramite:id,nombre,resolutivo,pago,entidad_revisora_id');
                    });
                })
                ->first();
            if (isset($negocio['tramites_comercio'][0])) {
                $tramite = $negocio['tramites_comercio'][0];

                $avisosEntero = AvisoEntero::where('tramite_id', $tramite['tramite_id'])->get();
                foreach ($avisosEntero as $ae) {
                    if ($ae->estado != 'PAGADO') {
                        $mensaje = "<strong>Numero de Aviso: </strong>{$ae->no_aviso}\n".
                        "<strong>Total: </strong>{$ae->total}\n".
                        "<strong>Nombre del Negocio: </strong>{$negocio->nombre_del_negocio}\n".
                        "<strong>Estado: </strong>{$ae->estado}\n".
                        "<strong>Tramite Padre: </strong>{$ae->tramite->tramite_padre->id}\n".
                        "<strong>Nombre del Tramite: </strong>PROTECCIÓN CIVIL\n".
                        "<strong>Id del Tramite: </strong>{$ae->tramite_id}";

                        app('App\Http\Controllers\BotTelegramController')->enviarMensaje($mensaje);
                        $ae->delete();
                    }
                }
                $tramite = Tramite::where('id', $tramite['tramite_id'])->with('ultima_revision')->first();

                $revision = Revision::where('id', $tramite['ultima_revision']['id'])->first();
                $revision['status'] = 'ENVIADO';
                $revision->save();
                $nuevo_estado_revision = EstadoRevision::create([
                    'revision_id' => $revision->id,
                    'status' => 'ENVIADO',
                    'usuario_id' => Auth::user()->id,
                    'observaciones' => 'Actualización de metros cuadrados de construcción',
                ]);
            }
            \DB::commit();

            return true;
        } catch (\Throwable $th) {
            \DB::rollback();

            return false;
        }
    }
}
