<?php

namespace App\Http\Controllers;

use App\Jobs\CrearTramitesDeOrdenUno;
use App\Models\Tramite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ValidarTramiteController extends Controller
{
    public function store(Tramite $tramite)
    {
        DB::beginTransaction();

        $negocio = $tramite->tramitable;

        $negocio->update(['validado_por' => Auth::user()->id]);

        $negocio->load(['revisiones' => function ($query) {
            $query->where('entidad_revision_id', 1);
        }]);

        $revision = $negocio->revisiones->first();
        if ($revision) {
            $revision->update(['status' => 'ENVIADO']);
            $revision->estados_revision()->create([
                'status' => 'ENVIADO',
                'usuario_id' => Auth::user()->id,
                'observaciones' => 'Revision iniciada',
            ]);
        }

        DB::commit();

        if ($negocio->tramites()->count() < 2) {
            CrearTramitesDeOrdenUno::dispatch($tramite);
        }
    }
}
