<?php

namespace App\Http\Controllers;

use App\Models\Cat_Bajo_Impacto2020;
use App\Models\cat_giros;
use Illuminate\Http\Request;

class CatGirosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $datos = Cat_Bajo_Impacto2020::orderBy('descripcion', 'asc')->get();

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
    public function show(cat_giros $cat_giros)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(cat_giros $cat_giros)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, cat_giros $cat_giros)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(cat_giros $cat_giros)
    {
        //
    }

    public function buscagirocomer(request $request)
    {

        //  if ($request->idgiro_com == 4)
        // {

        // }
        //    else
        //   {
        //       $datos=cat_giros::where('sare','NO')->orderBy('descripcion', 'asc')->get();
        //   }
    }
}
