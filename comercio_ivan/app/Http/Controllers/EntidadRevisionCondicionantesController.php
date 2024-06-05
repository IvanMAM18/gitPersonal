<?php

namespace App\Http\Controllers;

use App\Models\EntidadRevision;

class EntidadRevisionCondicionantesController extends Controller
{
    /**
     * Regresa las condicionantes para la entidad relacion recibida como parametro en la URL.
     */
    public function index(EntidadRevision $entidadRevision)
    {
        return $entidadRevision->condicionantes()->get();
    }
}
