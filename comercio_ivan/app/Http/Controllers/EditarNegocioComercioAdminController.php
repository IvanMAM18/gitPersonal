<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use App\Models\Revision;
use App\Models\GiroComercialNegocio;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Tramite;
use Carbon\Carbon;

class EditarNegocioComercioAdminController extends Controller
{
    public function update(Negocio $negocio, Request $request)
    {
        $data = $request->validate([
            'nombre_del_negocio' => ['required', 'string', 'max:255'],
            'venta_alcohol' => ['required', 'boolean'],
            'tamano_empresa' => ['nullable', 'string', 'max:255'],
            'persona_correo' => ['required', 'email', 'string', 'max:255', 'unique:users,email,' . $negocio->user->id],
            'giros_venta_alcoholes' => ['present', 'array'],
            'tiene_pagos' => ['required', 'boolean'],
        ]);

        $tramitesPermitidos = [9, 7, 8]; // Prot Civ, y Rec. Basura
        $ventaAlcoholesBeforeUpdate = $data['venta_alcohol'];

        //        $negocio = Negocio::find($request->id);
        $negocio->update($data);

        $persona = $negocio->user;
        if ($persona) {
            $persona->update(['email' => strtolower($data['persona_correo'])]);
        }

        //START Venta alcoholes
        $ventaAlcoholes = $negocio->venta_alcohol;
        $girosVentaAlcoholIds = $data['giros_venta_alcoholes'];
        $tramitePadre = $negocio->tramitePadre();
        $tramitesUsoSuelo = Tramite::where("tramite_padre_id", $tramitePadre->id)
            ->whereIn("catalogo_tramites_id", [5, 6])
            ->get();
        $tramitesIds = [];
        array_push($tramitesIds, $tramitePadre->id);
        foreach ($tramitesUsoSuelo as $tramite) {
            array_push($tramitesIds, $tramite->id);
        }


        $revisiones = Revision::where("negocio_id", $negocio->id)
            ->whereIn("entidad_revision_id", [1, 5])
            ->whereIn("tramite_id", $tramitesIds)
            //->with("estados_revision")
            ->get();


        $aprobadoUsoSuelo = false;
        $apobadoComercio = false;
        if (count($revisiones) == 2) {
            foreach ($revisiones as $revision) {
                if ($revision->status == "APROBADO" || $revision->status == "VISOR") {
                    if ($revision->entidad_revision_id == 1) {
                        $aprobadoUsoSuelo = true;
                    }
                    if ($revision->entidad_revision_id == 5) {
                        $apobadoComercio = true;
                    }
                }
            }
        }
        if ($ventaAlcoholesBeforeUpdate === false && $ventaAlcoholes === true) {
            $negocio->impacto_giro_comercial = 'mediano_alto_impacto';
            $negocio->save();

            //creat tramite alcoholes
            if ($apobadoComercio === true && $aprobadoUsoSuelo === true)
                $negocio->tramites()->create([
                    'catalogo_tramites_id' => 14,
                    'tramite_padre_id' => $tramitePadre->id,
                ]);

        } elseif ($ventaAlcoholesBeforeUpdate === true && $ventaAlcoholes === false) {

            //Ids para Licencia de Alcohol,Refrendo de Licencia de Alcoholes
            $tramitesAlcoholesIds = [13, 14, 16];
            $negocio->tramites->each(function ($tramite) use ($tramitesAlcoholesIds, $aprobadoUsoSuelo, $apobadoComercio) {
                if (in_array($tramite->catalogo_tramites_id, $tramitesAlcoholesIds)) {
                    if ($apobadoComercio === true && $aprobadoUsoSuelo === true) {
                        $tramite->delete();
                    }
                }
            });
            $altoImpactoPorGiros = false;
            $currentGiros = GiroComercialNegocio::where('negocio_id', $negocio->id)->get();
            $girosAlcoholesIds =
                [231, 232, 233, 234, 235, 236, 477, 493, 494, 558, 559, 1019, 1020, 993, 1011];
            $currentGiros->each(function ($giro) use ($girosAlcoholesIds) {
                if ($giro->tipo == "mediano_alto_impacto") {
                    $altoImpactoPorGiros = true;
                }
            });
            $negocio->impacto_giro_comercial = $negocio->superficie_m2 >= 150 || $altoImpactoPorGiros ? 'mediano_alto_impacto' : 'bajo_impacto';
            $negocio->save();

        }
        $girosAlcoholesIds =
            [231, 232, 233, 234, 235, 236, 477, 493, 494, 558, 559, 1019, 1020, 993, 1011];
        $currentGiros = GiroComercialNegocio::where('negocio_id', $negocio->id)->get();
        if ($ventaAlcoholes === false) {
            $currentGiros->each(function ($giro) use ($girosAlcoholesIds) {
                if (in_array($giro->giro_comercial_id, $girosAlcoholesIds)) {
                    $giro->delete();
                }
            });
        }

        if ($ventaAlcoholes === true && count($girosVentaAlcoholIds) > 0) {
            $currentGirosIds = [];
            foreach ($currentGiros as $currentGiro) {
                array_push($currentGirosIds, $currentGiro->giro_comercial_id);
            }

            foreach ($girosVentaAlcoholIds as $newGirosId) {
                if (in_array($newGirosId, $currentGirosIds) === false) {
                    GiroComercialNegocio::create([
                        'giro_comercial_id' => $newGirosId,
                        'negocio_id' => $negocio->id,
                    ]);
                }
            }
        }
        //END venta alcoholes
        if ($data['tiene_pagos'] === false) {
            //desvincular avisos
            $negocio->tramites->each(function ($tramite) use ($tramitesPermitidos) {
                if (in_array($tramite->catalogo_tramites_id, $tramitesPermitidos)) {
                    $avisoEntero = $tramite ? $tramite->aviso_entero : null;
                    if ($avisoEntero && $avisoEntero->vigente) {
                        $avisoEntero->trabajador_baja_id = \Auth::user()->id;
                        $avisoEntero->save();
                        $avisoEntero->delete();
                    }
                }
            });
        }


        //
        return response()->json([
            'ok' => true,
        ]);
    }
}
