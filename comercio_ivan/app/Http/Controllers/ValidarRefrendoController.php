<?php

namespace App\Http\Controllers;

use App\Models\Cat_Bajo_Impacto2020;
use App\Models\cat_camaras;
use App\Models\cat_contactalos;
use App\Models\cat_domicilio;
use App\Models\cat_giros;
use App\Models\cat_tipo_negocio;
use App\Models\consecutivo_clave;
use App\Models\refrendos;
use App\Models\ValidarRefrendo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ValidarRefrendoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->ecologia == 1) {
            $area = 459;
            $tramite = [3]; // alto impacto

            $datos['solicitudes'] = refrendos::whereIn('id_tramite', $tramite)
                ->addSelect(
                    ['acepto' => ValidarRefrendo::select('aceptado')
                        ->whereColumn('folio', 'refrendos.folio')
                        ->where('area', $area),
                    ]
                )
            //para saber si esta autorizado
                ->addSelect(
                    ['valida' => ValidarRefrendo::select('id_validar')
                        ->whereColumn('folio', 'refrendos.folio')
                        ->where('area', $area),
                    ]
                )
                ->addSelect(
                    ['tipnegocio' => cat_tipo_negocio::select('descripcion')
                        ->whereColumn('cv_tipo_negocio', 'refrendos.id_tramite'),
                    ]
                )
                ->addSelect(
                    ['ruta' => ValidarRefrendo::select('ruta')
                        ->whereColumn('folio', 'refrendos.folio')
                        ->where('area', $area),
                    ]
                )
                ->orderBy('folio', 'desc')
                ->paginate(10);

            return view('refrendoseco.index', $datos);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $user = auth()->user();

        $campos = [
            'archivo' => 'required|file|max:1953',
        ];

        $mensajerror = [
            'required' => 'El :attribute es requerido, debe ser menor a 2 megas',
            'file' => 'El :attribute debe ser menor a 2 MEGAS',
        ];

        $this->validate($request, $campos, $mensajerror);

        if ($user->ecologia == 1) {
            $area = 459;
            $rutacarpeta = 'public/imagenes/ecologia';
            $rutaBD = 'imagenes/ecologia/';
        }

        $guardar_validar = new ValidarRefrendo();
        $guardar_validar->timestamps = false;
        $guardar_validar->folio = $request->txtfolio;
        $guardar_validar->aceptado = $request->optcivil;
        $guardar_validar->observacion = $request->txtObservacion;
        $guardar_validar->id_usuario = $user->id;
        $guardar_validar->area = $area;

        if ($request->hasFile('archivo')) {
            $request->file('archivo')->storeAs($rutacarpeta, $request->txtfolio.'.pdf');
            $guardar_validar->ruta = $rutaBD.$request->txtfolio.'.pdf';
        }

        $guardar_validar->save();

        $datos['solicitudes'] = refrendos::addSelect(
            ['acepto' => ValidarRefrendo::select('aceptado')
                ->whereColumn('folio', 'refrendos.folio')
                ->where('area', $area),
            ]
        )
            ->addSelect(
                ['valida' => ValidarRefrendo::select('id_validar')
                    ->whereColumn('folio', 'refrendos.folio')
                    ->where('area', $area),
                ]
            )
            ->addSelect(
                ['ruta' => ValidarRefrendo::select('ruta')
                    ->whereColumn('folio', 'refrendos.folio')
                    ->where('area', $area),
                ]
            )
            ->orderBy('folio', 'desc')
            ->paginate(10);

        return view('refrendoseco.index', $datos);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ValidarRefrendo  $validarRefrendo
     * @return \Illuminate\Http\Response
     */
    public function show($folio)
    {
        $solicitud['datos'] = $folio;

        // return response()->json($folio);
        return view('refrendoseco.alta', $solicitud);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ValidarRefrendo  $validarRefrendo
     * @return \Illuminate\Http\Response
     */
    public function edit($valida)
    {
        $solicitud['datos'] = DB::connection('pgsql')->select("select *
        from public.validar
        where id_validar='".$valida."'");

        //   return response()->json($solicitud);
        return view('refrendoseco.edicion', $solicitud);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Models\ValidarRefrendo  $validarRefrendo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $valida)
    {
        $user = auth()->user();

        if ($user->ecologia == 1) {
            $area = 459;
            $rutacarpeta = 'public/imagenes/ecologia';
            $rutaBD = 'imagenes/ecologia/';
            $tramite = [2, 3]; //mediano y alto impacto
        }

        $act_validar = ValidarRefrendo::find($valida);
        $act_validar->timestamps = false;
        $act_validar->aceptado = $request->optcivil;
        $act_validar->observacion = $request->txtObservacion;
        $act_validar->id_usuario = $user->id;

        $path = 'public/'.$request->txtarchivocargado;

        if ($request->hasFile('archivo_pdf')) {
            if (Storage::exists($path)) {
                Storage::delete($path);
                $request->file('archivo_pdf')->storeAs($rutacarpeta, $request->txtfolio.'.pdf');
                $act_validar->ruta = $rutaBD.$request->txtfolio.'.pdf';
            } else {
                $request->file('archivo_pdf')->storeAs($rutacarpeta, $request->txtfolio.'.pdf');
                $act_validar->ruta = $rutaBD.$request->txtfolio.'.pdf';
            }
        }

        $act_validar->save();

        $datos['solicitudes'] = refrendos::whereIn('id_tramite', $tramite)
            ->addSelect(
                ['acepto' => ValidarRefrendo::select('aceptado')
                    ->whereColumn('folio', 'refrendos.folio')
                    ->where('area', $area),
                ]
            )
            ->addSelect(
                ['valida' => ValidarRefrendo::select('id_validar')
                    ->whereColumn('folio', 'refrendos.folio')
                    ->where('area', $area),
                ]
            )
            ->addSelect(
                ['ruta' => ValidarRefrendo::select('ruta')
                    ->whereColumn('folio', 'refrendos.folio')
                    ->where('area', $area),
                ]
            )
            ->orderBy('folio', 'desc')
            ->paginate(10);

        return view('refrendoseco.index', $datos);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(ValidarRefrendo $validarRefrendo)
    {
        //
    }

    public function imprime_licencia($folio)
    {

        $act_sare = refrendos::find($folio);

        $fechactual_imp = now();
        $fechactual_imp = $fechactual_imp->format('d-m-Y');

        if (empty($act_sare->claveregmpal)) {
            $claveregmpal = consecutivo_clave::select('id_folio')->get();

            $act_sare->timestamps = false;
            $act_sare->claveregmpal = $claveregmpal[0]->id_folio + 1;

            $act_sare->fecha_impresion = $fechactual_imp;
            $act_sare->save();

            $act_consecutivo = consecutivo_clave::find($claveregmpal[0]->id_folio);
            $act_consecutivo->timestamps = false;
            $act_consecutivo->id_folio = $claveregmpal[0]->id_folio + 1;
            $act_consecutivo->save();
        }

        $datos['solicitud'] = refrendos::findorfail($folio);

        $datos['fechaoperaciones'] = date('d/M/Y', strtotime($datos['solicitud']->fecha));

        $datos['cat_domicilio'] = cat_domicilio::findorfail($datos['solicitud']->id_domicilio_noti);

        $datos['cat_dom'] = cat_domicilio::findorfail($datos['solicitud']->id_domicilio_sol);

        $datos['cat_contactalos'] = cat_contactalos::findorfail($datos['solicitud']->id_contactalos_sol);

        $datos['cat_camaras'] = cat_camaras::findorfail($datos['solicitud']->org);

        if ($datos['solicitud']->id_tramite == 4) {
            $datos['tipnegocio'] = Cat_Bajo_Impacto2020::findorfail($datos['solicitud']->giro);
        } else {
            $datos['tipnegocio'] = cat_giros::findorfail($datos['solicitud']->giro);
        }

        $datos['actyear'] = date('Y');

        return PDF::loadView('reportes.licencia_funcionamiento', $datos)->stream('licencia_funcionamiento.pdf');
    }
}
