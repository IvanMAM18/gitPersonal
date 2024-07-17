<?php

namespace App\Http\Controllers;

class PreguntasFrecuentesController extends Controller
{
    public function index()
    {
        return view('layouts.preguntas-frecuentes');
    }
}
