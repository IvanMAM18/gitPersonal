<?php

namespace App\Http\Controllers;

use App\Models\AvisoEntero;
use App\Models\LicenciaAlcohol;
use App\Models\Negocio;
use App\Models\NegocioLicencia;
use App\Models\Tramite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Helpers\EntidadRevisora;
class LicenciaAlcoholController extends Controller
{
    public function store(Request $request)
    {
        $mensaje = '';
        $year=$request->year;
        if (Auth::user() == null) {
            $mensaje = 'Reingrese al Sistema, ha perdido la sesión';
        }

        if (LicenciaAlcohol::findOrFail($request->licencia_id)->vigente == false) {
            $mensaje = 'Licencia Expirada, por favor utilice otra';
        }

        if ($mensaje != '') {
            // 500 es un error del servidor, mas bien seria un 440 si se perdio la sesion, o un 403 si no esta autorizado para acceder a esta parte de l sistem
            return response([
                'code' => 500,
                'message' => $mensaje,
            ], 500);
        }

        [$propietario_id, $modelo, $tramite_persona_id] = explode('|', $request->negocio_propietario_id);

        $model = $modelo;
        $instancia = app($model);

        $resultado = $instancia::find($propietario_id);

        $aviso = Tramite::find($tramite_persona_id)->aviso_entero;

        if ($aviso != null) {
            $negocioOperador = Negocio::find($request->negocio_operador_id);
            $tramiteApagar = $negocioOperador->tramites->where('catalogo_tramites_id', 13);
            $tramiteApagar = $tramiteApagar->filter(function ($q) use($year) {
                return $q->created_at->year === $year;

            })->first();
            $revisionActualizar=$tramiteApagar->revisiones->where('entidad_revision_id',EntidadRevisora::$ALCOHOLES)->first();
            $revisionActualizar->status='APROBADO';
            $revisionActualizar->save();
            AvisoEntero::create([
                'no_aviso' => $aviso->no_aviso,
                'tramite_id' => $tramiteApagar->id,
                'pago_id' => $aviso->pago_id,
                'servidor_publico_id' => $aviso->servidor_publico_id,
                'estado' => $aviso->estado,
                'subtotal' => $aviso->subtotal,
                'descuento' => $aviso->descuento,
                'total' => $aviso->total,
            ]);
        }

        $negocioLicencia = NegocioLicencia::create([
            'negocio_operador_id' => $request->negocio_operador_id,
            'licencia_id' => $request->licencia_id,

            'trabajador_id' => Auth::user()->id, ]);

        $negocioLicencia->propietario()->associate($resultado);
        $negocioLicencia->save();
    }

    public function getLicencias()
    {
        $data[] = 0;
        $ids = (NegocioLicencia::select('licencia_id')->get());
        foreach ($ids as $c) {
            $data[] = $c->licencia_id;
        }
        $licencias = LicenciaAlcohol::whereNotIn('id', $data)->where('vigente', true)->get();
        $response = [
            'licencias' => $licencias,
            'licenciaAsignadas' => $ids->count(),
            'licenciaPorAsingar' => $licencias->count(),
        ];

        return $response;
    }

    public function getSinLicenciaNegocios($year)
    {
        $negociosConLicenciaIds = NegocioLicencia::select('negocio_operador_id')
            ->pluck('negocio_operador_id')
            ->unique()
            ->toArray();

        return Negocio::select('id', 'nombre_del_negocio', 'persona_moral_id', 'persona_id')
            ->whereNotIn('id', $negociosConLicenciaIds)
            ->where('venta_alcohol', true)
            ->whereHas('tramitesPadres', fn ($query) => $query->whereYear('created_at', $year))
            ->with([
                'persona_moral',
                'user',
                'tramitesPadres' => fn ($query) => $query->whereYear('created_at', $year),
                'tramites' => function ($query) use ($year) {
                    $query->with('avisos_entero')
                        ->with('catalogo_tramites')
                        ->whereYear('created_at', $year);
                },
                'revisiones' => function ($revisiones) use ($year) {
                    $revisiones->whereYear('revision.created_at', $year)
                        ->select([
                            'id',
                            'entidad_revision_id',
                            'negocio_id',
                            'tramite_id',
                            'status',
                            'created_at',
                        ]);
                },
            ])
            ->get()
            ->map(function ($negocio) use ($year) {
                $negocio->tramitePadre = $negocio->tramitePadre($year);

                return $negocio;
            })
            ->filter(function ($item) {
                return $item->revisiones->count() >= 4 && $item->revisiones->whereIn('status', ['RECHAZADO', 'ENVIADO'])
                    ->where('entidad_revision_id', '!=', EntidadRevisora::$ALCOHOLES)
                    ->count() == 0;
            })
            ->filter(function ($item) {
                foreach ($item->tramites as $tramite) {
                    if ($tramite->requierePagoT() && $tramite->catalogo_tramites_id != 13) {
                        if ($tramite->aviso_entero == null || $tramite->aviso_entero->estado != 'PAGADO') {
                            return false;
                        }
                    }
                }

                return true;
            })
            ->values();

    }

    public function getLicenciaNegocios()
    {

        $negocios = NegocioLicencia::with('negocioPropietario')->with('propietario')
            ->with(['negocioOperador' => function ($query) {
                $query->select('id', 'nombre_del_negocio', 'persona_id', 'persona_moral_id')->with('tramite_padre');
            }])
            ->with(['licencia' => function ($query) {
                $query->select('id', 'clave', 'tipo', 'tipo_abreviado', 'movimientos', 'licencia_alcohol');
            }])->get();

        return $negocios;
    }

    public function desligarLicenciaNegocio(Request $request)
    {
        $mensaje = '';

        if (Auth::user() == null) {
            $mensaje = 'Reingrese al Sistema, ha perdido la sesión';
        }

        if ($mensaje != '') {
            return response()->json([
                'code' => 500,
                'message' => $mensaje,
            ], 500);
        }

        $negocioli = NegocioLicencia::findOrFail($request->id);
        $negocioli->trabajador_id_baja = Auth::user()->id;
        $negocioli->save();
        $negocioli->delete();
    }
}
