<?php

namespace App\Http\Controllers;

use App\Helpers\AvisosEnteroAPI;

use App\Models\AvisoEntero;
use App\Models\Concepto;
use App\Models\ConceptoDetalle;
use App\Models\Negocio;
use App\Models\PersonaMoral;
use App\Models\Tramite;

use App\Services\AvisoEnteroService;

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
            'concepto_detalle_id' => ['required'],
        ], [
            'tramite_id.required' => 'El campo tramite es obligatorio.',
            'concepto_detalle_id.required' => 'El campo detalles del concepto es obligatorio.',
        ]);

        $tramite = Tramite::find($request->tramite_id);
        $conceptoDetalle = ConceptoDetalle::find($request->concepto_detalle_id);
        $detalle1 = $request->input('detalle1', '');
        $detalle2 = $request->input('detalle2', '');
        $info = $request->input('info', '');
        $adeudo = round($request->input('adeudo', 0), 2);
        $descuento = round($request->input('descuento', 0), 2);
        $descuento2023 = round($request->input('descuento2023', 0), 2);
        $incisosValorManual = $request->input('incisos_valor_manual', []);
        $year = $request->input('anio', 2023);

        $detalles = [
            'detalle1' => $detalle1,
            'detalle2' => $detalle2,
            'info' => $info
        ];

        $valores = [
            'descuento2023' => $descuento2023,
            'descuento' => $descuento,
            'adeudo' => $adeudo,
            'incisosValorManual' => $incisosValorManual,
            'anio' => $year,
        ];

        return AvisoEnteroService::generar($tramite, $conceptoDetalle, $detalles, $valores);
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

        try {
            $pdf = AvisosEnteroAPI::pdf($avisoEntero, $titulo);
            return Response::make($pdf, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="aviso.pdf"',
            ]);
        } catch (\Throwable $th) {
            return Response::make('Error al obtener el aviso de entero', 200, [
                'Content-Type' => 'text/html; charset=UTF-8',
            ]);
        }
    }
}
