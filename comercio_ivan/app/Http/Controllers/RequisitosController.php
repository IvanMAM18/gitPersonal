<?php

namespace App\Http\Controllers;

use App\Models\requisitos;
use Illuminate\Http\Request;

class RequisitosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $datos['globales_requisitos'] = requisitos::orderby('nombre', 'asc')
            ->paginate(10);

        return view('requisitos.alta', $datos);
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
        $request->validate([
            'txtrequisito' => 'required|string',
            'txtdescripcion' => 'required|string',
        ]);

        $guardar = new requisitos();
        $guardar->nombre = strtoupper($request->txtrequisito);
        $guardar->descripcion = strtoupper($request->txtdescripcion);
        $guardar->save();

        $datos['globales_requisitos'] = requisitos::orderby('nombre', 'asc')
            ->paginate(10);

        return view('requisitos.alta', $datos);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(requisitos $requisitos)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\requisitos  $requisitos
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {

        $solicitud['datos'] = Requisitos::findorfail($id);

        return view('requisitos.editarequisitos', $solicitud);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Models\requisitos  $requisitos
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'txtnombrerequisito' => 'required|string',
            'txtdescripcionrequisito' => 'required|string',
        ]);

        $Actualizar_requisitos = Requisitos::find($id);
        $Actualizar_requisitos->nombre = strtoupper($request->txtnombrerequisito);
        $Actualizar_requisitos->descripcion = strtoupper($request->txtdescripcionrequisito);
        $Actualizar_requisitos->save();
        $datos['globales_requisitos'] = requisitos::orderby('nombre', 'asc')
            ->paginate(10);

        return view('requisitos.alta', $datos);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\requisitos  $requisitos
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $requisito = requisitos::find($id);
        $requisito->delete();

        $datos['globales_requisitos'] = requisitos::orderby('nombre', 'asc')
            ->paginate(10);

        return view('requisitos.alta', $datos);
    }
}
