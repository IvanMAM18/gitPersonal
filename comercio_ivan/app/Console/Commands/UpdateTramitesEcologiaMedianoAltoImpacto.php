<?php

namespace App\Console\Commands;

use App\Models\Revision;
use Illuminate\Console\Command;
use App\Helpers\ClavesScian;
use Illuminate\Support\Facades\DB;

class UpdateTramitesEcologiaMedianoAltoImpacto extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-tramites-ecologia-mediano-alto-impacto';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * @var ClavesScian
     */
    private $clavesScian;

    public function __construct(ClavesScian $clavesScian)
    {
        parent::__construct();
        $this->clavesScian = $clavesScian;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->revertTramites();
        $this->updateTramites();
        return Command::SUCCESS;
    }

    public function revertTramites()
    {
        $this->clavesScian->cargarArchivo('/data/ecologia_scian.json');
        DB::beginTransaction();
        try {
            $revisiones = Revision::with('tramite')
                ->where('entidad_revision_id', 3)
                ->get();
            $revisionesEncontradas = 0;

            foreach ($revisiones as $revision) {

                if ($revision?->tramite?->tramitable) {
                    $giros = $revision->tramite->tramitable->giro_comercial;
                    if ($revision->tramite->tramitable->impacto_giro_comercial == "mediano_alto_impacto") {
                        $noSeEncuentra = $this->clavesScian->items()->pluck('CLAVE_SCIAN')->intersect($giros->pluck('clave_scian'))->isEmpty();
                        if ($noSeEncuentra) {
                            $revision->tramite->update(['catalogo_tramites_id' => 11]);
                            $revision->update(['status' => 'ENVIADO']);
                            $revisionesEncontradas += 1;
                        }
                    }
                }
            }
            DB::commit();
        } catch (\Exception $exception) {
            $this->error($exception->getMessage());
            DB::rollBack();
        }
        $this->info("Número de revisiones revertidas: " . $revisionesEncontradas);
    }

    public function updateTramites()
    {
        $this->clavesScian->cargarArchivo('/data/nuevos_ecologia_scian.json');
        DB::beginTransaction();
        try {
            $revisiones = Revision::with('tramite')
                ->where('entidad_revision_id', 3)
                ->get();
            $revisionesEncontradas = 0;


            foreach ($revisiones as $revision) {

                if ($revision?->tramite?->tramitable) {
                    $giros = $revision->tramite->tramitable->giro_comercial;

                    if ($revision->tramite->tramitable->impacto_giro_comercial == "mediano_alto_impacto") {
                        $noSeEncuentra = $this->clavesScian->items()->pluck('CLAVE_SCIAN')->intersect($giros->pluck('clave_scian'))->isEmpty();
                        if ($noSeEncuentra) {
                            $revision->tramite->update(['catalogo_tramites_id' => 10]);
                            $revision->update(['status' => 'VISOR']);
                            $revisionesEncontradas += 1;
                        }
                    }
                }
            }
            DB::commit();
        } catch (\Exception $exception) {
            $this->error($exception->getMessage());
            DB::rollBack();
        }
        $this->info("Número de revisiones actualizadas: " . $revisionesEncontradas);
    }
}
