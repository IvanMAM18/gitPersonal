<?php

namespace App\Http\Controllers;

use App\Models\CatalogoTramite;
use Illuminate\Http\Request;

class CatalogoTramiteController extends Controller
{
    public function find(Request $request, $catalogoTramiteId)
    {
        return CatalogoTramite::select(['id', 'nombre', 'pago', 'resolutivo', 'tipo', 'tipo_tramite'])->
            find($catalogoTramiteId);
    }
}
