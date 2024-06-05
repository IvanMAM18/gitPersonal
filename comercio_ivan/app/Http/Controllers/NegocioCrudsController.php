<?php

namespace App\Http\Controllers;

use App\Models\Direccion;
use App\Models\Negocio;
use Illuminate\Support\Facades\Auth;

class NegocioCrudsController extends Controller
{
    public function getNegociosAdmin()
    {
        if (Auth::user() != null) {
            $negocios = Negocio::with('persona:id,nombre,apellido_pat,apellido_mot')
                ->with('persona_moral:id,razon_social')->get();

            return response()->json($negocios);
        }
    }

    public function getNegociosUsuario()
    {
        if (Auth::user() != null) {
            $negocios = Negocio::whereRaw('persona_id = '.Auth::user()->id)
                ->with('persona:id,nombre,apellido_pat,apellido_mot')
                ->with('persona_moral:id,razon_social')->get();

            return response()->json($negocios);
        }
    }

    public function getDireccionPorId($direccion_id)
    {
        $direccion = Direccion::find($direccion_id);
        if ($direccion !== null) {
            return $direccion;
        }

        return null;
    }
}
