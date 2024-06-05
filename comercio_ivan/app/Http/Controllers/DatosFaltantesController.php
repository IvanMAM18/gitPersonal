<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use App\Models\NegocioDocumentoActualizado;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DatosFaltantesController extends Controller
{
    public function completar(Request $request)
    {
        $data = $request->all();

        foreach ($data as $negocio_id => $values) {
            $negocio = Negocio::find($negocio_id);
            foreach ($values as $valuekey => $value) {
                if ($valuekey == 'comprobante_domicilio') {
                    $currentYear = Carbon::now()->year;
                    $data = [
                        'negocio_id' => $negocio['id'],
                        'docto' => 'Comprobante de domicilio',
                        'ruta' => $value,
                        'tramite_id' => $negocio->tramites_padres->last()->id,
                        'año_refrendo' => $currentYear,
                    ];
                    $documento = NegocioDocumentoActualizado::create($data);
                }
                // Create a new NegocioDocumentoActualizado record

                $negocio[$valuekey] = $value;
            }
            $negocio->save();
        }

        return response()->json([
            'ok' => true,
        ]);
    }

    public function datosFaltantesNegocio(Request $request)
    {
        $user_id = Auth::user()->id;

        // return response()->json([
        //     "ok" => true,
        //     "user_id" => $user_id
        // ]);

        $negocios_datos_faltantes = Negocio::select([
            'id',
            'nombre_del_negocio',
            'persona_id',
            'superficie_m2',
            'cajones_estacionamiento',
            'foto_frontal_fachada',
            // nuevos datos 7 febrero 23
            'comprobante_domicilio',
            'venta_alcohol',
            // nuevos datos 9 febrero 23
            'descripcion_actividad',
            'horarios',
            // nuevos datos 24 octubre 23
            'tipo_predio_propiedad',
            'documento_predio_propiedad',
            // nuevos datos 1 enero 24, quitados 29 enero 24
            // 'no_empleados_h',
            // 'no_empleados_m',
            // 'autoempleo',
            // nuevos datos 29 enero 24
            'tamano_empresa',
        ])
            ->where('persona_id', $user_id)
            ->where(function ($query) {
                $query
                    ->where('superficie_m2', null)
                    ->orWhere('cajones_estacionamiento', null)
                    ->orWhere('foto_frontal_fachada', null)
                    ->orWhere('comprobante_domicilio', null)
                    ->orWhere('venta_alcohol', null)
                    ->orWhere('horarios', 'like', '[]')
                    ->orWhere('horarios', 'like', '%Invalid%')
                    ->orWhere('descripcion_actividad', null)
                    ->orWhere('tipo_predio_propiedad', null)
                    ->orWhere('documento_predio_propiedad', null)
                    // ->orWhere('autoempleo', false)
                    ->orWhere('tamano_empresa', null);
                // ->orWhere(function ($query) {
                //     $query->Where('no_empleados_h', 0)
                //           ->Where('no_empleados_m', 0);
                // });
            })
            ->get();

        return response()->json([
            'ok' => true,
            'negocios_datos_faltantes' => $negocios_datos_faltantes,
        ]);
    }
}
