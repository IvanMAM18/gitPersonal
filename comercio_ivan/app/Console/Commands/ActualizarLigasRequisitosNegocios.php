<?php

namespace App\Console\Commands;

use App\Models\Revision;
use App\Models\Tramite;
use Illuminate\Console\Command;
use App\Models\Negocio;
use Illuminate\Support\Facades\DB;

class ActualizarLigasRequisitosNegocios extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:actualizar-ligas-negocio-requisitos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza el tramite_id de los requisito_negocio que no lo tienen.';


    /**
     * Execute the console command.
     */
    public function handle()
    {

        DB::beginTransaction();

        try {
            $negocios = Negocio::whereHas('revisiones')->get();
            {
                foreach ($negocios as $negocio) {
                    foreach ($negocio->revisiones as $revision) {
                        foreach ($revision->estados_revision as $edo) {

                            if (!$edo->negocio_requisitos->isEmpty())
                                foreach ($edo->negocio_requisitos as $r) {
                                    $negocio_requisito_archivo = $r->negocio_requisito_archivo->where('negocio_id', $revision->negocio_id)->where('requisito_id', $r->requisito_id)->first();

                                    if ($negocio_requisito_archivo == null)
                                        continue;
                                    else {

                                        if ($negocio_requisito_archivo->tramite_id == null) {
                                            $anio = $negocio_requisito_archivo->created_at->year;
                                            $padre = $negocio->getTramitePadrePorAño($anio);
                                            if ($padre == null) {
                                                if ($anio == 2023)
                                                    $padre = $negocio->getTramitePadrePorAño(2024)->tramitesHijos()
                                                        ->where('catalogo_tramites_id', $revision->tramite->catalogo_tramites_id)
                                                        ->first();
                                                else
                                                    $tramite = $negocio->getTramitePadrePorAño(2023)->tramitesHijos()
                                                        ->where('catalogo_tramites_id', $revision->tramite->catalogo_tramites_id)
                                                        ->first();

                                                //dd($negocio,$negocio_requisito_archivo,$tramite);
                                            } else {
                                                $tramite = $negocio->getTramitePadrePorAño($anio)->tramitesHijos()
                                                    ->where('catalogo_tramites_id', $revision->tramite->catalogo_tramites_id)
                                                    ->first();
                                            }

                                            if ($tramite == null) {


                                                $tramitesR = $negocio->getTramitePadrePorAño($anio)->tramitesHijos()->get();
                                                if ($tramitesR->count() >= 3) {
                                                    if ($anio == 2023)
                                                        $tramite = $negocio->getTramitePadrePorAño(2024)->tramitesHijos()
                                                            ->where('catalogo_tramites_id', $revision->tramite->catalogo_tramites_id)
                                                            ->first();
                                                    else
                                                        $tramite = $negocio->getTramitePadrePorAño(2023)->tramitesHijos()
                                                            ->where('catalogo_tramites_id', $revision->tramite->catalogo_tramites_id)
                                                            ->first();
                                                }
                                                //dd($negocio_requisito_archivo, $anio,$negocio,$negocio->getTramitePadrePorAño($anio)->tramitesHijos()->get(),$revision->tramite->catalogo_tramites_id,$tramite);
                                            }
                                            $negocio_requisito_archivo->tramite_id = optional($tramite)->id ?? 0;
                                            $negocio_requisito_archivo->save();

                                            //dd($negocio_requisito_archivo,$tramite);
                                        }

                                    }
                                }
                        }
                    }
                }
            }
        } catch (\Exception $exception) {
            $this->error($exception->getMessage());
            DB::rollBack();
            return Command::FAILURE;
        }

        DB::commit();
        return Command::FAILURE;
    }
}
