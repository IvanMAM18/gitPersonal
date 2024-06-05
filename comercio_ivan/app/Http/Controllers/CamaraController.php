<?php

namespace App\Http\Controllers;

use App\Models\Camara;

class CamaraController extends Controller
{
    /**
     * Regresa todas los records del modelo camaras.
     */
    public function index()
    {
        return Camara::select(['id', 'nombre'])->get();
    }
}
