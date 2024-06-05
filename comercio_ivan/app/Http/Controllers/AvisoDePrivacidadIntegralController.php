<?php

namespace App\Http\Controllers;

class AvisoDePrivacidadIntegralController extends Controller
{
    /**
     * Muestra la vista del aviso de privacidad integral.
     */
    public function index()
    {
        return view('comercio.aviso-de-privacidad-integral');
    }
}
