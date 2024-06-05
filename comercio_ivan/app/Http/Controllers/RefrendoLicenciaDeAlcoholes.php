<?php

namespace App\Http\Controllers;

use App\Models\CatalogoTramiteRequisito;
use App\Models\EstadoRevision;
use App\Models\RequisitoRevision;
use App\Models\Revision;
use App\Models\Subtramite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RefrendoLicenciaDeAlcoholes extends Controller
{
    public function store(Request $request)
    {
        $catalogoTramitesId = 15;
        $personaMoralId = $request->persona_moral_id;
        $numeroTramites = $request->numero_de_licencias;
        $requisitos = $request->requisitos;

        $requisitosIdToKey = [54 => 'numero', 55 => 'nombre_operador', 56 => 'direccion_operador'];

        try {
            DB::beginTransaction();

            $datosPersona = $request->datos_persona;
            $persona = TramiteController::registrarPersona($datosPersona); // cambiar eventualmente

            // $personaMoral = PersonaMoral::find($personaMoralId);

            for ($i = 0; $i < $numeroTramites; $i++) {
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

                $subtramites = Subtramite::where('orden', 1)->
                where('catalogo_tramite_padre_id', $catalogoTramitesId)->
                get();

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
                        $key = array_key_exists(
                            $catalogoTramiteRequisito->requisito_id,
                            $requisitosIdToKey
                        ) ? $requisitosIdToKey[$catalogoTramiteRequisito->requisito_id]
                            : 0;
                        $valor = ($key && array_key_exists($key, $requisitos[$i]))
                            ? $requisitos[$i][$key]
                            : '';
                        $valor = $valor ? $valor : '';
                        $requisitoRevision = RequisitoRevision::create([
                            'requisito_id' => $catalogoTramiteRequisito->requisito_id,
                            'revision_id' => $revision->id,
                            'estado_revision_id' => $estadoRevision->id,
                            'status' => 'ENVIADO',
                            'valor' => $valor,
                        ]);
                    }
                }
            }

            if (app()->isProduction()) {
                // $this->SendMail("Trámites", $catalogo_tramite->nombre, $revision->status , $persona->nombre, [], "Se inicio el trámite",$persona->email);
            }

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
            // throw $e;
        }
    }
}
