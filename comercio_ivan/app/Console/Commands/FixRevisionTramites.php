<?php

namespace App\Console\Commands;

use App\Models\Negocio;
use App\Models\Tramite;
use Illuminate\Console\Command;
use Log;

class FixRevisionTramites extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:revision-tramites';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Busca los tramites sin revisiones y le asigna la revision asignada a un tramite borrado.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $negociosIdsParaFix = Negocio::select('id')->
            whereHas('tramites_comercio', function ($tramiteComercio) {
                $tramiteComercio->whereHas('tramites', function ($tramite) {
                    $tramite->whereDoesntHave('revisions')->
                    whereNotNull('tramite_padre_id');
                });
            })->
            get()->
            map(function ($negocio) {
                return $negocio->id;
            })->sort()->values();

        foreach ($negociosIdsParaFix as $negocioId) {
            $negocio = Negocio::select('id', 'nombre_del_negocio')->
            with(['tramites_comercio' => function ($tramiteComercio) {
                $tramiteComercio->
                    select('negocio_id', 'tramite_id', 'deleted_at')->
                    withTrashed()->
                    whereHas('tramites', function ($tramite) {
                        $tramite->whereNotNull('tramite_padre_id')->withTrashed();
                    })->
                    with(['tramites' => function ($tramite) {
                        $tramite->
                            select('id', 'deleted_at', 'catalogo_tramites_id')->
                            withTrashed()->
                            whereNotNull('tramite_padre_id')->
                            with(['ultima_revision' => function ($revision) {
                                $revision->
                                select('revision.id', 'revision.tramite_id', 'revision.deleted_at');
                            }, 'catalogo_tramites:id,entidad_revisora_id']);
                    }]);
            }])->
            find($negocioId);

            $tramitesBorradosConRevision = $negocio->tramites_comercio->filter(function ($tramiteComercio) {
                $tramite = $tramiteComercio->tramites != null &&
                    $tramiteComercio->tramites->count() > 0 ?
                    $tramiteComercio->tramites[0] :
                    null;

                $tramiteComercioBorrado = $tramiteComercio->deleted_at != null;
                $tramiteBorrado = $tramite && $tramite->deleted_at != null;
                $tieneRevision = $tramite ? $tramite->ultima_revision != null : false;

                return ($tramiteComercioBorrado || $tramiteBorrado) && $tieneRevision;
            });

            foreach ($tramitesBorradosConRevision as $tramiteBorrado) {
                $tramite = $tramiteBorrado->tramites != null &&
                    $tramiteBorrado->tramites->count() > 0 ?
                    $tramiteBorrado->tramites[0] :
                    null;
                $catalogoTramite = $tramite->catalogo_tramites && $tramite->catalogo_tramites->count() > 0 ?
                    $tramite->catalogo_tramites[0] :
                    null;

                $negocioId = $tramiteBorrado->negocio_id;
                $entidadRevisoraId = $catalogoTramite ? $catalogoTramite->entidad_revisora_id : 0;

                $tramiteActivoSinRevision = Tramite::where('tramitable_id', $negocioId)->where('tramitable_type', Negocio::class)
                    ->whereHas('catalogo_tramites', function ($catalogoTramite) use ($entidadRevisoraId) {
                        $catalogoTramite->where('entidad_revisora_id', $entidadRevisoraId);
                    })
                    ->whereDoesntHave('revisions')
                    ->orderBy('id', 'desc')
                    ->first();

                if (! $tramiteActivoSinRevision) {
                    continue;
                }

                $revision = $tramite->ultima_revision;

                Log::build([
                    'driver' => 'single',
                    'path' => storage_path('logs/fix-tramites.log'),
                ])->info('Fix tramite sin revision.', ['revision_id' => $revision->id,
                    'tramite_anterior_id' => $revision->tramite_id,
                    'tramite_nuevo_id' => $tramiteActivoSinRevision->id,
                ]);

                $revision->tramite_id = $tramiteActivoSinRevision->id;
                $revision->save();
            }
        }
    }
}
