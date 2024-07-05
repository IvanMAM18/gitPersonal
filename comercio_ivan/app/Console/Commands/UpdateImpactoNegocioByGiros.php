<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Negocio;
use Log;

class UpdateImpactoNegocioByGiros extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-impacto-negocio-by-giros';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';



    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->getNegociosWithUpdatedGiros();
        return Command::SUCCESS;
    }
    protected function getNegociosWithUpdatedGiros()
    {
        $allGirosQueCambiaron = array_merge($this->getGirosQueCambiaronAlto(), $this->getGirosQueCambiaronBajo());
        try {
            $year = now()->year;
            $negocios = Negocio::
                select(["id", "nombre_del_negocio", "impacto_giro_comercial"])
                ->with("giro_comercial")
                ->with("tramites", function ($t) use ($year) {
                    $t->whereYear("created_at", $year);
                })
                ->whereHas('giro_comercial', function ($giroComercial) use ($allGirosQueCambiaron) {
                    $giroComercial->whereIn('giro_comercial.clave_scian', $allGirosQueCambiaron);
                })
                ->get();

            foreach ($negocios as $negocio) {
                $giros = $negocio->giro_comercial;

                $impactoByGiros = "bajo_impacto";
                foreach ($giros as $giro) {
                    if ($giro->tipo == "mediano_alto_impacto") {
                        $impactoByGiros = $giro->tipo;
                    }
                }
                $tramitePadre = $negocio->tramitePadre($year);

                if ($impactoByGiros != $negocio->impacto_giro_comercial && $tramitePadre != null) {


                    //Solo negocios con tramite padre
                    $catTramitePadreId = $tramitePadre->catalogo_tramites_id;
                    $newCatalogoTramitePadreId = null;
                    switch ($catTramitePadreId) {
                        case CatalogoTramitesPorImpacto::get("lf_mediano_alto_impacto"):
                        case CatalogoTramitesPorImpacto::get("lf_bajo_impacto"):
                            $newCatalogoTramitePadreId = CatalogoTramitesPorImpacto::get("lf_" . $impactoByGiros);
                            break;
                        case CatalogoTramitesPorImpacto::get("lfr_mediano_alto_impacto"):
                        case CatalogoTramitesPorImpacto::get("lfr_bajo_impacto"):
                            $newCatalogoTramitePadreId = CatalogoTramitesPorImpacto::get("lfr_" . $impactoByGiros);
                            break;
                        default:
                            # code...
                            break;
                    }
                    if ($newCatalogoTramitePadreId != null) {
                        Log::build([
                            'driver' => 'single',
                            'path' => storage_path('logs/update_negocio_impacto_por_giro.log'),
                        ])->info(
                                $negocio->nombre_del_negocio,
                                [
                                    "IMPACTO" => $impactoByGiros,
                                    "OLD_CAT_TRAM_ID" => $catTramitePadreId,
                                    "NEW_CAT_TRAM_ID" => $newCatalogoTramitePadreId,
                                ]
                            );
                        $negocio->catalogo_tramite_id = $newCatalogoTramitePadreId;
                        $tramitePadre->catalogo_tramites_id = $newCatalogoTramitePadreId;
                        $tramitePadre->save();
                    }

                    foreach ($negocio->tramites as $tramite) {
                        $tctId = $tramite->catalogo_tramites_id;
                        $newCatalogoTramiteId = null;
                        switch ($tctId) {
                            case CatalogoTramitesPorImpacto::get("us_mediano_alto_impacto"):
                            case CatalogoTramitesPorImpacto::get("us_bajo_impacto"):
                                $newCatalogoTramiteId = CatalogoTramitesPorImpacto::get("us_" . $impactoByGiros);
                                break;
                            case CatalogoTramitesPorImpacto::get("dpc_mediano_alto_impacto"):
                            case CatalogoTramitesPorImpacto::get("dpc_bajo_impacto"):
                                $newCatalogoTramiteId = CatalogoTramitesPorImpacto::get("dpc_" . $impactoByGiros);
                                break;
                            case CatalogoTramitesPorImpacto::get("ma_mediano_alto_impacto"):
                            case CatalogoTramitesPorImpacto::get("ma_bajo_impacto"):
                                $newCatalogoTramiteId = CatalogoTramitesPorImpacto::get("ma_" . $impactoByGiros);
                                break;
                            default:
                                # code...
                                break;
                        }
                        // if ($negocio->id == 5212)
                        //     Log::build([
                        //         'driver' => 'single',
                        //         'path' => storage_path('logs/update_negocio_impacto_por_giro.log'),
                        //     ])->info(
                        //             $negocio->nombre_del_negocio,
                        //             [
                        //                 "tctId" => $tctId,
                        //                 "us_mediano_alto_impacto" => CatalogoTramitesPorImpacto::get("us_mediano_alto_impacto"),
                        //                 "us_bajo_impacto" => CatalogoTramitesPorImpacto::get("us_bajo_impacto"),
                        //                 "catTramitePadreId" => $catTramitePadreId,
                        //                 "lfr_mediano_alto_impacto" => CatalogoTramitesPorImpacto::get("lfr_mediano_alto_impacto"),
                        //                 "lfr_bajo_impacto" => CatalogoTramitesPorImpacto::get("lfr_bajo_impacto"),
                        //                 "newCatalogoTramiteId" => $newCatalogoTramiteId
                        //             ]
                        //         );
                        $esRefrendo = $catTramitePadreId == CatalogoTramitesPorImpacto::get("lfr_mediano_alto_impacto")
                            || $catTramitePadreId == CatalogoTramitesPorImpacto::get("lfr_bajo_impacto");
                        $esUsoSuelo = $tctId == CatalogoTramitesPorImpacto::get("us_mediano_alto_impacto")
                            || $tctId == CatalogoTramitesPorImpacto::get("us_bajo_impacto");

                        if ($esRefrendo == true && $esUsoSuelo == true) {
                            continue;
                        }

                        if ($newCatalogoTramiteId != null) {
                            Log::build([
                                'driver' => 'single',
                                'path' => storage_path('logs/update_negocio_impacto_por_giro.log'),
                            ])->info(
                                    $negocio->nombre_del_negocio,
                                    [
                                        "IMPACTO" => $impactoByGiros,
                                        "OLD_CAT_TRAM_ID" => $tctId,
                                        "NEW_CAT_TRAM_ID" => $newCatalogoTramiteId,
                                    ]
                                );
                            // if ($negocio->id == 5212)
                            //     Log::build([
                            //         'driver' => 'single',
                            //         'path' => storage_path('logs/update_negocio_impacto_por_giro.log'),
                            //     ])->info(
                            //             $negocio->nombre_del_negocio . "dddd",
                            //             [
                            //                 "tctId" => $tctId,
                            //                 "us_mediano_alto_impacto" => CatalogoTramitesPorImpacto::get("us_mediano_alto_impacto"),
                            //                 "us_bajo_impacto" => CatalogoTramitesPorImpacto::get("us_bajo_impacto"),
                            //                 "catTramitePadreId" => $catTramitePadreId,
                            //                 "lfr_mediano_alto_impacto" => CatalogoTramitesPorImpacto::get("lfr_mediano_alto_impacto"),
                            //                 "lfr_bajo_impacto" => CatalogoTramitesPorImpacto::get("lfr_bajo_impacto"),
                            //             ]
                            //         );
                            $tramite->catalogo_tramites_id = $newCatalogoTramiteId;
                            $tramite->save();
                        }

                    }
                    $negocio->impacto_giro_comercial = $impactoByGiros;
                    $negocio->save();
                    // if ($negocio->id == -5212) {
                    //     Log::build([
                    //         'driver' => 'single',
                    //         'path' => storage_path('logs/update_negocio_impacto_por_giro.log'),
                    //     ])->info(
                    //             $negocio->nombre_del_negocio,
                    //             [
                    //                 "id" => $negocio->id,
                    //                 "impacto_giro_comercial" => $negocio->impacto_giro_comercial,
                    //                 "impacto_by_giros" => $impactoByGiros,
                    //             ]
                    //         );
                    //     Log::build([
                    //         'driver' => 'single',
                    //         'path' => storage_path('logs/update_negocio_impacto_por_giro.log'),
                    //     ])->info(
                    //             "TRMAITE PADRE",
                    //             [

                    //                 "TRAMITE_PADRE: " => $tramitePadre,
                    //             ]
                    //         );
                    //     foreach ($negocio->tramites as $tramite) {
                    //         Log::build([
                    //             'driver' => 'single',
                    //             'path' => storage_path('logs/update_negocio_impacto_por_giro.log'),
                    //         ])->info(
                    //                 "SUB_TRAMITES: " . $tramite->id,
                    //                 [
                    //                     "tramite" => $tramite

                    //                 ]
                    //             );
                    //     }
                    // }
                }

            }

        } catch (\Throwable $th) {
            Log::build([
                'driver' => 'single',
                'path' => storage_path('logs/update_negocio_impacto_por_giro.log'),
            ])->info(
                    'ERROR.',
                    [
                        "error" => $th,
                    ]
                );
        }
    }

    protected function getGirosQueCambiaronAlto()
    {
        return [
            111110,
            238190,
            326290,
            327991,
            463112,
            463217,
            465911,
            465914,
            467111,
            467117,
            468211,
            512130,
            522460,
            611171,
            623311,
            711131,
            713998,
            713999,
            812310,
            813230,
            931310,

        ];
    }
    protected function getGirosQueCambiaronBajo()
    {
        return [
            111121,
            339940,
            461150,
            467112,
            532210
        ];
    }
}

