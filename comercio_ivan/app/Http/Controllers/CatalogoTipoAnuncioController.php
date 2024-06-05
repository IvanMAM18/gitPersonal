<?php

namespace App\Http\Controllers;

use App\Models\catalogo_tipo_anuncio;
use Illuminate\Http\Request;

class CatalogoTipoAnuncioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $datos = catalogo_tipo_anuncio::orderBy('descripcion', 'asc')->get();

        return response()->json($datos);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(catalogo_tipo_anuncio $catalogo_tipo_anuncio)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(catalogo_tipo_anuncio $catalogo_tipo_anuncio)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, catalogo_tipo_anuncio $catalogo_tipo_anuncio)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(catalogo_tipo_anuncio $catalogo_tipo_anuncio)
    {
        //
    }
}