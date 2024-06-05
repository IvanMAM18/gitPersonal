<?php

namespace App\Listeners;

use App\Events\TramiteCargado;
use App\Helpers\AvisosEnteroAPI;
use App\Models\AvisoEntero;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerificarPagoTramite implements ShouldQueue
{
    public $tries = 3;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @return void
     */
    public function handle(TramiteCargado $event)
    {
        $tramite = $event->tramite;
        $avisoEntero = $tramite ? $tramite->aviso_entero : null;
        if (! $avisoEntero || ! $avisoEntero->vigente) {
            return;
        }

        if (! isProduction()) {
            // temporalmente en lo que se arregla.
            return;
        }

        $detallesAvisoEntero = AvisosEnteroAPI::obtenerDetallesAvisoEntero($avisoEntero);

        $avisoEntero = self::actualizarEstadoAvisoEntero($avisoEntero, $detallesAvisoEntero);
        $avisoEntero = self::checarVigenciaAvisoEntero($avisoEntero, $detallesAvisoEntero);

        if ($avisoEntero->isDirty()) {
            $avisoEntero->save();
        }
    }

    private static function actualizarEstadoAvisoEntero(AvisoEntero $avisoEntero, $detallesAvisoEntero)
    {
        $estadoAviso = $detallesAvisoEntero['estado_aviso'];
        $estadoFactura = $detallesAvisoEntero['estado_factura'];
        $estado = $estadoAviso ?? $estadoFactura ?? 'V';

        switch ($estado) {
            case 'C':
                $avisoEntero->estado = 'EXPIRADO';
                break;
            case 'P':
                $avisoEntero->estado = 'PAGADO';
                break;
            case 'V':
            default:
                $avisoEntero->estado = 'VIGENTE';
                break;
        }

        return $avisoEntero;
    }

    private static function checarVigenciaAvisoEntero(AvisoEntero $avisoEntero, $detallesAvisoEntero)
    {
        if (! $avisoEntero->vigente) {
            return $avisoEntero;
        }

        $fechaActual = \Carbon\Carbon::now()->startOfDay();
        $fechaVencimiento = \Carbon\Carbon::createFromFormat(
            'Y-m-d',
            $detallesAvisoEntero['fecha_vig']
        )->endOfDay();
        $avisoEntero->estado = $fechaActual->isAfter($fechaVencimiento)
            ? 'EXPIRADO'
            : 'VIGENTE';

        return $avisoEntero;
    }
}
