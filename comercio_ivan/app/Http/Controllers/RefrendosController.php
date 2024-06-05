<?php

namespace App\Http\Controllers;

use App\Models\Cat_Bajo_Impacto2020;
use App\Models\cat_camaras;
use App\Models\cat_contactalos;
use App\Models\cat_domicilio;
use App\Models\cat_giros;
use App\Models\cat_tipo_establecimiento;
use App\Models\cat_tipo_negocio;
use App\Models\consecutivo_clave;
use App\Models\folio_sig;
use App\Models\refrendos;
use App\Models\sare;
use App\Models\solicitudesr;
use App\Models\validar;
use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RefrendosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //  return response()->json($datos);

        $user = auth()->user();

        if ($user->sare == 1) {
            $datos['solicitudes'] = refrendos::addSelect(
                ['ecologia' => validar::select('aceptado')
                    ->whereColumn('folio', 'refrendos.folio')
                    ->where('area', 459), //ecologia
                ]
            )
                ->addSelect(
                    ['tipnegocio' => cat_tipo_negocio::select('descripcion')
                        ->whereColumn('cv_tipo_negocio', 'refrendos.id_tramite'),
                    ]
                )
                ->orderBy('folio', 'desc')
                ->paginate(10);

            return view('refrendos.index', $datos);
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
        //refrendos*******************refrendos*******************refrendos*******************refrendos*******************refrendos*******************
        //refrendos*******************refrendos*******************refrendos*******************refrendos*******************refrendos*******************

        $request->validate([
            'txtrazonsocial' => 'required|string|max:100',
            'txtcalle' => 'required|string|max:100',
            'txtcallenoti' => 'required|string|max:100',
            'txtnombrestable' => 'required|string|max:100',
            'txtcallesta' => 'required|string|max:100',
            'txtactividadprincipal' => 'required|string|max:200',

        ]);

        //$this->validate($request, ['txtfoliocata'=>['required', new validapredial($request->opttipopre,$request->txtfoliocata)]]);

        $guardar = new refrendos();
        $guardar->timestamps = false;

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

        $fecha_sig = date('Ymd', strtotime($fecha_sig));
        $folio_sig = str_pad($folio_sig, 3, '0', STR_PAD_LEFT);
        $folio_sig_compuesto = $fecha_sig.$folio_sig;

        $guardar->folio = $folio_sig_compuesto;
        $guardar->id_usuario = auth()->id();
        $guardar->id_tramite = $request->cbocat_negocios;
        //$guardar->otro_tramite="-"; no se captura nada
        $guardar->id_persona = $request->optpersona;
        $guardar->nombre_sol = strtoupper($request->txtrazonsocial); //convertir a mayusculas
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
        $guardar->ssa = $request->txtregistrossa;

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
        $guardar->id_letrero = 0;  //no se captura solo tiene ceros
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
        $guardar->claveregmpal = $request->txtclaveregmpal;

        $guardar->folio_apertura = $request->txtfolioapertura;
        //$guardar->fecha_impresion=$request->txtfecha; fecha impresion licencia de funcionamiento
        //$guardar->diaimpresion=""; dia impresion licencia de funcionamiento
        //$guardar->fecha_eliminado=$request->txtfecha; fecha de eliminacion registro
        $guardar->aperturas = 0; //solo lleva ceros
        //$guardar->cve_cob="";

        $guardar->cve_sec = 0;
        $guardar->refrendo_actual = $request->txtfecharefrendo;
        //$guardar->refrendo_anterior
        $guardar->refrendo_actual_vigente = $request->txtfecharefrendo;

        $guardar->save();

        //return response()->json($guardar);

        $GuardaFoliosig = folio_sig::find($folio_sig);
        $folio_sig = $folio_sig + 1;
        $GuardaFoliosig->folio = $folio_sig;
        $GuardaFoliosig->timestamps = false;
        $GuardaFoliosig->save();

        return Redirect('refrendos');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\refrendos  $refrendos
     * @return \Illuminate\Http\Response
     */
    public function show($folio)
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

        return view('refrendos.alta', $solicitud);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\refrendos  $refrendos
     * @return \Illuminate\Http\Response
     */
    public function edit($folio)
    {

        $solicitud['datos'] = refrendos::findorfail($folio);

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

        return view('refrendos.edicion', $solicitud);
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, refrendos $refrendos)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(refrendos $refrendos)
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

        $datos['actyear'] = $datos['solicitud']->refrendo_actual_vigente;

        return PDF::loadView('reportes.licencia_funcionamiento', $datos)->stream('licencia_funcionamiento.pdf');
    }

    public function busca_predial_pago2(request $request)
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
}
