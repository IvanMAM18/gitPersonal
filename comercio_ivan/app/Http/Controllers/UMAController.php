<?php

namespace App\Http\Controllers;

use App\Models\UMA;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UMAController extends Controller
{
    // private $uma; //this line is important and it was missing in your code

    // public function __construct(IAdminRepository $uma){
    //     $this->uma = $uma;
    // }
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

    public function getAllUMAS()
    {
        return UMA::all();
    }

    public function deleteUMA(Request $request)
    {
        try {
            $uma = UMA::find($request['id'])->delete();

            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }

    public function addUMA(Request $request)
    {
        try {
            $uma = UMA::create([
                'diario' => $request['diario'],
                'mensual' => $request['mensual'],
                'anual' => $request['anual'],
                'año' => $request['año'],
            ]);

            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }

    public function editUMA(Request $request)
    {
        try {
            $uma = UMA::create([
                'diario' => $request['diario'],
                'mensual' => $request['mensual'],
                'anual' => $request['anual'],
                'año' => $request['año'],
            ]);

            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }

    public function getUMARecoleccion(Request $request)
    {
        try {
            $uma = DB::table('giro_comercial as gc')
                ->join('giro_comercial_negocio as gcn', 'gcn.giro_comercial_id', '=', 'gc.id')
                ->join('tarifa_recoleccion_basura as trb', 'trb.giro_comercial_id', '=', 'gc.servicio_publico_id')
                ->join('catalogo_giros_comerciales_recoleccion_basura as a', 'a.id', '=', 'trb.giro_comercial_id')
                ->select('gcn.negocio_id', 'gc.servicio_publico_id', 'trb.id', 'trb.valor_uma', 'gc.tipo', 'gc.nombre', 'trb.periodo', 'a.nombre as clasificacion', 'trb.volumen')
                ->where('gcn.negocio_id', $request['negocio_id'])
                ->whereNull('gcn.deleted_at')
                ->where('trb.periodo', $request['periodo'])
                ->where('trb.volumen', $request['volumen'])
                ->orderByDesc('trb.valor_uma')
                ->first();

            return $uma;
        } catch (\Throwable $th) {
            return false;
        }
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(UMA $uMA)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(UMA $uMA)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UMA $uMA)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(UMA $uMA)
    {
        //
    }
}