class CatalogoTramitesPorImpacto
{
    const LIC_FUNC_MAI = 1;
    const LIC_FUNC_BI = 2;
    const LIC_FUNC_REF_MAI = 3;
    const LIC_FUNC_REF_BI = 4;
    const US_BI = 5;
    const US_MAI = 6;
    const DPC_BI = 7;
    const DPC_MAI = 8;
    const MA_BI = 10;
    const MA_MAI = 11;


    private static $map = [
        'lf_mediano_alto_impacto' => self::LIC_FUNC_MAI,
        'lf_bajo_impacto' => self::LIC_FUNC_BI,
        'lfr_mediano_alto_impacto' => self::LIC_FUNC_REF_MAI,
        'lfr_bajo_impacto' => self::LIC_FUNC_REF_BI,
        'us_bajo_impacto' => self::US_BI,
        'us_mediano_alto_impacto' => self::US_MAI,

        'dpc_bajo_impacto' => self::DPC_BI,
        'dpc_mediano_alto_impacto' => self::DPC_MAI,

        'ma_bajo_impacto' => self::MA_BI,
        'ma_mediano_alto_impacto' => self::MA_MAI,

    ];

    public static function get($key)
    {
        if (isset(self::$map[$key])) {
            return self::$map[$key];
        }

    }
}
