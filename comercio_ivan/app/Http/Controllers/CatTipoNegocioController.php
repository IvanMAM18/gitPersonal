<?php

namespace App\Http\Controllers;

use App\Models\cat_tipo_negocio;

class CatTipoNegocioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $datos = cat_tipo_negocio::get();

        return response()->json($datos);

        // $datos['negocios']=cat_tipo_negocio::all();
        // return view ('solicitudes.index',$datos);
    }
}
