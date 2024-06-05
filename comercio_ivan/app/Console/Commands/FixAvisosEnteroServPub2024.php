<?php

namespace App\Console\Commands;

use App\Http\Controllers\EntidadRevisionController;
use App\Http\Controllers\PagosController;
use App\Models\AvisoEntero;
use App\Models\ConceptoDetalle;
use App\Models\Tramite;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Log;

class FixAvisosEnteroServPub2024 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:avisos-enteros-serv-pub2024';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Elimina los avisos de entero generados en enero del 2024 por la entidad servicios publicos y los vuelve a generar.';

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
        $conceptoDetalleId = 28;

        $entidadRevisionController = new EntidadRevisionController();
        $pagosController = new PagosController();
        $conceptoDetalle = ConceptoDetalle::find($conceptoDetalleId);

        $avisosEntero = AvisoEntero::where('estado', 'VIGENTE')
            ->where('created_at', '>', '2024-01-01 00:00:00')
            ->whereHas('tramite', function ($tramite) {
                $tramite->whereHas('catalogo_tramite', function ($catalogoTramite) {
                    $catalogoTramite->where('entidad_revisora_id', 4);
                })->where('created_at', '>', '2024-01-01 00:00:00');
            })->get();

        $bar = $this->output->createProgressBar($avisosEntero->count());

        $bar->start();

        $avisosEntero->each(function ($avisoEntero) use (
            $pagosController,
            $entidadRevisionController,
            $conceptoDetalle,
            $bar
        ) {
            $this->info("Trabajando en aviso id: {$avisoEntero->id}.");

            $nuevoAvisoEntero = null;
            $tramite = Tramite::find($avisoEntero->tramite_id);
            $negocio = $tramite->tramitable;

            if (
                $negocio->autoempleo == true
                || $negocio->no_empleados_h > 0
                || $negocio->no_empleados_m > 0
            ) {
                $request = new Request();
                $request->merge([
                    'negocio_id' => $negocio->id,
                    'anio' => $tramite->created_at->year,
                ]);
                $response = $entidadRevisionController->calcularDetallesIncisos($request, $conceptoDetalle);
                $valores = $response['valores'];

                $direccion = $this->formatearDireccion($negocio->direccion);
                $detalle1 = "TRAMITE ID: {$tramite->tramite_padre->id} NOMBRE COMERCIAL: {$negocio->nombre_del_negocio}, {$direccion}";
                $detalle1 = $this->cleanString($detalle1);

                $umaAnual = $valores['UMA_ANUAL'] ? $valores['UMA_ANUAL'].' UMA ANUAL' : 'N/A';
                $mesesTexto = $valores['MESES_TEXTO'] ? $valores['MESES_TEXTO'] : 'N/A';
                $detalle2 = "{$valores['DESCRIPCION_TARIFA']} ({$umaAnual}) {$mesesTexto} 2024";
                $detalle2 = $this->cleanString($detalle2);
                $request = new Request();
                $request->merge([
                    'tramite_id' => $avisoEntero->tramite_id,
                    'concepto_id' => $conceptoDetalle->concepto_id,
                    'concepto_detalle_id' => $conceptoDetalle->id,
                    'detalle1' => $detalle1,
                    'detalle2' => $detalle2,
                    'adeudo' => 0,
                    'descuento' => 0,
                    'descuento2023' => 0,
                    'anio' => 2024,
                    'incisos_valor_manual' => [],
                    'incisos' => [82, 83, 84],
                ]);
                $pagosController->crear($request);

                $nuevoAvisoEntero = AvisoEntero::where('tramite_id', $avisoEntero->tramite_id)->
                    latest()->first();
            }

            Log::build([
                'driver' => 'single',
                'path' => storage_path('logs/fix-avisos-entero.log'),
            ])->info('Fix aviso entero Enero 2024.', [
                'aviso_entero_id' => $avisoEntero->id,
                'nuevo_aviso_entero_id' => $nuevoAvisoEntero ? $nuevoAvisoEntero->id : 0,
                'folio' => $avisoEntero->no_aviso,
                'tramite_id' => $avisoEntero->tramite_id,
                'total' => $avisoEntero->total,
                'total_nuevo' => $nuevoAvisoEntero ? $nuevoAvisoEntero->total : 0,
                'fecha creacion' => $avisoEntero->created_at,
                'servidor_publico_id' => $avisoEntero->servidor_publico_id,
            ]);

            $avisoEntero->delete();

            usleep(200000);
            $bar->advance();
        });

        $bar->finish();
    }

    private function cleanString($value)
    {
        $value = strtoupper($value);
        $value = str_replace('Á', 'A', $value);
        $value = str_replace('É', 'E', $value);
        $value = str_replace('Í', 'I', $value);
        $value = str_replace('Ó', 'O', $value);
        $value = str_replace('Ú', 'U', $value);
        $value = trim($value);

        return $value;
    }

    private function formatearDireccion($direccion)
    {
        $calle = $direccion->calle_principal
            ? "{$direccion->calle_principal} "
            : 'SIN CALLE ';
        $numeroExterno = $direccion->numero_externo
            ? "NO.EXT.{$direccion->numero_externo} "
            : '';
        $numeroInterno = $direccion->numero_interno
            ? "NO.INT.{$direccion->numero_interno} "
            : '';
        $entreCalles = $direccion->calles
            ? "{$direccion->calles} "
            : '';
        $codigoPostal = $direccion->codigo_postal
            ? "C.P. {$direccion->codigo_postal} "
            : '';
        $colonia = $direccion->colonia
            ? "COL. {$direccion->colonia->nombre_localidad} "
            : '';

        return "{$calle}{$numeroExterno}{$numeroInterno}{$entreCalles}{$codigoPostal}{$colonia}";
    }
}
