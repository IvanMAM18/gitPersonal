<?php

namespace App\Jobs;

use App\Helpers\EntidadRevisora;
use App\Http\Controllers\NegocioController;
use App\Models\CatalogoTramite;
use App\Models\Negocio;
use App\Models\Revision;
use App\Models\Subtramite;
use App\Models\Tramite;
use App\Notifications\TramitesIniciados;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CrearTramitesDeOrdenUno
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var Tramite
     */
    protected $tramite;

    /**
     * @var Negocio
     */
    protected $negocio;

    /**
     * Create a new job instance.
     */
    public function __construct(Tramite $tramite)
    {
        //
        $this->tramite = $tramite;
        $this->negocio = $tramite->tramitable;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        DB::beginTransaction();

        $subtramites = Subtramite::where('orden', 1)->where('catalogo_tramite_padre_id', $this->tramite->catalogo->id)
            ->with('catalogo_tramite_hijo')
            ->orderBy('orden', 'asc')
            ->get();

        foreach ($subtramites as $subtramite) {

            if ($this->negocio->venta_alcohol != true && $subtramite->catalogo_tramite_hijo_unico->entidad_revisora_id == EntidadRevisora::$ALCOHOLES) {
                continue;
            }

            $tramite_de_subtramite = $this->negocio->tramites()->create([
                'catalogo_tramites_id' => $subtramite->catalogo_tramite_hijo_id,
                'tramite_padre_id' => $this->tramite->id,
            ]);

            $catalogo_tramite = CatalogoTramite::find($subtramite->catalogo_tramite_hijo_id);

            $revision = Revision::create([
                'entidad_revision_id' => $catalogo_tramite->entidad_revisora_id,
                'status' => 'PENDIENTE',
                'negocio_id' => $this->negocio->id,
                'tramite_id' => $tramite_de_subtramite->id,
            ]);

            if ($this->tramite->created_at->year < now()->year) {
                $tramite_de_subtramite->created_at = $this->tramite->created_at;
                $tramite_de_subtramite->save();

                $revision->created_at = $this->tramite->created_at;
                $revision->save();
            }

            $revision->estados_revision()->create([
                'status' => 'PENDIENTE',
                'usuario_id' => Auth::user()->id,
                'observaciones' => 'Revision iniciada',
            ]);

            NegocioController::SendMail('Trámites', $catalogo_tramite->nombre, $revision->status, $this->negocio->nombre_del_negocio, [], 'Se inicio el trámite', $this->negocio->persona->email);
            // Cambiar a notificaciones...
//            $this->negocio->persona->notify(new TramitesIniciados($this->tramite));

        }


        DB::commit();
    }
}
