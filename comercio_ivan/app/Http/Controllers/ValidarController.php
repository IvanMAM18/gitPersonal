<?php

namespace App\Http\Controllers;

use App\Models\Cat_Bajo_Impacto2020;
use App\Models\cat_camaras;
use App\Models\cat_contactalos;
use App\Models\cat_domicilio;
use App\Models\cat_giros;
use App\Models\cat_tipo_establecimiento;
use App\Models\cat_tipo_negocio;
use App\Models\sare;
use App\Models\solicitudesr;
use App\Models\validar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ValidarController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($folio)
    {
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

        if (auth()->user()->civil == 1) {
            $area = 192;
            $tramite = [4, 5]; //sare y bajo impacto
            $rutacarpeta = 'public/imagenes/civil';
            $rutaBD = 'imagenes/civil/';
            $tramite = [4, 5]; //sare y bajo impacto
        }

        if (auth()->user()->ordenamiento == 1) {
            $area = 238;
            $tramite = [4, 5]; //sare y bajo impacto
            $rutacarpeta = 'public/imagenes/ordenamiento';
            $rutaBD = 'imagenes/ordenamiento/';
            $tramite = [4, 5]; //sare y bajo impacto
        }

        if (auth()->user()->ecologia == 1) {
            $area = 459;
            $tramite = [2, 3]; //mediano y alto impacto
            $rutacarpeta = 'public/imagenes/ecologia';
            $rutaBD = 'imagenes/ecologia/';
            $tramite = [2, 3]; //mediano y alto impacto
        }

        $guardar_validar = new validar();
        $guardar_validar->timestamps = false;
        $guardar_validar->folio = $request->txtfolio;
        $guardar_validar->aceptado = $request->optcivil;
        $guardar_validar->observacion = $request->txtObservacion;
        $guardar_validar->id_usuario = auth()->user()->id;
        $guardar_validar->area = $area;

        if ($request->hasFile('archivo')) {
            $request->file('archivo')->storeAs($rutacarpeta, $request->txtfolio.'.pdf');
            $guardar_validar->ruta = $rutaBD.$request->txtfolio.'.pdf';
        }

        $guardar_validar->save();

        $datos['solicitudes'] = sare::whereIn('id_tramite', $tramite)
            ->addSelect(
                ['acepto' => validar::select('aceptado')
                    ->whereColumn('folio', 'solicitudes.folio')
                    ->where('area', $area),
                ]
            )
        //para saber si esta autorizado
            ->addSelect(
                ['valida' => validar::select('id_validar')
                    ->whereColumn('folio', 'solicitudes.folio')
                    ->where('area', $area),
                ]
            )
            ->addSelect(
                ['ruta' => validar::select('ruta')
                    ->whereColumn('folio', 'solicitudes.folio')
                    ->where('area', $area),
                ]
            )
            ->addSelect(
                ['tipnegocio' => cat_tipo_negocio::select('descripcion')
                    ->whereColumn('cv_tipo_negocio', 'solicitudes.id_tramite'),
                ]
            )
            ->orderBy('folio', 'desc')
            ->paginate(10);

        return view('proteccion.index', $datos);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\validar  $validar
     * @return \Illuminate\Http\Response
     */
    public function show($folio)
    {

        $solicitud['datos'] = $folio;

        // return response()->json($folio);
        return view('proteccion.alta', $solicitud);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\validar  $validar
     * @return \Illuminate\Http\Response
     */
    public function edit($valida)
    {

        $solicitud['datos'] = DB::connection('pgsql')->select("select *
        from public.validar
        where id_validar='".$valida."'");

        //   return response()->json($solicitud);
        return view('proteccion.edicion', $solicitud);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Models\validar  $validar
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $valida)
    {

        if (auth()->user()->civil == 1) {
            $area = 192;
            $rutacarpeta = 'public/imagenes/civil';
            $rutaBD = 'imagenes/civil/';
            $tramite = [4, 5]; //sare y bajo impacto
        }

        if (auth()->user()->ordenamiento == 1) {
            $area = 238;
            $rutacarpeta = 'public/imagenes/ordenamiento';
            $rutaBD = 'imagenes/ordenamiento/';
            $tramite = [4, 5]; //sare y bajo impacto
        }

        if (auth()->user()->ecologia == 1) {
            $area = 459;
            $rutacarpeta = 'public/imagenes/ecologia';
            $rutaBD = 'imagenes/ecologia/';
            $tramite = [2, 3]; //mediano y alto impacto
        }

        $act_validar = validar::find($valida);
        $act_validar->timestamps = false;
        $act_validar->aceptado = $request->optcivil;
        $act_validar->observacion = $request->txtObservacion;
        $act_validar->id_usuario = auth()->user()->id;

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

        $datos['solicitudes'] = sare::whereIn('id_tramite', $tramite)
            ->addSelect(
                ['acepto' => validar::select('aceptado')
                    ->whereColumn('folio', 'solicitudes.folio')
                    ->where('area', $area),
                ]
            )
        //para saber si esta autorizado
            ->addSelect(
                ['valida' => validar::select('id_validar')
                    ->whereColumn('folio', 'solicitudes.folio')
                    ->where('area', $area),
                ]
            )
            ->addSelect(
                ['ruta' => validar::select('ruta')
                    ->whereColumn('folio', 'solicitudes.folio')
                    ->where('area', $area),
                ]
            )
            ->addSelect(
                ['tipnegocio' => cat_tipo_negocio::select('descripcion')
                    ->whereColumn('cv_tipo_negocio', 'solicitudes.id_tramite'),
                ]
            )
            ->orderBy('folio', 'desc')
            ->paginate(10);

        return view('proteccion.index', $datos);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(validar $validar)
    {
        //
    }

    public function Muestra_Informacion($folio)
    {
        $solicitud['datos'] = sare::findorfail($folio);

        $solicitud['cboinf_tiponego'] = cat_tipo_negocio::findorfail($solicitud['datos']->id_tramite);

        $solicitud['cboinf_camara'] = cat_camaras::findorfail($solicitud['datos']->org);

        $solicitud['cboinf_tipoesta'] = cat_tipo_establecimiento::findorfail($solicitud['datos']->id_tipo_establecimiento);

        if ($solicitud['datos']->id_tramite == 4) {
            $solicitud['cboinf_bajoimp'] = Cat_Bajo_Impacto2020::findorfail($solicitud['datos']->giro);
        } else {
            $solicitud['cboinf_bajoimp'] = cat_giros::findorfail($solicitud['datos']->giro);
        }

        $solicitud['cat_contactalos_sol'] = cat_contactalos::findorfail($solicitud['datos']->id_contactalos_sol);
        $solicitud['cat_contactalos_noti'] = cat_contactalos::findorfail($solicitud['datos']->id_contactalos_noti);
        $solicitud['cat_contactalos_rep'] = cat_contactalos::findorfail($solicitud['datos']->id_contactalos_representate);

        $solicitud['cat_domicilio_sol'] = cat_domicilio::findorfail($solicitud['datos']->id_domicilio_sol);
        $solicitud['cat_domicilio_noti'] = cat_domicilio::findorfail($solicitud['datos']->id_domicilio_noti);
        $solicitud['cat_domicilio_esta'] = cat_domicilio::findorfail($solicitud['datos']->id_domicilio_esta);

        $solicitud['solicitudesr'] = solicitudesr::findorfail($solicitud['datos']->folio);

        //encuentra el que es

        //llena los combobox
        if (! empty($solicitud['datos']->id_tramite)) {
            $solicitud['negocios'] = cat_tipo_negocio::where('cv_tipo_negocio', '!=', $solicitud['datos']->id_tramite)
                ->orWhereNull('cv_tipo_negocio')
                ->get();
        } else {
            $solicitud['negocios'] = cat_tipo_negocio::all();
        }

        if (! empty($solicitud['datos']->org)) {
            $solicitud['camaras'] = cat_camaras::where('id_cat_camara', '!=', $solicitud['datos']->org)
                ->orWhereNull('id_cat_camara')
                ->get();
        } else {
            $solicitud['camaras'] = cat_camaras::all();
        }

        if (! empty($solicitud['datos']->id_tipo_establecimiento)) {
            $solicitud['establecimientos'] = cat_tipo_establecimiento::where('id_tipo_establecimiento', '!=', $solicitud['datos']->id_tipo_establecimiento)
                ->orWhereNull('id_tipo_establecimiento')
                ->get();
        } else {
            $solicitud['establecimientos'] = cat_tipo_establecimiento::all();
        }

        if (! empty($solicitud['datos']->giro)) {
            if ($solicitud['datos']->id_tramite == 4) {
                $solicitud['giro_solicitado'] = Cat_Bajo_Impacto2020::where('id_giro', '!=', $solicitud['datos']->giro)
                    ->orWhereNull('id_giro')
                    ->get();
            } else {
                $solicitud['giro_solicitado'] = cat_giros::where('id_giro', '!=', $solicitud['datos']->giro)
                    ->orWhereNull('id_giro')
                    ->get();
            }
        } else {
            if ($solicitud['datos']->id_tramite == 4) {
                $solicitud['giro_solicitado'] = Cat_Bajo_Impacto2020::all();
            } else {
                $solicitud['giro_solicitado'] = cat_giros::all();
            }
        }
        //llena los combobox

        return view('proteccion.mostrar', $solicitud);
    }
}
