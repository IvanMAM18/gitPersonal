<?php

namespace App\Http\Controllers;
use App\Models\ValidarProgramaInterno;
use App\Models\Negocio;
use Illuminate\Http\Request;

class ValidarProgramaInternoController extends Controller
{
    public function index(Negocio $negocio,$anio)
    {
        $validarProgramaInterno = $negocio->validarProgramaInternoPorAnio($anio);

        if ($validarProgramaInterno) {
            return response()->json($validarProgramaInterno->validar_programa_interno);
        }
 
        return (null);
    }
}
