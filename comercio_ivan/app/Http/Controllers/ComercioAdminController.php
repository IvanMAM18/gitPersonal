<?php

namespace App\Http\Controllers;

use App\Events\TramiteCargado;
use App\Helpers\EntidadRevisora;
use App\Models\EstadoRevision;
use App\Models\Negocio;
use App\Models\Revision;
use App\Models\Tramite;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ComercioAdminController extends Controller
{
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

            
            if ($status == 'EN REVISION' || $status == "RECHAZADO") {
                $estado_revision = EstadoRevision::create([
                    'revision_id' => $revision_id,
                    'status' => $status,
                    'usuario_id' => $user_id,
                    'observaciones' => $observacion,
                ]);
                $negocio = Negocio::find($negocio_id);

                if($status == "RECHAZADO"){
                    $revision = Revision::find($revision_id);
                    $revision->status = "RECHAZADO";
                    $revision->save();
                }
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
