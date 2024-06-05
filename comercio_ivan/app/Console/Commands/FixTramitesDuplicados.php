<?php

namespace App\Console\Commands;

use App\Models\Negocio;
use Illuminate\Console\Command;
use Log;

class FixTramitesDuplicados extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:tramites-duplicados';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Busca los negocios con 2 tramites de una entidad revisora y elimina el mas viejo.';

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
        $entidadesRevision = [
            'USO_DE_SUELO' => 1,
            'PROTECCION_CIVIL' => 2,
            'MEDIO_AMBIENTE' => 3,
            'SERVICIOS_PUBLICOS' => 4,
        ];

        foreach ($entidadesRevision as $entidadRevisionId) {
            $NegociosTramitesDuplicados = Negocio::select('id', 'nombre_del_negocio')->
                whereHas('tramites_comercio', function ($tramiteComercio) use ($entidadRevisionId) {
                    $tramiteComercio->whereHas('tramites', function ($tramite) use ($entidadRevisionId) {
                        $tramite->whereHas('catalogo_tramites', function ($catalogoTramite) use ($entidadRevisionId) {
                            $catalogoTramite->where('entidad_revisora_id', $entidadRevisionId);
                        });
                    });
                }, '>', 1)->
                with(['tramites_comercio' => function ($tramiteComercio) use ($entidadRevisionId) {
                    $tramiteComercio->
                        with('tramites')->
                        whereHas('tramites', function ($tramite) use ($entidadRevisionId) {
                            $tramite->whereHas('catalogo_tramites', function ($catalogoTramite) use ($entidadRevisionId) {
                                $catalogoTramite->where('entidad_revisora_id', $entidadRevisionId);
                            });
                        })->orderBy('id', 'asc');
                }])->
                get();

            foreach ($NegociosTramitesDuplicados as $negocio) {
                $tramiteComercioViejo = $negocio->tramites_comercio[0];
                $tramiteViejo = $tramiteComercioViejo->tramites[0];

                $tramiteComercioNuevo = $negocio->tramites_comercio[1];
                $tramiteNuevo = $tramiteComercioNuevo->tramites[0];

                Log::build([
                    'driver' => 'single',
                    'path' => storage_path('logs/fix-tramites.log'),
                ])->info('Borrando tramite duplicado.', [
                    'entidad_revisora_id' => $entidadRevisionId,
                    'negocio_id' => $negocio->id,
                    'tramite_comercio_anterior_id' => $tramiteComercioViejo->id,
                    'tramite_comercio_nuevo_id' => $tramiteComercioNuevo->id,

                    'tramite_anterior_id' => $tramiteViejo->id,
                    'tramite_nuevo_id' => $tramiteNuevo->id,
                ]);

                $tramiteViejo->delete();
                $tramiteComercioViejo->delete();
            }
        }
    }
}
