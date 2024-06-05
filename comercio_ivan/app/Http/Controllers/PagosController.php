<?php

namespace App\Http\Controllers;

use App\Models\AvisoEntero;
use App\Models\Concepto;
use App\Models\ConceptoDetalle;
use App\Models\Negocio;
use App\Models\PersonaMoral;
use App\Models\Tramite;
use Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Response;

class PagosController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'tramite_id' => ['required'],
            'concepto_id' => ['required'],
            'concepto_detalle_id' => ['required'],
        ], [
            'tramite_id.required' => 'El campo tramite es obligatorio.',
            'concepto_id.required' => 'El campo concepto es obligatorio.',
            'concepto_detalle_id.required' => 'El campo detalles del concepto es obligatorio.',
        ]);

        $logName = storage_path("logs/pagos/tramite-{$request->tramite_id}.log");

        $rfc = $curp = $nombre = $apellido1 = $apellido2 = $direccion = '';

        $tramite = Tramite::find($request->tramite_id);
        $concepto = Concepto::find($request->concepto_id);
        $conceptoDetalle = ConceptoDetalle::find($request->concepto_detalle_id);
        $detalle1 = $request->input('detalle1', '');
        $detalle2 = $request->input('detalle2', '');
        $info = $request->input('info', '');
        $adeudo = round($request->input('adeudo', 0), 2);
        $descuento = round($request->input('descuento', 0), 2);
        $descuento2023 = round($request->input('descuento2023', 0), 2);
        $incisosValorManual = $request->input('incisos_valor_manual', []);
        $year = $request->input('anio', 2023);

        self::log('PagosController::store().', $logName);
        self::log('Request', $logName);
        self::log($request->all(), $logName);

        $valores = [
            'descuento2023' => $descuento2023,
            'descuento' => $descuento,
            'adeudo' => $adeudo,
            'incisosValorManual' => $incisosValorManual,
            'anio' => $year,
        ];

        $incisos = $conceptoDetalle->obtenerIncisosAvisoEntero($tramite->tramitable, $valores);
        $subtotal = round($conceptoDetalle->calcularIncisos($tramite->tramitable, $valores)['total'], 2);
        $incisos = $this->agregarAdeudoDescuento($incisos, $adeudo, $descuento + $descuento2023);
        $total = $subtotal;

        $incisos = array_values(
            array_filter($incisos, function ($inciso) {
                return ! array_key_exists('opciones', $inciso)
                || (
                    array_key_exists('opciones', $inciso)
                    && $inciso['opciones'] == null
                ) || (
                    array_key_exists('opciones', $inciso)
                    && $inciso['opciones'] != null
                    && ! in_array('VALOR_MANUAL', $inciso['opciones'])
                ) || (
                    array_key_exists('opciones', $inciso)
                    && $inciso['opciones'] != null
                    && in_array('VALOR_MANUAL', $inciso['opciones'])
                    && $inciso['importe'] != 0
                );
            })
        );

        $fechaEmision = \Carbon\Carbon::now()->format('Y-m-d');

        $fechaVigencia = \Carbon\Carbon::now()->endOfYear()->format('Y-m-d');

        if (\Carbon\Carbon::now()->month == 1) {
            $fechaVigencia = \Carbon\Carbon::now()->endOfMonth()->format('Y-m-d');
        }

        if ($tramite->tramitable instanceof Negocio) {
            $personaMoral = $tramite->tramitable->persona_moral;
            $persona = $tramite->tramitable->user;
            $direccion = $tramite->tramitable->direccion->calle_principal.' '.$tramite->tramitable->direccion->numero_externo;
            $codigoPostal = $tramite->tramitable->direccion->codigo_postal;
        } else {
            $direccionNotificacion = $tramite->tramitable->direccion_notificacion;

            $direccion = $direccionNotificacion->calle_principal.' '.$direccionNotificacion->numero_externo;
            $codigoPostal = $direccionNotificacion->codigo_postal;

            $personaMoral = $tramite->tramitable;
            $persona = $tramite->tramitable;

            //            $personaMoral = $tramite->tramite_persona->persona::class == PersonaMoral::class
            //                ? $tramite->tramite_persona->persona
            //                : null;
            //            $persona = $tramite->tramite_persona->persona::class == PersonaMoral::class
            //                ? $tramite->tramite_persona->persona->persona
            //                : $tramite->tramite_persona->persona;
        }

        if ($personaMoral instanceof PersonaMoral) {
            $nombre = $personaMoral->razon_social;
            $apellido1 = '';
            $apellido2 = '';
            $rfc = $personaMoral->rfc;
            $curp = $persona ? $persona->curp : '';
            $regimenFiscal = $personaMoral->regimen_fiscal;
        } else {
            $nombre = $persona ? $persona->nombre : '';
            $apellido1 = $persona ? $persona->apellido_pat : '';
            $apellido2 = $persona ? $persona->apellido_mot : '';
            $rfc = $persona ? $persona->rfc : '';
            $curp = $persona ? $persona->curp : '';
            $regimenFiscal = $persona ? $persona->regimen_fiscal : null;
        }

        $token = $this->obtenerTokenAPI();

        $servicio = in_array($tramite->catalogo_tramite->entidad_revisora_id, [7])
            ? 'AJ'
            : 'Q';

        $datosGenerarAPI = [
            'fecha_emi' => $fechaEmision,
            'fecha_vig' => $fechaVigencia,
            'servicio' => $servicio,
            'nombre' => $nombre,
            'apellido1' => $apellido1,
            'apellido2' => $apellido2,
            'obs1' => $concepto->nombre,
            'obs2' => $detalle1,
            'obs3' => $detalle2,
            'obs4' => $info,
            'rfc' => $rfc,
            'direccion' => $direccion,
            'cp' => $codigoPostal,
            'curp' => $curp,
            'regimen_fiscal' => $regimenFiscal,
            'detalles' => $incisos,
        ];

        self::log('Generar aviso Request.', $logName);
        self::log($datosGenerarAPI, $logName);

        $respuesta = Http::withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->post('https://catastro.lapaz.gob.mx/catastro/avisos/generar', $datosGenerarAPI);

        self::log('Generar aviso Response.', $logName);
        self::log($respuesta->json(), $logName);

        $no_aviso = $respuesta['no_aviso'];

        $servidorPublicoId = $user ? $user->id : 0;

        $avisoEntero = AvisoEntero::create([
            'no_aviso' => $no_aviso,
            'tramite_id' => $tramite->id,
            'pago_id' => 1,
            'servidor_publico_id' => $servidorPublicoId,
            'estado' => 'VIGENTE',
            'subtotal' => $subtotal + $descuento + $descuento2023,
            'descuento' => $descuento + $descuento2023,
            'total' => $total,
        ]);

        return $avisoEntero;
    }

    public function obtenerPDFAvisoEntero(Request $request, AvisoEntero $avisoEntero)
    {
        $tramite = $avisoEntero->tramite;
        $catalogoTramite = $tramite ? $tramite->catalogo_tramites : null;
        $entidadRevision = $catalogoTramite && count($catalogoTramite) > 0
            ? $catalogoTramite[0]->entidad_revisora
            : null;
        $titulo = $entidadRevision && count($entidadRevision) > 0
            ? $entidadRevision[0]->nombre
            : 'Aviso de entero';

        $token = $this->obtenerTokenAPI();
        if ($token != null) {
            try {
                $respuesta = Http::withHeaders([
                    'Authorization' => 'Bearer '.$token,
                ])->post('https://catastro.lapaz.gob.mx/catastro/avisos/pdf', [
                    'titulo' => $titulo,
                    'no_aviso' => $avisoEntero->no_aviso,
                ]);

                return Response::make($respuesta, 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="aviso.pdf"',
                ]);
            } catch (\Throwable $th) {
                return Response::make('Erro al obtener el aviso de entero', 200, [
                    'Content-Type' => 'text/html; charset=UTF-8',

                ]);
            }
        }

        return Response::make('Erro al obtener el aviso de entero', 200, [
            'Content-Type' => 'text/html; charset=UTF-8',

        ]);
    }

    public function obtenerTokenAPI()
    {
        try {
            $respuesta = Http::post('https://catastro.lapaz.gob.mx/catastro/authenticate', [
                'username' => 'api-comercio',
                'password' => 'api-comercio',
            ]);

            return $respuesta['token'];
        } catch (\Throwable $th) {
            return null;
        }
    }

    private function agregarAdeudoDescuento($incisos, $adeudo, $descuento)
    {
        $total = round($incisos[0]['importe'] + $adeudo, 2);
        $descuento = round($descuento, 2);
        $incisos[0] = [
            'importe' => $total,
            'descuento' => $descuento,
            'inciso' => $incisos[0]['inciso'],
            'descripcion' => $incisos[0]['descripcion'],
        ];

        return $incisos;
    }

    private function log($logData, $path)
    {
        Log::build([
            'driver' => 'single',
            'path' => $path,
        ])->info($logData);
    }
}
