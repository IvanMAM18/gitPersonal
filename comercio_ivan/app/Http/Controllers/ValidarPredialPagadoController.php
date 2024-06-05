<?php

namespace App\Http\Controllers;

use App\Services\CatastroGateway;
use Illuminate\Http\Request;

class ValidarPredialPagadoController extends Controller
{
    public function getComercioToken(CatastroGateway $catastro)
    {
        return $catastro->getToken();
    }

    public function validatePredialPagado(CatastroGateway $catastro, Request $request)
    {
        return $catastro->validatePredialPagado(
            $request->only(['clave_folio', 'tipo_predial'])
        );
    }

    public function getInfo(CatastroGateway $catastro, Request $request)
    {
        return $catastro->getInfo(
            $request->only(['clave_folio', 'tipo_predial'])
        );
    }
}
