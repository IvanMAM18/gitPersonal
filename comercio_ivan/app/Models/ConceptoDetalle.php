<?php

namespace App\Models;

use App\Contracts\Tramitable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConceptoDetalle extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'conceptos_detalles';

    protected $guarded = [];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function concepto()
    {
        return $this->belongsTo(Concepto::class);
    }

    public function conceptos_detalles_incisos()
    {
        return $this->hasMany(ConceptoDetalleInciso::class, 'concepto_detalle_id', 'id');
    }

    private function calcularTotal($valores)
    {
        $formula = $this->formula;

        $compiler = new \FormulaInterpreter\Compiler();
        $executable = $compiler->compile($formula);

        return $executable->run($valores);
    }

    private function aplicarDescuentos(ConceptoDetalleInciso $detalleInciso, $valores, $importe)
    {
        if (! $detalleInciso->descuentos || count($detalleInciso->descuentos) == 0) {
            return $importe;
        }

        return $importe + $valores['adeudo'] - $valores['descuento2023'] - $valores['descuento'];
    }

    private function aplicarOpciones(ConceptoDetalleInciso $detalleInciso, $valores, $importe)
    {
        if (! $detalleInciso->opciones) {
            return $importe;
        }

        if (in_array('MOSTRAR_ADEUDO', $detalleInciso->opciones)) {
            $importe = $importe + $valores['adeudo'];
        }

        return $importe;
    }

    private function aplicarValorManual(ConceptoDetalleInciso $detalleInciso, $valores)
    {
        if (! $detalleInciso->opciones) {
            return $valores;
        }

        if (in_array('VALOR_MANUAL', $detalleInciso->opciones)) {
            $numeroInciso = $detalleInciso->inciso;
            $key = 'VALOR_MANUAL_'.$numeroInciso;
            $valores[$key] = array_key_exists($numeroInciso, $valores['incisosValorManual']) ?
                round($valores['incisosValorManual'][$numeroInciso], 2) :
                0.00;
        }

        return $valores;
    }

    private function calcularDetalleInciso(ConceptoDetalleInciso $detalleInciso, $valores)
    {
        $formula = $detalleInciso->formula;

        $compiler = new \FormulaInterpreter\Compiler();
        $executable = $compiler->compile($formula);

        return $executable->run($valores);
    }

    public function calcularIncisos(Tramitable $negocio, $valores = [])
    {
        //        $tramitePadre = $negocio->tramite_comercio_padre
        //            ? $negocio->tramite_comercio_padre->tramite
        //            : null;
        $tramitePadre = $negocio->tramite_padre ?? null;
        $tarifaRecoleccionId = $negocio->tarifa_recoleccion_id ?? null;
        $superficieM2 = 200;

        if ($negocio instanceof Negocio && $negocio->superficie_m2 && $negocio->superficie_m2 >= 200) {
            $superficieM2 = $negocio->superficie_m2;
        }

        $concepto = $this->concepto;
        $concepto->opciones = is_array($concepto->opciones)
            ? $concepto->opciones
            : json_decode($concepto->opciones);
        $uma = UMA::currentValue();
        $valor = $this->valor;

        if (
            $concepto->opciones && in_array('PROGRAMA_INTERNO', $concepto->opciones)
            && $negocio->esDistribuidoraDeGas
        ) {
            $tarifa = TarifaProgramaInterno2024::find(3);
            $valores['TARIFA_PROGRAMA_INTERNO'] = $tarifa->valor;

        } elseif ($concepto->opciones && in_array('PROGRAMA_INTERNO', $concepto->opciones)) {
            $numeroDeEmpleados = $negocio->esGrande ? 101 : 51;
            $tarifa = TarifaProgramaInterno2024::where('min_trabajadores', '<=', $numeroDeEmpleados)->
                orderBy('min_trabajadores', 'desc')->
                first();
            $tarifa = $tarifa ? $tarifa : TarifaProgramaInterno2024::find(1);
            $valores['TARIFA_PROGRAMA_INTERNO'] = $tarifa->valor;
        }

        $añoTramite = null;
        if ($this->usar_valor_recoleccion_basura && $tarifaRecoleccionId) {
            $tramitePadre = $negocio->tramite_comercio_padre
                ? $negocio->tramites_padres()->latest()->first()
                : null;
            $añoTramite = $tramitePadre
                ? $tramitePadre->created_at->year
                : 2023;

            $añoTramite = $valores['AÑO_TRAMITE'] = $valores['anio'];
            //$valores['AÑO_TRAMITE'] = $añoTramite;
            $valores['TARIFA_ID'] = $tarifaRecoleccionId;
            if ($añoTramite == 2024 && $tarifaRecoleccionId != 91 && $tarifaRecoleccionId != 92) {
                $girosComerciales = $negocio->giro_comercial;
                $volumen = strtoupper($negocio->volumen);
                $tipoTarifa = strtoupper($negocio->tipoTarifa);
                $tarifas = collect([]);
                $girosComerciales->each(function ($giroComercial) use ($tarifas, $volumen, $tipoTarifa) {
                    $sector = strtoupper($giroComercial->tipo_sector);
                    if (! $sector) {
                        return;
                    }
                    $tarifa = TarifaRecoleccionBasura2024::where(
                        [
                            'volumen' => $volumen,
                            'sector' => $sector,
                            'tipo_tarifa' => $tipoTarifa,
                        ]
                    )->first();
                    $tarifa && $tarifas->push($tarifa);
                });
                $tarifa = $tarifas->count() > 0
                    ? $tarifas->sortByDesc('valor')->first()
                    : TarifaRecoleccionBasura2024::find(45);
                $valor = $tarifa->valor;
            } elseif ($añoTramite == 2024 && $tarifaRecoleccionId == 91) {
                $tarifa = TarifaRecoleccionBasura2024::find(46);
                $valor = $tarifa->valor;
            } elseif ($añoTramite == 2024 && $tarifaRecoleccionId == 92) {
                $tarifa = TarifaRecoleccionBasura2024::find(47);
                $valor = $tarifa->valor;
            } else {
                $tarifa = TarifaRecoleccionBasura::find($tarifaRecoleccionId);
                $valor = $tarifa ? $tarifa->valor_uma : $valor;
            }

            if (get_class($tarifa) == 'App\Models\TarifaRecoleccionBasura2024') {
                $valores['DESCRIPCION_TARIFA'] = $tarifa->descripcion;
                $valores['VOLUMEN'] = $tarifa->volumen;
                $valores['SECTOR'] = $tarifa->sector;
                $valores['TIPO_TARIFA'] = $tarifa->tipo_tarifa;
                $valores['UMA_ANUAL'] = $tarifa->valor_anual;
            }
        }

        $valores['descuento2023'] = $valores['descuento2023'] ?? 0;
        $valores['descuento'] = $valores['descuento'] ?? 0;
        $valores['adeudo'] = $valores['adeudo'] ?? 0;

        if ($negocio) {
            $valores['GIRO'] = $negocio->nombre_catalogo_giro_comercial;

            $valores['FRECUENCIA'] = $negocio->tarifa_recoleccion_basura
                ? $negocio->tarifa_recoleccion_basura->periodo
                : null;
            $valores['VOLUMEN'] = $negocio->tarifa_recoleccion_basura
                ? $negocio->tarifa_recoleccion_basura->volumen
                : null;
            $valores['VALOR_UMA'] = $negocio->tarifa_recoleccion_basura
                ? $negocio->tarifa_recoleccion_basura->valor_uma
                : null;
            $valores['NEGOCIO_M2'] = $negocio->superficie_m2;
            $valores['NO_EMPLEADOS'] = $negocio->no_empleados_h + $negocio->no_empleados_m;
        }

        $valores = array_merge($valores, [
            'UMA' => floatval($uma->diario),
            'VALOR' => floatval($valor),
            'M2' => floatval($superficieM2),
            'ACCUM' => 0,
        ]);

        if ($concepto->opciones && in_array('REQUIERE_MESES', $concepto->opciones)) {
            $tramitePadre = $negocio->tramite_padre;

            $anio = $valores['anio'];
            $catalogoTramite = $negocio->tramites_padres()
                ->whereYear('created_at', $anio)
                ->first()
                ?->catalogo_tramite;

            $meses = 12;
            $mesesTxt = 'Enero-Diciembre';
            $inicioDeOperaciones = $negocio->fecha_inicio_operaciones;
            $inicioDeOperaciones = $inicioDeOperaciones != null
                && strlen($inicioDeOperaciones) > 10
                ? \Carbon\Carbon::parse($inicioDeOperaciones)
                : null;

            if ($negocio->impacto_giro_comercio != 'mediano_alto_impacto') {
                if ($valores['anio'] < 2024) {
                    $ahora = new \Carbon\Carbon('2023-12-31');
                } else {
                    $ahora = \Carbon\Carbon::now();
                }
                $mesInicial = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $negocio->created_at)->endOfMonth();
                if ($mesInicial->isBefore($ahora->startOfYear())) {
                    $mesInicial = $ahora->startOfYear();
                }
                if (
                    $inicioDeOperaciones != null
                    && $inicioDeOperaciones->year == $ahora->year
                    && $inicioDeOperaciones->isBefore($mesInicial)
                ) {
                    $mesInicial = $inicioDeOperaciones->endOfMonth();
                }

                $mesFinal = $ahora->endOfYear();
                $meses = $mesInicial->diffInMonths($mesFinal) + 1;

                $mesesTxt = $mesInicial->locale('es_MX')->translatedFormat('F').
                    '-'.$mesFinal->locale('es_MX')->translatedFormat('F').
                    ' ';
            }
            if ($catalogoTramite && str_contains(strtoupper($catalogoTramite->nombre), 'REFRENDO')) {
                $meses = 12;
                $mesesTxt = 'Enero-Diciembre ';
            }
            $valores = array_merge($valores, ['MESES' => $meses, 'MESES_TEXTO' => $mesesTxt]);
        }

        $this->load(['conceptos_detalles_incisos' => function ($conceptosDetallesIncisos) {
            $conceptosDetallesIncisos->select(['id', 'concepto_detalle_id', 'inciso', 'formula', 'opciones'])
                ->with(['inciso' => function ($inciso) {
                    $inciso
                        ->select(['id', 'inciso', 'descp as descripcion'])
                        ->with('descuentos');
                }])
                ->orderBy('orden', 'asc')
                ->orderBy('id', 'asc');
        }]);

        $total = 0;

        foreach ($this->conceptos_detalles_incisos as $detalleInciso) {
            $valores = $this->aplicarValorManual($detalleInciso, $valores);
            $valores['ACCUM'] = $total;
            $detalleInciso->total = round(
                $this->calcularDetalleInciso($detalleInciso, $valores),
                2,
                PHP_ROUND_HALF_UP
            );
            $subtotal = $detalleInciso->total;
            $subtotal = $this->aplicarDescuentos($detalleInciso, $valores, $subtotal);
            $subtotal = $this->aplicarOpciones($detalleInciso, $valores, $subtotal);
            $total += $subtotal;
        }

        $this->valores = $valores;
        $this->total = $total;

        return $this->toArray();
    }

    public function obtenerIncisosAvisoEntero(Tramitable $tramitable, $valores = [])
    {
        $detallesIncisos = $this->calcularIncisos($tramitable, $valores);

        $incisos = array_map(function ($detalleInciso) {
            return [
                'importe' => $detalleInciso['total'],
                'descuento' => 0.0,
                'inciso' => $detalleInciso['inciso']['inciso'],
                'descripcion' => $detalleInciso['inciso']['descripcion'],
                'opciones' => $detalleInciso['opciones'],
            ];
        }, $detallesIncisos['conceptos_detalles_incisos']);

        return $incisos;
    }
}
