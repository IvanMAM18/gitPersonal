<?php

namespace App\Http\Controllers;

use App\Models\CatalogoRequisitos;
use App\Models\Requisitos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CatalogoRequisitosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $datos['globales_requisitos'] = requisitos::all();

        $area = '';
        if (auth()->user()->civil == 1) {
            $area = '1';
        }
        if (auth()->user()->ordenamiento == 1) {
            $area = '2';
        }
        if (auth()->user()->sare == 1) {
            $area = '3';
        }
        if (auth()->user()->ecologia == 1) {
            $area = '4';
        }
        /*
               $datos['datosrequisitos']= CatalogoRequisitos::addSelect
               (
                   ['requisitos' => requisitos::select('nombre')
                   ->whereColumn('catalogo_requisitos.requisito_id', 'requisitos.id')
                   ->where('requisitos.entidad_id',$area)
                   ]
               )->get();
               */

        $datos['datosrequisitos'] = DB::connection('pgsql')
            ->select("select catalogo_requisitos.id, 
       catalogo_requisitos.requisito_id, 
       requisitos.nombre
       from public.catalogo_requisitos, public.requisitos
       where entidad_id = '".$area."' 
       and public.catalogo_requisitos.deleted_at is null
       and catalogo_requisitos.requisito_id = requisitos.id");

        //return response()->json($datos);

        return view('requisitos.index', $datos);
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
        ]);

        $area = '';
        if (auth()->user()->civil == 1) {
            $area = '1';
        }
        if (auth()->user()->ordenamiento == 1) {
            $area = '2';
        }
        if (auth()->user()->sare == 1) {
            $area = '3';
        }
        if (auth()->user()->ecologia == 1) {
            $area = '4';
        }

        $guardar = new CatalogoRequisitos();
        $guardar->timestamps = false;

        $guardar->entidad_id = $area;
        $guardar->requisito_id = $request->idrequisito;
        $guardar->save();

        $datos['globales_requisitos'] = requisitos::all();

        $datos['datosrequisitos'] = DB::connection('pgsql')
            ->select("select catalogo_requisitos.id, catalogo_requisitos.requisito_id, requisitos.nombre
       from public.catalogo_requisitos, public.requisitos
       where entidad_id = '".$area."' and catalogo_requisitos.requisito_id = requisitos.id");

        // return response()->json($datos);

        return view('requisitos.index', $datos);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(CatalogoRequisitos $catalogoRequisitos)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CatalogoRequisitos  $catalogoRequisitos
     * @return \Illuminate\Http\Response
     */
    public function edit($requisito_id)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CatalogoRequisitos $catalogoRequisitos)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CatalogoRequisitos  $catalogoRequisitos
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $requisito = CatalogoRequisitos::find($id);
        $requisito->delete();

        $area = '';
        if (auth()->user()->civil == 1) {
            $area = '1';
        }
        if (auth()->user()->ordenamiento == 1) {
            $area = '2';
        }
        if (auth()->user()->sare == 1) {
            $area = '3';
        }
        if (auth()->user()->ecologia == 1) {
            $area = '4';
        }

        $datos['globales_requisitos'] = requisitos::all();

        $datos['datosrequisitos'] = DB::connection('pgsql')
            ->select("select catalogo_requisitos.id, catalogo_requisitos.requisito_id, requisitos.nombre
        from public.catalogo_requisitos, public.requisitos
        where entidad_id = '".$area."' and catalogo_requisitos.requisito_id = requisitos.id");

        return view('requisitos.index', $datos);
    }
}
