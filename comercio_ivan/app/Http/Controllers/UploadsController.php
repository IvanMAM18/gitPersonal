<?php

namespace App\Http\Controllers;

use App\Models\EstadoRevision;
use App\Models\Negocio;
use App\Models\NegocioRequisitoRevision;
use App\Models\PersonaMoral;
use App\Models\Requisito;
use App\Models\RequisitoNegocio;
use App\Models\RequisitoRevision;
use App\Models\Revision;
use App\Models\UsuarioRequisito;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UploadsController extends Controller
{
    public function acta_constitutiva(Request $request)
    {
        $filepath = $request->file('acta_constitutiva')->store('public/uploads/acta-constitutiva');

        return str_replace('public', 'storage', $filepath);
    }

    public function documento_predio_propiedad(Request $request)
    {
        $filepath = $request->file('documento_tipo_predio')->store('public/uploads/predio-propiedad');
        //        $filepath = $request->file('documento_tipo_predio')->store('/uploads/predio-propiedad', 'public');

        return str_replace('public', 'storage', $filepath);
        //        return Storage::disk('public')->url($filepath);
    }

    public function predio_playa_ejidal(Request $request)
    {
        $filepath = $request->file('predio_playa_ejidal')->store('public/uploads/predio-playa-ejidal');

        return str_replace('public', 'storage', $filepath);
    }

    public function update_acta_constitutiva(Request $request)
    {
        $persona_moral = PersonaMoral::find($request->input('persona_moral_id'));
        $persona_moral->acta_constitutiva_path = $request->input('new_acta_constitutiva');
        $persona_moral->save();

        return [
            'ok' => true,
            '$request->input(new_acta_constitutiva)' => $request->input('new_acta_constitutiva'),
            'persona_moral' => $persona_moral,
        ];
    }

    public function foto_frontal_negocio(Request $request)
    {
        $filepath = $request->file('foto_frontal_negocio')->store('public/uploads/foto-frontal-negocio');

        return str_replace('public', 'storage', $filepath);
    }

    public function expediente(Request $request)
    {
        $filename = $request->input('filename');
        $filepath = $request->file($filename)->store('public/uploads/'.$filename);
        $requisito = Requisito::where('codigo', $filename)->first();
        $requisito_id = $requisito->id;

        $usuario_requisito_exists = UsuarioRequisito::where('requisito_id', $requisito_id)
            ->where('user_id', Auth::user()->id)
            ->orderBy('id', 'desc')
            ->first();

        if ($usuario_requisito_exists) {
            $usuario_requisito_exists['deleted_at'] = Carbon::now();
            $usuario_requisito_exists->save();
        }

        $parsed_filepath = str_replace('public', 'storage', $filepath);

        $usuario_requisito = UsuarioRequisito::create([
            'user_id' => Auth::user()->id,
            'tipo_usuario' => 'fisica',
            'status' => 'PENDIENTE',
            'estado_revision_id' => 0,
            'requisito_id' => $requisito_id,
            'archivo_path' => $parsed_filepath,
        ]);

        $usuario_requisito['requisito'] = $requisito;

        return response()->json($usuario_requisito);
    }

    public function any(Request $request)
    {
        $filename = $request->input('filename');
        $filename = str_replace('_', ' ', $filename);
        $filename = str_replace('.', ' ', $filename);
        // $tipo_usuario = $request->input('tipo_usuario');
        $estado_revision_id = $request->input('estado_revision_id');
        $filepath = $request->file($filename)->store('public/uploads/'.$filename);

        $requisito = Requisito::where('codigo', $filename)->first();
        $requisito_id = $requisito->id;
        $estado_revision = EstadoRevision::find($estado_revision_id);

        // encontramos todos los estados de revision relacionados con esta revision
        // y damos join con los requisitos que tengan el mismo requisito
        $todos_estados_revision = EstadoRevision::where('revision_id', $estado_revision->revision_id)
            ->with('requisitos', function ($r) use ($requisito_id) {
                $r->where('requisito_id', $requisito_id);
            })
            ->get();

        $usuario_requisito = null;

        // vamos a recorrer y encontrar todos los requisitos_revision y ponerlos como subido
        foreach ($todos_estados_revision as $erkey => $er) {
            foreach ($er->requisitos as $rkey => $er_requisito) {
                $req_rev = RequisitoRevision::find($er_requisito->id);
                $req_rev['status'] = 'ENVIADO';
                $req_rev->save();

                // reemplaza el requisito si existe
                $usuario_requisito_exists = UsuarioRequisito::where('requisito_id', $er_requisito->id)
                    ->where('user_id', Auth::user()->id)
                    ->orderBy('id', 'desc')
                    ->first();

                if ($usuario_requisito_exists) {
                    $usuario_requisito_exists['deleted_at'] = Carbon::now();
                    $usuario_requisito_exists->save();
                }

                $parsed_filepath = str_replace('public', 'storage', $filepath);

                $usuario_requisito = UsuarioRequisito::create([
                    'user_id' => Auth::user()->id,
                    'tipo_usuario' => 'fisica',
                    'status' => 'PENDIENTE',
                    'estado_revision_id' => $er->id,
                    'requisito_id' => $er_requisito->requisito_id,
                    'archivo_path' => $parsed_filepath,
                ]);

                $usuario_requisito['requisito'] = $er_requisito;
            }
        }

        return response()->json($usuario_requisito);
    }

    public function anyNegocio(Request $request)
    {
        $filename = $request->input('filename');
        $filename = str_replace('_', ' ', $filename);
        $filename = str_replace('.', ' ', $filename);

        $estado_revision_id = $request->input('estado_revision_id');
        $negocio_id = $request->input('negocio_id');
        $filepath = $request->file($filename)->store('public/uploads/'.$filename);

        $requisito = Requisito::where('codigo', $filename)->first();

            $requisito_id = $requisito->id;
            $estado_revision = EstadoRevision::find($estado_revision_id);

            $revision = Revision::find($estado_revision->revision_id);

            // encontramos todos los estados de revision relacionados con esta revision
            // y damos join con los requisitos que tengan el mismo requisito
            // $todos_estados_revision = EstadoRevision::where('revision_id', $estado_revision->revision_id)
            //     ->with('requisitos', function ($r) use ($requisito_id) {
            //         $r->where('requisito_id', $requisito_id);
            //     })
            //     ->get();

            $negocio_requisito = null;

            // vamos a recorrer y encontrar todos los requisitos_revision y ponerlos como subido
            // foreach ($todos_estados_revision as $erkey => $er) {
            //     foreach ($er->requisitos as $rkey => $er_requisito) {
            $neg_req_rev = NegocioRequisitoRevision::where('estado_revision_id', $estado_revision->id)->where('requisito_id', $requisito_id)->first();
            $neg_req_rev['status'] = 'ENVIADO';
            $neg_req_rev->save();
        
            // reemplaza el requisito si existe
            $negocios_requisitos_exists = RequisitoNegocio::where('requisito_id', $requisito_id)
                ->where('negocio_id', $negocio_id)
                ->where('tramite_id', $revision->tramite_id)
                ->orderBy('id', 'desc')
                ->get();

            if ($negocios_requisitos_exists != null) {
                foreach ($negocios_requisitos_exists as $negocio_requisito_exists) {
                    # code...
                    $negocio_requisito_exists['deleted_at'] = Carbon::now();
                    $negocio_requisito_exists->save();
                }
            }

            $parsed_filepath = str_replace('public', 'storage', $filepath);

            $negocio_requisito = RequisitoNegocio::create([
                'negocio_id' => $negocio_id,
                'status' => 'ENVIADO',
                'estado_revision_id' => $estado_revision_id,
                'requisito_id' => $requisito_id,
                'archivo_path' => $parsed_filepath,
                'tramite_id' => $revision->tramite_id,
            ]);

            $negocio_requisito['requisito'] = $requisito;

        $negocio = Negocio::find($negocio_id);
        $negocio->status = 'ENVIADO';
        $negocio->save();

        return response()->json($negocio_requisito);
    }

    public function comprobante_domicilio_negocio(Request $request)
    {
        $filepath = $request->file('comprobante_domicilio_negocio')->store('public/uploads/comprobante-domicilio-negocio');

        return str_replace('public', 'storage', $filepath);
    }
}
