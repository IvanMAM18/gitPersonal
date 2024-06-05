<?php

namespace App\Http\Controllers;

use App\Models\EstadoRevision;
use App\Models\RequisitoRevision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RequisitoRevisionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
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
    }

    public function storeRequisitoPersona(Request $request)
    {
        $valor = $request->valor;
        $requisitoId = $request->requisito_id;
        $estadoRevisionId = $request->estado_revision_id;
        $userId = Auth::user();

        if (! $requisitoId || ! $estadoRevisionId || ! $userId) {
            abort(400);
        }

        $estadoRevision = EstadoRevision::findOrFail($estadoRevisionId);
        $revision = $estadoRevision->revision;
        $tramite = $revision->tramite;
        $persona = $tramite->tramitable;

        try {
            DB::beginTransaction();

            RequisitoRevision::where([
                'requisito_id' => $requisitoId,
                'estado_revision_id' => $estadoRevisionId,
            ])->update([
                'status' => 'ENVIADO',
                'valor' => $valor,
            ]);

            $persona->personaRequisitos()->where([
                'requisito_id' => $requisitoId,
            ])->delete();

            $personaRequisito = $persona->personaRequisitos()->create([
                'requisito_id' => $requisitoId,
                'valor' => $valor,
            ]);

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
        }

        return $personaRequisito;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\requisitos  $requisitos
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
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Models\requisitos  $requisitos
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\requisitos  $requisitos
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
    }
}
