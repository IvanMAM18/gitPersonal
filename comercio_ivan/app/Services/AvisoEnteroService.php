<?php

namespace App\Services;

use App\Events\TramiteCargado;

use App\Helpers\{
    AvisosEnteroAPI,
    EntidadRevisora,
    ServiciosPublicosPI
};

use App\Models\{
    AvisoEntero,
    CatalogoTramite,
    Concepto,
    ConceptoDetalle,
    EntidadRevision,
    Negocio,
    PersonaMoral,
    Requisito,
    TarifaProteccionCivil2024,
    Tramite,
    User
};

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AvisoEnteroService
{
    public static function conceptos(CatalogoTramite $catalogoTramite, $negocioId = null, $year = 2024) {
        if($catalogoTramite->entidad_revisora_id == 2) {
            $negocio = Negocio::find($negocioId);
            $negocio->anio_padre_tramite= $year;
            return self::conceptosServiciosPublicos($catalogoTramite, $negocio, $year);
        }

        return Concepto::where('entidad_revisora_id', $catalogoTramite->entidad_revisora_id)
            ->where(function ($query) use ($catalogoTramite) {
                $query->where('catalogo_tramites_id', $catalogoTramite->id)
                    ->orWhere('catalogo_tramites_id', null);
            })
            ->get();
    }

    public static function conceptosServiciosPublicos(CatalogoTramite $catalogoTramite, Negocio $negocio, $year = 2024) {
        $entidadRevisionId = EntidadRevisora::$PROTECCION_CIVIL;
        
        $conceptos = Concepto::where('entidad_revisora_id', $entidadRevisionId)
            ->where('anualidad', $year)
            ->get();

        $tieneProgramaInterno = $negocio->tieneProgramaInterno;

        if ($tieneProgramaInterno) {
            $conceptos = $conceptos->filter(function ($concepto) {
                $concepto->opciones = json_decode($concepto->opciones);

                return $concepto->opciones && in_array('PROGRAMA_INTERNO', $concepto->opciones);
            })->values();
        } else {
            $conceptos = $conceptos->filter(function ($concepto) {
                $concepto->opciones = json_decode($concepto->opciones);

                return $concepto->opciones == null || (
                    $concepto->opciones
                    && in_array('PROGRAMA_INTERNO', $concepto->opciones)
                ) == false;
            })->values();
        }

        return $conceptos;
    }

    public static function detallesPorConcepto(Concepto $concepto, $negocioId = null) {
        if($concepto->anualidad == 2024 && $concepto->entidad_revisora_id == 2) {
            $negocio = Negocio::find($negocioId);
            return self::detallesPorConceptoProteccionCivil($concepto, $negocio);
        }

        return $concepto->detalles;
    }

    public static function detallesPorConceptoProteccionCivil(Concepto $concepto, Negocio $negocio) {
        if (! $concepto || ! $negocio) {
            return [];
        }

        if ($negocio->esDistribuidoraDeGas) {
            return ConceptoDetalle::whereIn('id', [90])->get();
        }

        $conceptoDetallesIds = $concepto->detalles->map(function ($conceptoDetalle) {
            return $conceptoDetalle->id;
        });

        $girosComerciales = $negocio->giro_comercial;
        $sectores = collect([]);
        $girosComerciales->each(function ($giroComercial) use ($sectores) {
            $sector = strtoupper($giroComercial->tipo_sector);
            if (! $sector) {
                return;
            }
            $sectores->push($sector);
        });

        $tipoTarifa = $negocio->tipoTarifa;

        $tarifas = TarifaProteccionCivil2024::whereIn('sector', $sectores)->
            whereIn('concepto_detalle_id', $conceptoDetallesIds)->
            where('tipo_tarifa', $tipoTarifa)->
            get();

        if ($tarifas->count() == 0) {
            $opciones = is_array($concepto->opciones)
                ? $concepto->opciones
                : json_decode($concepto->opciones);
            $programaIntero = $opciones
                && in_array('PROGRAMA_INTERNO', $opciones);
            $tarifa = TarifaProteccionCivil2024::whereNull('sector')->
                whereNull('tipo_tarifa')->
                where('programa_interno', $programaIntero)->
                first();

            return collect([$tarifa->conceptoDetalle]);
        }

        $tarifas = $tarifas->sortByDesc('valor');

        return collect([$tarifas->first()->conceptoDetalle]);
    }

    public static function calcularIncisos(ConceptoDetalle $conceptoDetalle, Negocio $negocio, $valores = []) {
        if(!array_key_exists('anio', $valores)) {
            $valores['anio'] = 2024;
        }

        return $conceptoDetalle->calcularIncisos($negocio, $valores);
    }

    public static function generar(Tramite $tramite, ConceptoDetalle $conceptoDetalle, $detalles, $valores = [], $generadoAutomatico = false) {
        $logName = storage_path("logs/pagos/tramite-{$tramite->id}.log");

        $user = !$generadoAutomatico ? Auth::user() : null;
        
        $rfc = $curp = $nombre = $apellido1 = $apellido2 = $direccion = '';

        if(!array_key_exists('descuento2023', $valores)) {
            $valores['descuento2023'] = 0;
        }

        if(!array_key_exists('descuento', $valores)) {
            $valores['descuento'] = 0;
        }

        if(!array_key_exists('adeudo', $valores)) {
            $valores['adeudo'] = 0;
        }

        if(!array_key_exists('anio', $valores)) {
            $valores['anio'] = 2024;
        }

        if(!array_key_exists('incisosValorManual', $valores)) {
            $valores['incisosValorManual'] = [];
        }
        
        ['detalle1' => $detalle1, 'detalle2' => $detalle2, 'info' => $info] = $detalles;
        
        ['descuento2023' => $descuento2023, 'descuento' => $descuento, 'adeudo' => $adeudo] = $valores;

        $concepto = $conceptoDetalle->concepto;

        self::log('PagosController::store().', $logName);
        self::log('Request', $logName);
        self::log(array_merge($detalles, $valores), $logName);

        $incisos = $conceptoDetalle->obtenerIncisosAvisoEntero($tramite->tramitable, $valores);
        $subtotal = round($conceptoDetalle->calcularIncisos($tramite->tramitable, $valores)['total'], 2);
        $incisos = self::agregarAdeudoDescuento($incisos, $adeudo, $descuento + $descuento2023);
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

            // Este comentario estaba por que este codigo era parte de la logica original, 
            // creo que era para persona moral o persona fisica.
            //
            // Lo dejare por el momento
            //
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

        $respuesta = AvisosEnteroAPI::generar($datosGenerarAPI);

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

    public static function generarAutomatico(Tramite $tramite) {
        if(!$tramite->catalogo_tramite->pago) {
            return;
        }
        
        if(!$tramite->tramite_padre_id) {
            throw new \Exception('Error al generar aviso de entero automaticamente. El tramite debe ser tramite hijo.');
        }

        $conceptos = $detalles = $valores = null;

        if($tramite->tramitable instanceof Negocio) {
            $conceptos = self::conceptos($tramite->catalogo_tramite, $tramite->tramitable_id);
            $concepto = $conceptos->first();
            $conceptoDetalles = self::detallesPorConcepto($concepto, $tramite->tramitable_id);
            $conceptoDetalle = $conceptoDetalles->first();
            $valores = self::calcularIncisos($conceptoDetalle, $tramite->tramitable)['valores'];
        } else {
            $conceptos = self::conceptos($tramite->catalogo_tramite);
            $concepto = $conceptos->first();
            $conceptoDetalles = self::detallesPorConcepto($concepto);
            $conceptoDetalle = $conceptoDetalles->first();
            $valores = self::calcularIncisos($conceptoDetalle, new Negocio())['valores'];
        }

        if($conceptos->count() != 1) {
            throw new \Exception('Error al generar aviso de entero automaticamente. Tramite con multiples conceptos.');
        }
        if($conceptoDetalles->count() != 1) {
            throw new \Exception('Error al generar aviso de entero automaticamente. Tramite con multiples conceptos detalles.');
        }

        $detalle1 = self::detalle1Default($tramite);
        $detalle2 = self::detalle2Default($tramite, $conceptoDetalle, $valores);
        $detalles = ['detalle1' => $detalle1, 'detalle2' => $detalle2, 'info' => ''];

        self::generar($tramite, $conceptoDetalle, $detalles, [], true);
    }

    private static function detalle1Default(Tramite $tramite) {
        $detalle1 = "Tramite ID: {$tramite->tramite_padre_id}";
        if($tramite->tramitable instanceof Negocio) {
            $detalle1 .=  "\nNombre comercial: {$tramite->tramitable->nombre_del_negocio}";
        } else {
            $contribuyente = $tramite->tramitable instanceof PersonaMoral
                ? $tramite->tramitable->razon_social
                : "{$tramite->apellido_pat} {$tramite->apellido_mot}, {$tramite->nombre}";
            $detalle1 .=  "\nSolicitante: {$contribuyente}";
        }

        return self::quitarAcentos($detalle1);
    }

    private static function detalle2Default(Tramite $tramite, ConceptoDetalle $conceptoDetalle, $valores = []) {
        $concepto = $conceptoDetalle->concepto;
        $entidadRevision = $concepto->entidadRevision;
        $anioTramite = $tramite->created_at->year;
        
        $detalle2 = "";

        switch($entidadRevision->id) {
            case EntidadRevisora::$USO_DE_SUELO:
                //Uso de suelo
                break;
            case EntidadRevisora::$PROTECCION_CIVIL:
                if($anioTramite == 2024) {
                    $noEmpleados = array_key_exists('NO_EMPLEADOS', $valores) ? $valores['NO_EMPLEADOS'] : null;
                    $valorUMAs = array_key_exists('VALOR', $valores) ? $valores['VALOR'] : null;
                    $tarifaProgramaInterno = array_key_exists('TARIFA_PROGRAMA_INTERO', $valores) ? $valores['TARIFA_PROGRAMA_INTERO'] : null;
                    
                    $detalle2 = "{$conceptoDetalle->descripcion}";
                    $detalle2 .= $noEmpleados ? ", {$noEmpleados} Empleados" : "";
                    $detalle2 .= $valorUMAs ? ", {$valorUMAs} UMAs" : "";
                    $detalle2 .= $tarifaProgramaInterno ? ", Programa interno {$tarifaProgramaInterno} UMAs" : "";
                } else {
                    $noEmpleados = array_key_exists('NO_EMPLEADOS', $valores) ? $valores['NO_EMPLEADOS'] : null;
                    $negocioM2 = array_key_exists('NEGOCIO_M2', $valores) ? $valores['NEGOCIO_M2'] : null;

                    $programaInterno = $concepto->opciones && in_array('PROGRAMA_INTERNO', $concepto->opciones);
                    $detalle2 = "{$conceptoDetalle->descripcion}";
                    $detalle2 .= $programaInterno ? " {$negocioM2} Metros cuadrados" : "";
                    $detalle2 .= $programaInterno ? ", {$noEmpleados} Empleados" : "";
                }
                break;
            case EntidadRevisora::$ECOLOGIA:
                break;
            case EntidadRevisora::$SERVICIOS_PUBLICOS:
                //Servicios Publicos
                if($anioTramite == 2024) {
                    $descripcionTarifa = array_key_exists('DESCRIPCION_TARIFA', $valores) ? $valores['DESCRIPCION_TARIFA'] : null;
                    $UMAAnual = array_key_exists('UMA_ANUAL', $valores) ? $valores['UMA_ANUAL'] : null;
                    $mesesTexto = array_key_exists('MESES_TEXTO', $valores) ? $valores['MESES_TEXTO'] : null;

                    $detalle2 = "{$descripcionTarifa}";
                    $detalle2 .= $UMAAnual ? " ({$UMAAnual})" : " (N/A)";
                    $detalle2 .= $mesesTexto ? " {$mesesTexto}" : " N/A";
                } else {
                    $giro = array_key_exists('GIRO', $valores) ? $valores['GIRO'] : null;
                    $frecuencia = array_key_exists('FRECUENCIA', $valores) ? $valores['FRECUENCIA'] : null;
                    $volumen = array_key_exists('VOLUMEN', $valores) ? $valores['VOLUMEN'] : null;
                    $valorUMA = array_key_exists('VALOR_UMA', $valores) ? $valores['VALOR_UMA'] : null;
                    $mesesTexto = array_key_exists('MESES_TEXTO', $valores) ? $valores['MESES_TEXTO'] : null;

                    ['GIRO' => $giro, 'FRECUENCIA' => $frecuencia, 'VOLUMEN' => $volumen] = $valores;
                    ['VALOR_UMA' => $valorUMA, 'MESES_TEXTO' => $mesesTexto] = $valores;

                    $detalle2 = $giro ? "{$giro} - " : "N/A - ";
                    $detalle2 = $frecuencia ? " {$frecuencia}" : "N/A";
                    $detalle2 = $volumen ? " Volumen {$volumen}" : "N/A";
                    $detalle2 = $valorUMA ? " {$valorUMA} UMA" : "N/A";
                    $detalle2 = $mesesTexto ? " {$mesesTexto}" : " N/A";
                }
                $detalle2 .= " {$anioTramite}";
                break;
            case EntidadRevisora::$COMERCIO:
                $detalle2 = $conceptoDetalle ? "{$conceptoDetalle->descripcion}" : "N/A";
                break;
            case EntidadRevisora::$ALCOHOLES:
                $detalle2 = $conceptoDetalle ? "{$conceptoDetalle->descripcion}" : "N/A";
                break;
            default:
                break;
        }
        $detalle2 = strtoupper($detalle2);
        return self::quitarAcentos($detalle2);
    }

    private static function quitarAcentos($cadena) {
        $acentos = array('á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú');
        $sinAcentos = array('a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U');
    
        $cadenaSinAcentos = str_replace($acentos, $sinAcentos, $cadena);
    
        return $cadenaSinAcentos;
    }

    private static function agregarAdeudoDescuento($incisos, $adeudo, $descuento) {
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
    
    private static function log($logData, $path) {
        Log::build([
            'driver' => 'single',
            'path' => $path,
        ])->info($logData);
    }
}
