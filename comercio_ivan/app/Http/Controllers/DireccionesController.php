<?php

namespace App\Http\Controllers;

use App\Models\Direccion;
use Illuminate\Http\Request;

class DireccionesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
     * @param  \App\Models\direcciones  $direcciones
     * @return \Illuminate\Http\Response
     */
    public function show(direcciones $direcciones)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\direcciones  $direcciones
     * @return \Illuminate\Http\Response
     */
    public function edit(direcciones $direcciones)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Models\direcciones  $direcciones
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, direcciones $direcciones)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\direcciones  $direcciones
     * @return \Illuminate\Http\Response
     */
    public function destroy(direcciones $direcciones)
    {
        //
    }

    public function updateDireccionNegocio(Request $request)
    {
        $direccion = Direccion::find($request['id']);

        $direccion->calle_principal = $request['calle_principal'];
        $direccion->calles = $request['calles'];
        $direccion->codigo_postal = $request['codigo_postal'];
        $direccion->colonia_id = $request['colonia_id'];
        $direccion->latitud = $request['latitud'];
        $direccion->longitude = $request['longitude'];
        $direccion->numero_externo = $request['numero_externo'];
        $direccion->numero_interno = $request['numero_interno'];
        $direccion->tipo = $request['tipo'];
        $direccion->delegacion = $request['delegacion'];
        $direccion->save();

        return $direccion;
    }
}
