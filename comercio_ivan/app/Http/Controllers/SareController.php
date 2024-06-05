<?php

namespace App\Http\Controllers;

use App\Models\bitacora_borra_solicitud;
use App\Models\bitacora_cat_contactalos;
use App\Models\bitacora_cat_domicilio;
use App\Models\bitacora_solicitud;
use App\Models\bitacora_solicitudesr;
use App\Models\Cat_Bajo_Impacto2020;
use App\Models\cat_camaras;
use App\Models\cat_contactalos;
use App\Models\cat_domicilio;
use App\Models\cat_giros;
use App\Models\cat_tipo_establecimiento;
use App\Models\cat_tipo_negocio;
use App\Models\consecutivo_clave;
use App\Models\folio_sig;
//btacoras
use App\Models\sare;
use App\Models\solicitudesr;
use App\Models\validar;
use Barryvdh\DomPDF\Facade as PDF;
//btacoras

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class SareController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        //  return response()->json($datos);

        $fechaactual = now();
        //$fechaactual=$fechaactual->format('d-m-Y');

        $datos['fechactual'] = $fechaactual;

        $user = auth()->user();

        if ($user->sare == 1) {
            $datos['solicitudes'] = sare::addSelect(
                ['civil' => validar::select('aceptado')
                    ->whereColumn('folio', 'solicitudes.folio')
                    ->where('area', 192), //proteccion civil
                ]
            )
            //para saber si esta autorizado
                ->addSelect(
                    ['planeacion' => validar::select('aceptado')
                        ->whereColumn('folio', 'solicitudes.folio')
                        ->where('area', 238), //ordenamiento territorial
                    ]
                )
                ->addSelect(
                    ['ecologia' => validar::select('aceptado')
                        ->whereColumn('folio', 'solicitudes.folio')
                        ->where('area', 459), //ecologia
                    ]
                )
                ->addSelect(
                    ['tipnegocio' => cat_tipo_negocio::select('descripcion')
                        ->whereColumn('cv_tipo_negocio', 'solicitudes.id_tramite'),
                    ]
                )
                ->where('eliminado', 0) //para saber si no esta eliminado
                ->orderBy('folio', 'desc')
                ->paginate(10);

            return view('solicitudes.index', $datos);
        }

        if ($user->civil == 1 or $user->ordenamiento == 1 or $user->ecologia == 1) {
            if ($user->civil == 1) {
                $area = 192;
                $tramite = [4, 5]; //sare y bajo impacto
            }

            if ($user->ordenamiento == 1) {
                $area = 238;
                $tramite = [4, 5]; //sare y bajo impacto
            }
            if ($user->ecologia == 1) {
                $area = 459;
                $tramite = [2, 3]; //mediano y alto impacto
            }

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
                ->where('eliminado', 0) //para saber si no esta eliminado
                ->orderBy('folio', 'desc')
                ->paginate(10);

            return view('proteccion.index', $datos);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $datos['negocios'] = cat_tipo_negocio::all();
        $datos['camaras'] = cat_camaras::all();
        $datos['establecimientos'] = cat_tipo_establecimiento::all();

        return view('solicitudes.alta', $datos);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $request->validate([
            'txtrazonsocial' => 'required|string|max:100',
            'txtcalle' => 'required|string|max:100',
            'txtcallenoti' => 'required|string|max:100',
            'txtnombrestable' => 'required|string|max:100',
            'txtcallesta' => 'required|string|max:100',
            'txtactividadprincipal' => 'required|string|max:200',
            'cbocat_negocios' => 'required',
            'cbocat_giro' => 'required',
        ]);

        //segun oficio XVII/OM/DIYMR/007/2022 los negocios de bajo riesgos se verifica el predial pagado
        //if ($request->cbocat_negocios == 4 or $request->cbocat_negocios == 5)
        //{
        //$this->validate($request, ['txtfoliocata'=>['required', new validapredial($request->opttipopre,$request->txtfoliocata)]]);
        //}

        $fol_sig = folio_sig::select('folio', 'fecha')->get();
        $folio_sig = $fol_sig[0]->folio;
        $fecha_sig = $fol_sig[0]->fecha;
        $fecha_sig = date('Y-m-d', strtotime($fecha_sig));

        $fechaactual = now();
        $fechaactual = $fechaactual->format('Y-m-d');

        if ($fecha_sig != $fechaactual) {
            $fechaactual = date('Ymd', strtotime($fechaactual));
            $GuardaFoliosig = folio_sig::find($folio_sig);
            $folio_sig = 1;
            $GuardaFoliosig->folio = $folio_sig;
            $GuardaFoliosig->fecha = $fechaactual;
            $GuardaFoliosig->timestamps = false;
            $GuardaFoliosig->save();
            $fecha_sig = $fechaactual;
        }

        $ult_refre_fecha = now();
        $ult_refre_fecha = $ult_refre_fecha->format('Y-m-d');

        $fecha_sig = date('Ymd', strtotime($fecha_sig));
        $folio_sig = str_pad($folio_sig, 3, '0', STR_PAD_LEFT);
        $folio_sig_compuesto = $fecha_sig.$folio_sig;

        $guardar = new sare();
        $guardar->timestamps = false;
        $guardar->folio = $folio_sig_compuesto;
        $guardar->id_usuario = auth()->id();
        $guardar->id_tramite = $request->cbocat_negocios;
        $guardar->id_persona = $request->optpersona;
        $guardar->nombre_sol = strtoupper($request->txtrazonsocial);
        $guardar->apellido1_sol = strtoupper($request->txtApellidoPaterno);
        $guardar->apellido2_sol = strtoupper($request->txtApellidoMaterno);

        //guarda dotos del domicilio solicitante
        $guardar_cat_domsol = new cat_domicilio();
        $guardar_cat_domsol->timestamps = false;
        $guardar_cat_domsol->calle = strtoupper($request->txtcalle);
        $guardar_cat_domsol->entre = strtoupper($request->txtentre);
        $guardar_cat_domsol->yentre = strtoupper($request->txtyentre);
        $guardar_cat_domsol->numint = $request->txtnoint;
        $guardar_cat_domsol->numext = $request->txtNoExt;
        $guardar_cat_domsol->colonia = strtoupper($request->txtcolonia);
        $guardar_cat_domsol->localidad = strtoupper($request->txtlocalidad);
        $guardar_cat_domsol->cp = $request->txtcp;
        $guardar_cat_domsol->save();

        $guardar->id_domicilio_sol = $guardar_cat_domsol->id_domicilio;
        //guarda dotos del domicilio solicitante

        $guardar->curp_sol = strtoupper($request->txtcurp);
        $guardar->rfc_sol = strtoupper($request->txtrfc);

        //guarda datosn cat contactalos solicitante
        $guardar_cat_contasol = new cat_contactalos();
        $guardar_cat_contasol->timestamps = false;
        $guardar_cat_contasol->telefono = $request->txttel;
        $guardar_cat_contasol->celular = $request->txtcel;
        $guardar_cat_contasol->save();

        $guardar->id_contactalos_sol = $guardar_cat_contasol->id_contactalos;
        //guarda datosn cat contactalos solicitante

        $guardar->org = $request->cbocat_camaras;
        $guardar->num_credencial = $request->txtnocredencial;

        //guarda dotos del domicilio notificar******
        $guardar_cat_domnoti = new cat_domicilio();
        $guardar_cat_domnoti->timestamps = false;
        $guardar_cat_domnoti->calle = strtoupper($request->txtcallenoti);
        $guardar_cat_domnoti->entre = strtoupper($request->txtentrenoti);
        $guardar_cat_domnoti->yentre = strtoupper($request->txtyentrenoti);
        $guardar_cat_domnoti->numint = $request->txtnointnoti;
        $guardar_cat_domnoti->numext = $request->txtnoextnoti;
        $guardar_cat_domnoti->colonia = strtoupper($request->txtcolonianoti);
        $guardar_cat_domnoti->localidad = strtoupper($request->txtlocalidadnoti);
        $guardar_cat_domnoti->cp = $request->txtcpnoti;
        $guardar_cat_domnoti->save();

        $guardar->id_domicilio_noti = $guardar_cat_domnoti->id_domicilio;
        //guarda dotos del domicilio notificar***

        //guarda datosn cat contactalos notificacion
        $guardar_cat_contanoti = new cat_contactalos();
        $guardar_cat_contanoti->timestamps = false;
        $guardar_cat_contanoti->telefono = $request->txttelnoti;
        $guardar_cat_contanoti->celular = $request->txtcelnoti;
        $guardar_cat_contanoti->save();
        //**

        $guardar->id_contactalos_noti = $guardar_cat_contanoti->id_contactalos;
        //guarda datosn cat contactalos notificacion

        $guardar->representate = strtoupper($request->txtreprelegalnoti);

        //guarda datosn cat contactalos notificacion representante
        $guardar_cat_contarepre = new cat_contactalos();
        $guardar_cat_contarepre->timestamps = false;
        $guardar_cat_contarepre->telefono = $request->txtreprelegaltelnoti;
        $guardar_cat_contarepre->celular = $request->txtreprelegalcelnoti;
        $guardar_cat_contarepre->save(); //**

        $guardar->id_contactalos_representate = $guardar_cat_contarepre->id_contactalos;
        //guarda datosn cat contactalos notificacion representante

        $guardar->correo_representante = $request->txtreprelegalcorreonoti;
        $guardar->nombre_establecimiento = strtoupper($request->txtnombrestable);
        $guardar->ssa = $request->txtregistrossa;        //** */

        //guarda dotos del domicilio establecimiento
        $guardar_cat_domesta = new cat_domicilio();
        $guardar_cat_domesta->timestamps = false;
        $guardar_cat_domesta->calle = strtoupper($request->txtcallesta);
        $guardar_cat_domesta->entre = strtoupper($request->txtentresta);
        $guardar_cat_domesta->yentre = strtoupper($request->txtyentresta);
        $guardar_cat_domesta->colonia = strtoupper($request->txtcoloniaesta);
        $guardar_cat_domesta->localidad = strtoupper($request->txtlocalidadesta);
        $guardar_cat_domesta->cp = $request->txtcpesta;
        $guardar_cat_domesta->save();

        $guardar->id_domicilio_esta = $guardar_cat_domesta->id_domicilio;
        //guarda dotos del domicilio notificar

        $guardar->delegacion = strtoupper($request->txtdelegacionesta);
        $guardar->giro = $request->cbocat_giro;
        $guardar->id_tipo_establecimiento = $request->cbocat_establecimiento;
        $guardar->actividad_principal = strtoupper($request->txtactividadprincipal);
        $guardar->actividad_principal_permitida = strtoupper($request->txtactividadprincipalpermi);
        $guardar->horario = $request->txthorariotrab;
        $guardar->capital = $request->txtcapitalgiro;
        $guardar->num_empleados = $request->txtnoempleados;

        //guarda dotos del solicitudes r**********
        $guardar_solicitudesr = new solicitudesr();
        $guardar_solicitudesr->timestamps = false;
        $guardar_solicitudesr->folio = $folio_sig_compuesto;
        $guardar_solicitudesr->hombres = $request->txthombres;
        $guardar_solicitudesr->mujeres = $request->txtmujeres;
        $guardar_solicitudesr->capacidades = $request->optcapacidadesdiferentes;
        $guardar_solicitudesr->uso = $request->cbocat_uso;
        $guardar_solicitudesr->tipoanuncion = $request->cbotipo_anuncio;
        $guardar_solicitudesr->leyendaa = strtoupper($request->txtleyendaanuncio);
        $guardar_solicitudesr->lugarinstalacion = strtoupper($request->txtlugaranuncio);
        $guardar_solicitudesr->largo_letrero = $request->txtlargo;
        $guardar_solicitudesr->ancho_letrero = $request->txtancho;
        $guardar_solicitudesr->save();

        $guardar->superficie = $request->txtsuplocal;
        $guardar->pisos = $request->txtnopisos;
        $guardar->num_cajones = $request->txtnocajones;
        //$guardar->id_letrero=0;  no se captura solo tiene ceros
        //$guardar->ancho_letrero=""; esta informacion esta en la tabla SOLICITUDESR
        //$guardar->largo_letrero=""; esta informacion esta en la tabla SOLICITUDESR
        $guardar->id_causa = $request->causalegal;
        $guardar->otra_causa = $request->txtotracausa;
        $guardar->fecha = $request->txtfecha;
        $guardar->eliminado = 0;
        $guardar->clavecatastral = $request->txtclavecata;
        $guardar->foliocatastral = $request->txtfoliocata;
        $guardar->tipo_predio = $request->opttipopre;
        //$guardar->clave="";
        //$guardar->claveregmpal="";
        //$guardar->fecha_impresion=$request->txtfecha; fecha impresion licencia de funcionamiento
        //$guardar->diaimpresion=""; dia impresion licencia de funcionamiento
        //$guardar->fecha_eliminado=$request->txtfecha; fecha de eliminacion registro
        $guardar->aperturas = 0; //solo lleva ceros
        //$guardar->cve_cob="";
        $guardar->cve_sec = 0;
        $guardar->ultimo_refrendo = $ult_refre_fecha;
        $guardar->inop_e = $request->txtfechaoperaciones;
        $guardar->activo = 0;

        $guardar->lat = $request->txtlat;
        $guardar->lng = $request->txtlng;

        $guardar->save();

        $GuardaFoliosig = folio_sig::find($folio_sig);
        $folio_sig = $folio_sig + 1;
        $GuardaFoliosig->folio = $folio_sig;
        $GuardaFoliosig->timestamps = false;
        $GuardaFoliosig->save();

        return Redirect('solicitudes');
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(sare $sare)
    {
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\sare  $sare
     * @return \Illuminate\Http\Response
     */
    public function edit($folio)
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

        return view('solicitudes.edicion', $solicitud);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Models\sare  $sare
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $folio)
    {
        date_default_timezone_set('America/Mazatlan');
        $FechaeBitacora = now();
        $act_sare = sare::find($folio);

        //bitacora solicitudes
        $bitacoraSolicitud = new bitacora_solicitud();
        $bitacoraSolicitud->timestamps = false;
        $bitacoraSolicitud->folio = $act_sare->folio;
        $bitacoraSolicitud->id_usuario = auth()->id();
        $bitacoraSolicitud->id_tramite = $request->cbocat_negocios;
        $bitacoraSolicitud->id_persona = $request->opttipopersona;
        $bitacoraSolicitud->nombre_sol = strtoupper($request->txtrazonsocial);
        $bitacoraSolicitud->apellido1_sol = strtoupper($request->txtApellidoPaterno);
        $bitacoraSolicitud->apellido2_sol = strtoupper($request->txtApellidoMaterno);
        $bitacoraSolicitud->id_domicilio_sol = $act_sare->id_domicilio_sol;
        $bitacoraSolicitud->curp_sol = strtoupper($request->txtcurp);
        $bitacoraSolicitud->rfc_sol = strtoupper($request->txtrfc);
        $bitacoraSolicitud->id_contactalos_sol = $act_sare->id_contactalos_sol;
        $bitacoraSolicitud->org = $request->cbocat_camaras;
        $bitacoraSolicitud->num_credencial = $request->txtnocredencial;
        $bitacoraSolicitud->id_domicilio_noti = $act_sare->id_domicilio_noti;
        $bitacoraSolicitud->id_contactalos_noti = $act_sare->id_contactalos_noti;
        $bitacoraSolicitud->id_contactalos_representate = $act_sare->id_contactalos_representate;
        $bitacoraSolicitud->id_domicilio_esta = $act_sare->id_domicilio_esta;
        $bitacoraSolicitud->representate = strtoupper($request->txtreprelegalnoti);
        $bitacoraSolicitud->correo_representante = $request->txtreprelegalcorreonoti;
        $bitacoraSolicitud->nombre_establecimiento = strtoupper($request->txtnombrestable);
        $bitacoraSolicitud->ssa = $request->txtregistrossa;
        $bitacoraSolicitud->delegacion = strtoupper($request->txtdelegacionesta);
        $bitacoraSolicitud->giro = $request->cbocat_giro;
        $bitacoraSolicitud->id_tipo_establecimiento = $request->cbocat_establecimiento;
        $bitacoraSolicitud->actividad_principal = strtoupper($request->txtactividadprincipal);
        $bitacoraSolicitud->actividad_principal_permitida = strtoupper($request->txtactividadprincipalpermi);
        $bitacoraSolicitud->horario = $request->txthorariotrab;
        $bitacoraSolicitud->capital = $request->txtcapitalgiro;
        $bitacoraSolicitud->num_empleados = $request->txtnoempleados;
        $bitacoraSolicitud->superficie = $request->txtsuplocal;
        $bitacoraSolicitud->pisos = $request->txtnopisos;
        $bitacoraSolicitud->num_cajones = $request->txtnocajones;
        $bitacoraSolicitud->id_causa = $request->causalegal;
        $bitacoraSolicitud->otra_causa = $request->txtotracausa;
        $bitacoraSolicitud->clavecatastral = $request->txtclavecata;
        $bitacoraSolicitud->foliocatastral = $request->txtfoliocata;
        $bitacoraSolicitud->tipo_predio = $request->opttipopre;
        $bitacoraSolicitud->inop_e = $request->txtfechaoperaciones;
        $bitacoraSolicitud->lat = $request->txtlat;
        $bitacoraSolicitud->lng = $request->txtlng;
        $bitacoraSolicitud->fecha_bitacora = $FechaeBitacora->format('d-m-Y');
        $bitacoraSolicitud->hora_bitacora = $FechaeBitacora->format('H:i:s');
        $bitacoraSolicitud->save();
        //bitacora solicitudes
        //birtacora domicilio solicitante
        $bitacora_cat_domsol = new bitacora_cat_domicilio();
        $bitacora_cat_domsol->timestamps = false;
        $bitacora_cat_domsol->id_domicilio = $act_sare->id_domicilio_sol;
        $bitacora_cat_domsol->calle = strtoupper($request->txtcalle);
        $bitacora_cat_domsol->entre = strtoupper($request->txtentre);
        $bitacora_cat_domsol->yentre = strtoupper($request->txtyentre);
        $bitacora_cat_domsol->numint = $request->txtnoint;
        $bitacora_cat_domsol->numext = $request->txtNoExt;
        $bitacora_cat_domsol->colonia = strtoupper($request->txtcolonia);
        $bitacora_cat_domsol->localidad = strtoupper($request->txtlocalidad);
        $bitacora_cat_domsol->cp = $request->txtcp;
        $bitacora_cat_domsol->id = $bitacoraSolicitud->id;
        $bitacora_cat_domsol->save();
        //birtacora domicilio solicitante
        $bitacora_cat_contasol = new bitacora_cat_contactalos();
        $bitacora_cat_contasol->timestamps = false;
        $bitacora_cat_contasol->id_contactalos = $act_sare->id_contactalos_sol;
        $bitacora_cat_contasol->telefono = $request->txttel;
        $bitacora_cat_contasol->celular = $request->txtcel;
        $bitacora_cat_contasol->id = $bitacoraSolicitud->id;
        $bitacora_cat_contasol->save();
        //bitacora domicilio notificar
        $bitacora_cat_domnoti = new bitacora_cat_domicilio();
        $bitacora_cat_domnoti->timestamps = false;
        $bitacora_cat_domnoti->id_domicilio = $act_sare->id_domicilio_noti;
        $bitacora_cat_domnoti->calle = strtoupper($request->txtcallenoti);
        $bitacora_cat_domnoti->entre = strtoupper($request->txtentrenoti);
        $bitacora_cat_domnoti->yentre = strtoupper($request->txtyentrenoti);
        $bitacora_cat_domnoti->numint = $request->txtnointnoti;
        $bitacora_cat_domnoti->numext = $request->txtnoextnoti;
        $bitacora_cat_domnoti->colonia = strtoupper($request->txtcolonianoti);
        $bitacora_cat_domnoti->localidad = strtoupper($request->txtlocalidadnoti);
        $bitacora_cat_domnoti->cp = $request->txtcpnoti;
        $bitacora_cat_domnoti->id = $bitacoraSolicitud->id;
        $bitacora_cat_domnoti->save();
        //bitacora contactalos notificar
        $bitacora_cat_contanoti = new bitacora_cat_contactalos();
        $bitacora_cat_contanoti->timestamps = false;
        $bitacora_cat_contanoti->id_contactalos = $act_sare->id_contactalos_noti;
        $bitacora_cat_contanoti->telefono = $request->txttelnoti;
        $bitacora_cat_contanoti->celular = $request->txtcelnoti;
        $bitacora_cat_contanoti->id = $bitacoraSolicitud->id;
        $bitacora_cat_contanoti->save();
        //bitacora contactalos notificacion representante
        $bitacora_cat_contarepre = new bitacora_cat_contactalos();
        $bitacora_cat_contarepre->timestamps = false;
        $bitacora_cat_contarepre->id_contactalos = $act_sare->id_contactalos_representate;
        $bitacora_cat_contarepre->telefono = $request->txtreprelegaltelnoti;
        $bitacora_cat_contarepre->celular = $request->txtreprelegalcelnoti;
        $bitacora_cat_contarepre->id = $bitacoraSolicitud->id;
        $bitacora_cat_contarepre->save();
        //bitacora domicilio establecimiento
        $bitacora_cat_domesta = new bitacora_cat_domicilio();
        $bitacora_cat_domesta->timestamps = false;
        $bitacora_cat_domesta->id_domicilio = $act_sare->id_domicilio_esta;
        $bitacora_cat_domesta->calle = strtoupper($request->txtcallesta);
        $bitacora_cat_domesta->entre = strtoupper($request->txtentresta);
        $bitacora_cat_domesta->yentre = strtoupper($request->txtyentresta);
        $bitacora_cat_domesta->colonia = strtoupper($request->txtcoloniaesta);
        $bitacora_cat_domesta->localidad = strtoupper($request->txtlocalidadesta);
        $bitacora_cat_domesta->cp = $request->txtcpesta;
        $bitacora_cat_domesta->id = $bitacoraSolicitud->id;
        $bitacora_cat_domesta->save();
        //bitacora dotos del solicitudes r
        $bitacora_solicitudesr = new bitacora_solicitudesr();
        $bitacora_solicitudesr->timestamps = false;
        $bitacora_solicitudesr->folio = $act_sare->folio;
        $bitacora_solicitudesr->hombres = $request->txthombres;
        $bitacora_solicitudesr->mujeres = $request->txtmujeres;
        $bitacora_solicitudesr->capacidades = $request->optcapacidadesdiferentes;
        $bitacora_solicitudesr->uso = $request->cbocat_uso;
        $bitacora_solicitudesr->tipoanuncion = $request->cbotipo_anuncio;
        $bitacora_solicitudesr->leyendaa = strtoupper($request->txtleyendaanuncio);
        $bitacora_solicitudesr->lugarinstalacion = strtoupper($request->txtlugaranuncio);
        $bitacora_solicitudesr->largo_letrero = $request->txtlargo;
        $bitacora_solicitudesr->ancho_letrero = $request->txtancho;
        $bitacora_solicitudesr->id = $bitacoraSolicitud->id;
        $bitacora_solicitudesr->save();
        //bitacora dotos del solicitudes r

        //solicitudes
        $act_sare->timestamps = false;
        $act_sare->id_usuario = auth()->id();
        $act_sare->id_tramite = $request->cbocat_negocios;
        $act_sare->id_persona = $request->opttipopersona;
        $act_sare->nombre_sol = strtoupper($request->txtrazonsocial);
        $act_sare->apellido1_sol = strtoupper($request->txtApellidoPaterno);
        $act_sare->apellido2_sol = strtoupper($request->txtApellidoMaterno);
        $act_sare->curp_sol = strtoupper($request->txtcurp);
        $act_sare->rfc_sol = strtoupper($request->txtrfc);
        $act_sare->org = $request->cbocat_camaras;
        $act_sare->num_credencial = $request->txtnocredencial;
        $act_sare->representate = strtoupper($request->txtreprelegalnoti);
        $act_sare->correo_representante = $request->txtreprelegalcorreonoti;
        $act_sare->nombre_establecimiento = strtoupper($request->txtnombrestable);
        $act_sare->ssa = $request->txtregistrossa;
        $act_sare->delegacion = strtoupper($request->txtdelegacionesta);
        $act_sare->giro = $request->cbocat_giro;
        $act_sare->id_tipo_establecimiento = $request->cbocat_establecimiento;
        $act_sare->actividad_principal = strtoupper($request->txtactividadprincipal);
        $act_sare->actividad_principal_permitida = strtoupper($request->txtactividadprincipalpermi);
        $act_sare->horario = $request->txthorariotrab;
        $act_sare->capital = $request->txtcapitalgiro;
        $act_sare->num_empleados = $request->txtnoempleados;
        $act_sare->superficie = $request->txtsuplocal;
        $act_sare->pisos = $request->txtnopisos;
        $act_sare->num_cajones = $request->txtnocajones;
        $act_sare->id_causa = $request->causalegal;
        $act_sare->otra_causa = $request->txtotracausa;
        $act_sare->clavecatastral = $request->txtclavecata;
        $act_sare->foliocatastral = $request->txtfoliocata;
        $act_sare->tipo_predio = $request->opttipopre;
        $act_sare->inop_e = $request->txtfechaoperaciones;
        $act_sare->lat = $request->txtlat;
        $act_sare->lng = $request->txtlng;
        $act_sare->save();
        //guarda dotos del domicilio solicitante
        $act_cat_dom_sol = cat_domicilio::find($act_sare->id_domicilio_sol);
        $act_cat_dom_sol->timestamps = false;
        $act_cat_dom_sol->calle = strtoupper($request->txtcalle);
        $act_cat_dom_sol->entre = strtoupper($request->txtentre);
        $act_cat_dom_sol->yentre = strtoupper($request->txtyentre);
        $act_cat_dom_sol->numint = $request->txtnoint;
        $act_cat_dom_sol->numext = $request->txtNoExt;
        $act_cat_dom_sol->colonia = strtoupper($request->txtcolonia);
        $act_cat_dom_sol->localidad = strtoupper($request->txtlocalidad);
        $act_cat_dom_sol->cp = $request->txtcp;
        $act_cat_dom_sol->save();
        //guarda datosn cat contactalos solicitante
        $act_cat_conta_sol = cat_contactalos::find($act_sare->id_contactalos_sol);
        $act_cat_conta_sol->timestamps = false;
        $act_cat_conta_sol->telefono = $request->txttel;
        $act_cat_conta_sol->celular = $request->txtcel;
        $act_cat_conta_sol->save();
        //guarda dotos del domicilio notificar
        $act_cat_domnoti = cat_domicilio::find($act_sare->id_domicilio_noti);
        $act_cat_domnoti->timestamps = false;
        $act_cat_domnoti->calle = strtoupper($request->txtcallenoti);
        $act_cat_domnoti->entre = strtoupper($request->txtentrenoti);
        $act_cat_domnoti->yentre = strtoupper($request->txtyentrenoti);
        $act_cat_domnoti->numint = $request->txtnointnoti;
        $act_cat_domnoti->numext = $request->txtnoextnoti;
        $act_cat_domnoti->colonia = strtoupper($request->txtcolonianoti);
        $act_cat_domnoti->localidad = strtoupper($request->txtlocalidadnoti);
        $act_cat_domnoti->cp = $request->txtcpnoti;
        $act_cat_domnoti->save();
        //guarda dotos del contactalos notificar
        $act_cat_contanoti = cat_contactalos::find($act_sare->id_contactalos_noti);
        $act_cat_contanoti->timestamps = false;
        $act_cat_contanoti->telefono = $request->txttelnoti;
        $act_cat_contanoti->celular = $request->txtcelnoti;
        $act_cat_contanoti->save();
        //guarda datosn cat contactalos notificacion representante
        $guardar_cat_contarepre = cat_contactalos::find($act_sare->id_contactalos_representate);
        $guardar_cat_contarepre->timestamps = false;
        $guardar_cat_contarepre->telefono = $request->txtreprelegaltelnoti;
        $guardar_cat_contarepre->celular = $request->txtreprelegalcelnoti;
        $guardar_cat_contarepre->save();
        //guarda dotos del domicilio establecimiento
        $act_cat_domesta = cat_domicilio::find($act_sare->id_domicilio_esta);
        $act_cat_domesta->timestamps = false;
        $act_cat_domesta->calle = strtoupper($request->txtcallesta);
        $act_cat_domesta->entre = strtoupper($request->txtentresta);
        $act_cat_domesta->yentre = strtoupper($request->txtyentresta);
        $act_cat_domesta->colonia = strtoupper($request->txtcoloniaesta);
        $act_cat_domesta->localidad = strtoupper($request->txtlocalidadesta);
        $act_cat_domesta->cp = $request->txtcpesta;
        $act_cat_domesta->save();
        //guarda dotos del solicitudes r
        $act_solicitudesr = solicitudesr::find($act_sare->folio);
        $act_solicitudesr->timestamps = false;
        $act_solicitudesr->hombres = $request->txthombres;
        $act_solicitudesr->mujeres = $request->txtmujeres;
        $act_solicitudesr->capacidades = $request->optcapacidadesdiferentes;
        $act_solicitudesr->uso = $request->cbocat_uso;
        $act_solicitudesr->tipoanuncion = $request->cbotipo_anuncio;
        $act_solicitudesr->leyendaa = strtoupper($request->txtleyendaanuncio);
        $act_solicitudesr->lugarinstalacion = strtoupper($request->txtlugaranuncio);
        $act_solicitudesr->largo_letrero = $request->txtlargo;
        $act_solicitudesr->ancho_letrero = $request->txtancho;
        $act_solicitudesr->save();
        //guarda dotos del solicitudes r

        return Redirect('solicitudes');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\sare  $sare
     * @return \Illuminate\Http\Response
     */
    public function destroy($folio)
    {
        date_default_timezone_set('America/Mazatlan');
        $fechaeliminado = now();

        $desactiva_sare = sare::find($folio);

        $Bit_borra_sol = new bitacora_borra_solicitud();
        $Bit_borra_sol->timestamps = false;
        $Bit_borra_sol->folio = $desactiva_sare->folio;
        $Bit_borra_sol->nombre_sol = $desactiva_sare->nombre_sol;
        $Bit_borra_sol->nombre_establecimiento = $desactiva_sare->nombre_establecimiento;
        $Bit_borra_sol->id_usuario = auth()->id();
        $Bit_borra_sol->fecha = $fechaeliminado->format('d-m-Y');
        $Bit_borra_sol->hora = $fechaeliminado->format('H:i:s');
        $Bit_borra_sol->save();

        $desactiva_sare->timestamps = false;
        $desactiva_sare->eliminado = 1;       //borrado suave
        $desactiva_sare->fecha_eliminado = $fechaeliminado->format('d-m-Y');
        $desactiva_sare->save();

        return Redirect('solicitudes');
    }

    public function buscapadronuc(request $request)
    {

        if ($request->quienbusca == 1) {
            $datoscontriunico = DB::connection('oracle')
                ->select("select id_puc,tipo_persona,nombre,apellido1,apellido2
            ,telefono,celular,curp,rfc
            from contribuyentes.padronuc
            where nombre||apellido1||apellido2 like '%".$request->buscados."%' AND rownum <=10 order by id_puc desc");
        }

        if ($request->quienbusca == 2) {
            $datoscontriunico = DB::connection('oracle')
                ->select("select id_puc,tipo_persona,nombre,apellido1,apellido2
            ,telefono,celular,curp,rfc
            from contribuyentes.padronuc
            where rfc = '".$request->buscados."' AND rownum <=10 order by id_puc desc");
        }

        if ($request->quienbusca == 3) {
            $datoscontriunico = DB::connection('oracle')
                ->select("select id_puc,tipo_persona,nombre,apellido1,apellido2
            ,telefono,celular,curp,rfc
            from contribuyentes.padronuc
            where curp = '".$request->buscados."' AND rownum <=10 order by id_puc desc");
        }

        return response()->json($datoscontriunico);
    }

    public function buscapudomnoti(request $request)
    {

        $datosdomnoti = DB::connection('oracle')
            ->select("select calle,entre,yentre,localidad,colonia,numint,numext,cp,
            (select nombre
             from contribuyentes.cat_inegi_localidades_bcs
             where cv_entidad='03' and cv_municipio='003'
             and cv_localidad=cve_localidad
            ) as rlocalidad,

            (select nombre
             from contribuyentes.cat_inegi_colonias_bcs
             where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001'
             and cv_colonia=cve_colonia
            ) as rcolonia,

            (select nombre
             from contribuyentes.cat_inegi_vialidades_bcs
             where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001'
                     and cv_via = cve_calle_principal
            ) as rcalle,

            (select nombre
             from contribuyentes.cat_inegi_vialidades_bcs
             where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001'
             and cv_via = cve_calle_entre
            ) as rentre,

            (select nombre
             from contribuyentes.cat_inegi_vialidades_bcs
             where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001'
             and cv_via = cve_calle_y_entre
            ) as ryentre

            from contribuyentes.padronuc_dom
            where id_puc = '".$request->id_puc."'
            and tipo_domicilio = '".$request->tipo_domicilio."' order by id_domicilio desc");

        return response()->json($datosdomnoti);
    }

    public function BuscaSareFolio(request $request)
    {

        $datos['solicitudes'] = sare::addSelect(
            ['civil' => validar::select('aceptado')
                ->whereColumn('folio', 'solicitudes.folio')
                ->where('area', 192),
            ]
        )
        //para saber si esta autorizado
            ->addSelect(
                ['planeacion' => validar::select('aceptado')
                    ->whereColumn('folio', 'solicitudes.folio')
                    ->where('area', 238),
                ]
            )
            ->where('folio', $request->txtBuscaFolio)
            ->orderBy('folio', 'desc')
            ->paginate(10);

        return view('solicitudes.index', $datos);
    }

    public function imprime_solicitud($folio)
    {

        $solicitud['datospdf'] = sare::findorfail($folio);

        if ($solicitud['datospdf']->id_tramite == 4) {
            $solicitud['tipnegocio'] = Cat_Bajo_Impacto2020::findorfail($solicitud['datospdf']->giro);
        } else {
            $solicitud['tipnegocio'] = cat_giros::findorfail($solicitud['datospdf']->giro);
        }

        $solicitud['cat_contactalos_sol'] = cat_contactalos::findorfail($solicitud['datospdf']->id_contactalos_sol);

        $solicitud['cat_domicilio'] = cat_domicilio::findorfail($solicitud['datospdf']->id_domicilio_sol);

        $solicitud['cat_domicilio_esta'] = cat_domicilio::findorfail($solicitud['datospdf']->id_domicilio_esta);

        $solicitud['solicitudesr'] = solicitudesr::findorfail($solicitud['datospdf']->folio);

        $solicitud['tipo_establecimiento'] = cat_tipo_establecimiento::findorfail($solicitud['datospdf']->id_tipo_establecimiento);

        $fechactual = now();
        $fechactual = $fechactual->format('d-m-Y');

        $solicitud['fechact'] = $fechactual;

        if ($solicitud['datospdf']->id_tramite == 2 or $solicitud['datospdf']->id_tramite == 3 or $solicitud['datospdf']->id_tramite == 5) {
            //mediano y alto impacto
            return PDF::loadView('reportes.solicitud_licencia2', $solicitud)->stream('Solicitud_licencia_multi.pdf');
        }

        if ($solicitud['datospdf']->id_tramite == 4) {
            //sare bajo impacto y bajo impacto
            return PDF::loadView('reportes.solicitud_licencia', $solicitud)->stream('Solicitud_licencia.pdf');
        }
    }

    public function imprime_licencia($folio)
    {

        $act_sare = sare::find($folio);

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

        $datos['solicitud'] = sare::findorfail($folio);

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

        //para que cuando se imprime sea la licencia guardada
        $datos['actyear'] = date('Y', strtotime($datos['solicitud']->ultimo_refrendo));

        return PDF::loadView('reportes.licencia_funcionamiento', $datos)->stream('licencia_funcionamiento.pdf');
    }

    public function busca_predial_pago1(request $request)
    {

        $validapredial1 = Http::post('200.200.200.18:8080/catastro/authenticate', [
            'username' => 'prueba2',
            'password' => 'prueba2?54',
        ]);

        $validapredial2 = Http::withToken($validapredial1->json(['token']))->accept('application/json')->post('200.200.200.18:8080/catastro/otros', [
            'query' => $request->f_predio,
            'tipo' => $request->t_predio,
            'hasta' => '',
        ]);

        if ($validapredial2->successful() == 1) {
            $periodopago = $validapredial2->json(['ult_pago_periodo']);
            $bimestre_pago = substr($periodopago, 8, 2);
            $ano_pago = substr($periodopago, 10, strlen($periodopago));

            $fechaactual = now();
            $mes_actual = $fechaactual->format('m');
            $ano_ctual = $fechaactual->format('Y');
            $bimestre = 0;

            switch ($mes_actual) {
                case '01':
                    $bimestre = 1;
                    break;
                case '02':
                    $bimestre = 1;
                    break;
                case '03':
                    $bimestre = 2;
                    break;
                case '04':
                    $bimestre = 2;
                    break;
                case '05':
                    $bimestre = 3;
                    break;
                case '06':
                    $bimestre = 3;
                    break;
                case '07':
                    $bimestre = 4;
                    break;
                case '08':
                    $bimestre = 4;
                    break;
                case '09':
                    $bimestre = 5;
                    break;
                case '10':
                    $bimestre = 5;
                    break;
                case '11':
                    $bimestre = 6;
                    break;
                case '12':
                    $bimestre = 6;
                    break;
            }

            if ($ano_pago == $ano_ctual) {
                if ($bimestre_pago >= $bimestre) {
                    return response()->json('pagado');
                } else {
                    return response()->json('nopagado');
                }
            } else {
                return response()->json('nopagado');
            }
        } else {
            return response()->json('noexiste');
        }
    }

    public function listar()
    {

        if (auth()->user()->sare == 1) {
            $datos = sare::addSelect(
                ['civil' => validar::select('aceptado')
                    ->whereColumn('folio', 'solicitudes.folio')
                    ->where('area', 192), //proteccion civil
                ]
            )
            //para saber si esta autorizado
                ->addSelect(
                    ['planeacion' => validar::select('aceptado')
                        ->whereColumn('folio', 'solicitudes.folio')
                        ->where('area', 238), //ordenamiento territorial
                    ]
                )
                ->addSelect(
                    ['ecologia' => validar::select('aceptado')
                        ->whereColumn('folio', 'solicitudes.folio')
                        ->where('area', 459), //ecologia
                    ]
                )
                ->addSelect(
                    ['tipnegocio' => cat_tipo_negocio::select('descripcion')
                        ->whereColumn('cv_tipo_negocio', 'solicitudes.id_tramite'),
                    ]
                )
                ->orderBy('folio', 'desc')
                ->get();

            return response()->json($datos);
        }

        if (auth()->user()->civil == 1 or auth()->user()->ordenamiento == 1 or auth()->user()->ecologia == 1) {
            if (auth()->user()->civil == 1) {
                $area = 192;
                $tramite = [4, 5]; //sare y bajo impacto
            }

            if (auth()->user()->ordenamiento == 1) {
                $area = 238;
                $tramite = [4, 5]; //sare y bajo impacto
            }
            if (auth()->user()->ecologia == 1) {
                $area = 459;
                $tramite = [2, 3]; //mediano y alto impacto
            }

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

            return response()->json($datos);
        }
    }

    public function grabar(request $request)
    {

        $nombre = $request->nombre;

        $guardar = new sare();
        $guardar->timestamps = false;
        $guardar->folio = 24;
        $guardar->nombre_sol = $nombre;

        $guardar->save();

        return ['Result' => 'se grabo'];
    }
}
