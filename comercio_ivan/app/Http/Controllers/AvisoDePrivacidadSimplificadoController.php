<?php

namespace App\Http\Controllers;

class AvisoDePrivacidadSimplificadoController extends Controller
{
    /**
     * Muestra la vista del aviso de privacidad simplificado.
     */
    public function index()
    {
        return view('comercio.aviso-de-privacidad-simplificado');
    }
}
