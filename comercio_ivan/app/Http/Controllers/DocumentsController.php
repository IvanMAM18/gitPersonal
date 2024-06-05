<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use App\Models\NegocioRequisito;
use App\Models\PersonaMoral;
use App\Models\UsuarioRequisito;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class DocumentsController extends Controller
{
    public function show($filepath, $filename)
    {
        $user_id = Auth::user()->id;
        $negocio_requisito = NegocioRequisito::where('archivo_path', "storage/uploads/$filepath/$filename")->first();
        $usuario_requisito = UsuarioRequisito::where('archivo_path', "storage/uploads/$filepath/$filename")->first();

        $documento_encontrado_en_negocio = false;
        $documento_negocio = Negocio::where('foto_frontal_fachada', "storage/uploads/$filepath/$filename")
            ->orWhere('comprobante_domicilio', "storage/uploads/$filepath/$filename")
            ->first();

        if (isset($documento_negocio) && $documento_negocio != null) {
            // el documento está almacenado en la tabla negocio
            // si el negocio no es de la persona enviamos
            // un 403, de lo contrario ponemos el flag para que
            // no busque en los requisitos y pase directo a enviar
            // el documento
            if ($documento_negocio->persona_id != $user_id) {
                return response('Forbidden', 403);
            }
            $documento_encontrado_en_negocio = true;
        }

        $documento_encontrado_en_persona_moral = false;

        $documento_persona_moral = PersonaMoral::where('acta_constitutiva_path', "storage/uploads/$filepath/$filename")->first();
        if ($documento_persona_moral && $documento_persona_moral != null) {
            // el documento está almacenado en la tabla persona_moral
            // si la persona moral no pertenece a la persona, enviamos
            // 403, de lo contrario avisamos que encontramos el documento
            // con documento_encontrado_en_persona_moral = true
            if ($documento_persona_moral->persona_id != $user_id) {
                return response('Forbidden', 403);
            }
            $documento_encontrado_en_persona_moral = true;
        }

        // si el usuario en cuestion no tiene rol, o lo tiene pero es
        // rol de Persona (dueño de un negocio) se procede a validar la
        // capacidad para acceder al documento
        if (! $documento_encontrado_en_persona_moral && ! $documento_encontrado_en_negocio) {
            if (currentUser()->esPersona()) {

                if ($negocio_requisito == null && $usuario_requisito == null) {
                    return response('Not found', 404);
                }

                // es un documento de negocio y el usuario es el dueño
                if ($negocio_requisito != null) {
                    $negocio = Negocio::find($negocio_requisito->negocio_id);
                    if ($negocio->persona_id != $user_id) {
                        return response('Forbidden', 403);
                    }
                }

                // es un documento de persona y pertenece al usuario logeado
                if ($usuario_requisito != null) {
                    if ($usuario_requisito->user_id != $user_id) {
                        return response('Forbidden', 403);
                    }
                }
            }
        }

        try {
            $file = File::get("../storage/app/public/uploads/$filepath/$filename");

            $response = Response::make($file);

            $content_type = 'application/pdf';

            if (str_ends_with($filename, '.png')) {
                $content_type = 'image/png';
            }
            if (str_ends_with($filename, '.jpg')) {
                $content_type = 'image/jpg';
            }
            if (str_ends_with($filename, '.jpeg')) {
                $content_type = 'image/jpeg';
            }

            $response->header('Content-Type', $content_type);

            return $response;

        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
        }

        return response('El archivo no fue encontrado.', 404);
    }
}
