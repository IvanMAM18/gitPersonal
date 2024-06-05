<?php

namespace App\Http\Controllers;

use App\Models\padron_dom;
use App\Models\padronuc;
use App\Models\padronuc_area;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PadronDomController extends Controller
{
    public function buscalle(Request $request)
    {

        if (request()->ajax()) {
            $datoscalle = DB::connection('oracle')->select("select cv_via,nombre 
            from contribuyentes.cat_inegi_vialidades_bcs 
            where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001'
            and nombre like '%".$request->busca_calle_uc."%' AND rownum <=10");

            return response()->json($datoscalle);
        } else {
            abort(404, 'error');
        }
    }

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

        $cve_entidad = '';
        $entidades = '';
        $cve_municipio = '';
        $municipio = '';
        $cve_localidad = '';
        $localidad = '';
        $cve_colonia = '';
        $colonia = '';
        $cp = '';
        $clavecata = '';
        $clave_calle = '';
        $calle = '';
        $clave_entre = '';
        $entre = '';
        $clave_yentre = '';
        $yentre = '';
        $noint = '';
        $noext = '';

        $estatus = 'ACTIVO';
        $fecha_reg = date('Y-m-d');
        $usuario_reg = 'SARE'; //ES EL USAURIO QUE CAPTURA

        if ($request->optdespliubica == '1') {
            $tipo_domicilio = 'NORMAL';
            $cve_entidad = $request->cbocat_entidades_con;
            $municipio = $request->txtmunicipio_con;
            $localidad = $request->txtlocalidad_con;
            $colonia = $request->txtcolonia_con;
            $cp = $request->txtcp_con;
            $clavecata = $request->txtclavecata_con;
            $calle = $request->txtcalle_con;
            $entre = $request->txtentre_con;
            $yentre = $request->txtyentre_con;
            $noint = $request->txtnoint_con;
            $noext = $request->txtnoext_con;
        }

        if ($request->optdespliubica == '2') {
            $tipo_domicilio = 'ESTABLECIMIENTO';

            $cve_entidad = $request->cbocat_entidades_esta;
            $cve_municipio = $request->cbocat_municipios_esta;
            $cve_localidad = $request->cbocat_localidad_esta;
            $cve_colonia = $request->cbocat_colonia_esta;

            $cp = $request->txtcp_esta;
            $clavecata = $request->txtclavecata_esta;
            // GRABA LA CALLE PARA ASI EVITAR UAN CONSULTA BUSCANDO LA CALLE
            $clave_calle = $request->txtcalleclave_esta;
            $calle = $request->txtcalle_esta;
            // GRABA LA CALLE PARA ASI EVITAR UAN CONSULTA BUSCANDO LA CALLE
            $clave_entre = $request->txtentreclave_esta;
            $entre = $request->txtentre_esta;
            // GRABA LA CALLE PARA ASI EVITAR UAN CONSULTA BUSCANDO LA CALLE
            $clave_yentre = $request->txtyentreclave_esta;
            $yentre = $request->txtyentre_esta;

            $noint = $request->txtnoint_esta;
            $noext = $request->txtnoext_esta;
        }
        if ($request->optdespliubica == '3') {
            $tipo_domicilio = 'NOTIFICAR';
            $cve_entidad = $request->cbocat_entidades_noti;
            $municipio = $request->txtmunicipio_noti;
            $localidad = $request->txtlocalidad_noti;
            $colonia = $request->txtcolonia_noti;
            $cp = $request->txtcp_noti;
            $clavecata = $request->txtclavecata_noti;
            $calle = $request->txtcalle_noti;
            $entre = $request->txtentre_noti;
            $yentre = $request->txtyentre_noti;
            $noint = $request->txtnoint_noti;
            $noext = $request->txtnoext_noti;
        }
        if ($request->optdespliubica == '4') {
            $tipo_domicilio = 'FISCAL';
            $cve_entidad = $request->cbocat_entidades_fis;
            $municipio = $request->txtmunicipio_fis;
            $localidad = $request->txtlocalidad_fis;
            $colonia = $request->txtcolonia_fis;
            $cp = $request->txtcp_fis;
            $clavecata = $request->txtclavecata_fis;
            $calle = $request->txtcalle_fis;
            $entre = $request->txtentre_fis;
            $yentre = $request->txtyentre_fis;
            $noint = $request->txtnoint_fis;
            $noext = $request->txtnoext_fis;
        }

        //guarda datosn cat contactalos solicitante
        $guardar_ubicacion = new padron_dom();

        $guardar_ubicacion->timestamps = false;

        $guardar_ubicacion->id_puc = $request->txtidpuc;

        $guardar_ubicacion->tipo_domicilio = $tipo_domicilio;

        $guardar_ubicacion->numint = $noint;
        $guardar_ubicacion->numext = $noext;

        $guardar_ubicacion->calle = $calle;
        $guardar_ubicacion->entre = $entre;
        $guardar_ubicacion->yentre = $yentre;

        $guardar_ubicacion->cp = $cp;
        $guardar_ubicacion->colonia = $colonia;
        $guardar_ubicacion->localidad = $localidad;
        $guardar_ubicacion->municipio = $municipio;
        $guardar_ubicacion->estado = $entidades;

        $guardar_ubicacion->cve_colonia = $cve_colonia;
        $guardar_ubicacion->cve_localidad = $cve_localidad;
        $guardar_ubicacion->cve_municipio = $cve_municipio;
        $guardar_ubicacion->cve_entidad = $cve_entidad;

        $guardar_ubicacion->estatus = $estatus;
        $guardar_ubicacion->fecha_reg = $fecha_reg;
        $guardar_ubicacion->usuario_reg = $usuario_reg;
        $guardar_ubicacion->clavecatastral = $clavecata;

        $guardar_ubicacion->cve_calle_principal = $clave_calle;
        $guardar_ubicacion->cve_calle_entre = $clave_entre;
        $guardar_ubicacion->cve_calle_y_entre = $clave_yentre;

        $datos = DB::connection('oracle')->select('Select 
        contribuyentes.S_PADRONUC_DOM_ID.Nextval as idom from Dual');
        $sigidom = $datos[0]->idom;

        $guardar_ubicacion->id_domicilio = $sigidom;

        $guardar_ubicacion->save();

        //guarda padron area
        //padrom area GUARDA ESTA PARTE CUADO SE GENERE EL
        /*$nombre_padronf="SARE";
        $area_padronf="DIRECCION DE COMERCIO";

        $guardar_padron_area = new padronuc_area();
        $guardar_padron_area->timestamps = false;
        $guardar_padron_area->id_puc = $request->txtidpuc;
        $guardar_padron_area->id_padron_foraneo = GUARDA ESTO CUADO SE GENERE ESTE ID
        $guardar_padron_area->nombre_padronf = $nombre_padronf;
        $guardar_padron_area->area_padronf =$area_padronf;
        $guardar_padron_area->id_domicilio = $sigidom;
        $guardar_padron_area->save();*/
        //guarda padron area

        $datos['contribuyente'] = padronuc::find($request->txtidpuc);

        $datos['entidades'] = DB::connection('oracle')->select('select clave,nombre
                                            from contribuyentes.cat_entidad');

        $datos['municipios'] = DB::connection('oracle')->select('select clave,nombre
                                        from contribuyentes.cat_inegi_municipios');

        $datos['localidades'] = DB::connection('oracle')->select("select cv_localidad,nombre
                                    from contribuyentes.cat_inegi_localidades_bcs
                                    where cv_entidad='03' and cv_municipio='003' order by cv_localidad");

        $datos['colonias'] = DB::connection('oracle')->select("select cv_colonia,nombre
                                        from contribuyentes.cat_inegi_colonias_bcs
                                    where cv_entidad='03' and cv_municipio='003' order by nombre");

        $datos['listas'] = padron_dom::where('id_puc', $request->txtidpuc)->paginate(5);

        return view('ubicacion.altadomcontri', $datos);

        //return response()->json($guardar_ubicacion);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\padron_dom  $padron_dom
     * @return \Illuminate\Http\Response
     */
    public function show($id_puc)
    {

        $datos['contribuyente'] = padronuc::find($id_puc);

        $datos['entidades'] = DB::connection('oracle')->select('select clave,nombre
                                            from contribuyentes.cat_entidad');

        $datos['municipios'] = DB::connection('oracle')->select('select clave,nombre
                                        from contribuyentes.cat_inegi_municipios');

        $datos['localidades'] = DB::connection('oracle')->select("select cv_localidad,nombre
                                    from contribuyentes.cat_inegi_localidades_bcs
                                    where cv_entidad='03' and cv_municipio='003' order by cv_localidad");

        $datos['colonias'] = DB::connection('oracle')->select("select cv_colonia,nombre
                                        from contribuyentes.cat_inegi_colonias_bcs
                                    where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001' order by nombre");

        $datos['listas'] = padron_dom::where('id_puc', $id_puc)->orderByDesc('tipo_domicilio')->paginate(5);

        return view('ubicacion.altadomcontri', $datos);
        //return response()->json($datos);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\padron_dom  $padron_dom
     * @return \Illuminate\Http\Response
     */
    public function edit($id_domicilio)
    {

        $datos['ubicacion'] = padron_dom::find($id_domicilio);

        //se hizo asi por que con eloquent en oracle
        //los id de los catalogos los convertia en numerico

        if (! empty($datos['ubicacion']->cve_entidad)) {
            //encuentra el que es
            $datos['cbo_entidades'] = DB::connection('oracle')->select('select clave,nombre
                                                  from contribuyentes.cat_entidad
                               where clave = '.$datos['ubicacion']->cve_entidad);
            //llena los combobox
            $datos['entidades'] = DB::connection('oracle')->select('select clave,nombre
                                                    from contribuyentes.cat_entidad
                                where clave <> '.$datos['ubicacion']->cve_entidad);
        } else {
            //llena los combobox
            $datos['entidades'] = DB::connection('oracle')->select('select clave,nombre
                                                    from contribuyentes.cat_entidad');
        }

        if (! empty($datos['ubicacion']->cve_municipio)) {
            //encuentra el que es
            $datos['cbo_municipios'] = DB::connection('oracle')->select('select clave,nombre
                                                from contribuyentes.cat_inegi_municipios
                            where clave = '.$datos['ubicacion']->cve_municipio);
            //llena los combobox
            $datos['municipios'] = DB::connection('oracle')->select('select clave,nombre
                                                    from contribuyentes.cat_inegi_municipios
                                where clave <> '.$datos['ubicacion']->cve_municipio);
        } else {
            //llena los combobox
            $datos['municipios'] = DB::connection('oracle')->select('select clave,nombre
                                                    from contribuyentes.cat_inegi_municipios');
        }

        if (! empty($datos['ubicacion']->cve_localidad)) {
            //encuentra el que es
            $datos['cbo_localidades'] = DB::connection('oracle')->select("select cv_localidad,nombre
                                                    from contribuyentes.cat_inegi_localidades_bcs
                                where cv_entidad='03' and cv_municipio='003' 
                                and cv_localidad = ".$datos['ubicacion']->cve_localidad);

            //llena los combobox
            $datos['localidades'] = DB::connection('oracle')->select("select cv_localidad,nombre
                                                from contribuyentes.cat_inegi_localidades_bcs
                    where cv_entidad='03' and cv_municipio='003' 
                    and cv_localidad <> ".$datos['ubicacion']->cve_localidad.' order by cv_localidad');
        } else {
            $datos['localidades'] = DB::connection('oracle')->select("select cv_localidad,nombre
                                                from contribuyentes.cat_inegi_localidades_bcs
                    where cv_entidad='03' and cv_municipio='003' order by cv_localidad");
        }

        if (! empty($datos['ubicacion']->cve_colonia)) {
            //encuentra el que es
            $datos['cbo_colonias'] = DB::connection('oracle')->select("select cv_colonia,nombre
                                                from contribuyentes.cat_inegi_colonias_bcs
                            where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001'
                            and cv_colonia = ".$datos['ubicacion']->cve_colonia);
            //llena los combobox
            $datos['colonias'] = DB::connection('oracle')->select("select cv_colonia,nombre
                                                    from contribuyentes.cat_inegi_colonias_bcs
                        where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001'
                        and cv_colonia <> '".$datos['ubicacion']->cve_colonia."' order by nombre");
        } else {
            $datos['colonias'] = DB::connection('oracle')->select("select cv_colonia,nombre
                                                    from contribuyentes.cat_inegi_colonias_bcs
                        where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001' order by nombre");
        }

        return view('ubicacion.editdomcontri', $datos);

        //return response()->json($datos);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Models\padron_dom  $padron_dom
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id_domicilio)
    {
        $cve_entidad = '';
        $entidades = '';
        $cve_municipio = '';
        $municipio = '';
        $cve_localidad = '';
        $localidad = '';
        $cve_colonia = '';
        $colonia = '';
        $cp = '';
        $clavecata = '';
        $clave_calle = '';
        $calle = '';
        $clave_entre = '';
        $entre = '';
        $clave_yentre = '';
        $yentre = '';
        $noint = '';
        $noext = '';

        if ($request->txttipo_domicilio == 'NORMAL') {
            $cve_entidad = $request->cbocat_entidades_con;
            $municipio = $request->txtmunicipio_con;
            $localidad = $request->txtlocalidad_con;
            $colonia = $request->txtcolonia_con;
            $cp = $request->txtcp_con;
            $clavecata = $request->txtclavecata_con;
            $calle = $request->txtcalle_con;
            $entre = $request->txtentre_con;
            $yentre = $request->txtyentre_con;
            $noint = $request->txtnoint_con;
            $noext = $request->txtnoext_con;
        }

        if ($request->txttipo_domicilio == 'ESTABLECIMIENTO') {
            $cve_entidad = $request->cbocat_entidades_esta;
            $cve_municipio = $request->cbocat_municipios_esta;
            $cve_localidad = $request->cbocat_localidad_esta;
            $cve_colonia = $request->cbocat_colonia_esta;

            // GRABA LA CALLE PARA ASI EVITAR UAN CONSULTA BUSCANDO LA CALLE
            $cp = $request->txtcp_esta;
            $clavecata = $request->txtclavecata_esta;
            // GRABA LA CALLE PARA ASI EVITAR UAN CONSULTA BUSCANDO LA CALLE
            $clave_calle = $request->txtcalleclave_esta;
            $calle = $request->txtcalle_esta;
            // GRABA LA CALLE PARA ASI EVITAR UAN CONSULTA BUSCANDO LA CALLE
            $clave_entre = $request->txtentreclave_esta;
            $entre = $request->txtentre_esta;

            $clave_yentre = $request->txtyentreclave_esta;
            $yentre = $request->txtyentre_esta;

            $noint = $request->txtnoint_esta;
            $noext = $request->txtnoext_esta;
        }

        if ($request->txttipo_domicilio == 'NOTIFICAR') {
            $cve_entidad = $request->cbocat_entidades_noti;
            $municipio = $request->txtmunicipio_noti;
            $localidad = $request->txtlocalidad_noti;
            $colonia = $request->txtcolonia_noti;
            $cp = $request->txtcp_noti;
            $clavecata = $request->txtclavecata_noti;
            $calle = $request->txtcalle_noti;
            $entre = $request->txtentre_noti;
            $yentre = $request->txtyentre_noti;
            $noint = $request->txtnoint_noti;
            $noext = $request->txtnoext_noti;
        }

        if ($request->txttipo_domicilio == 'FISCAL') {
            $cve_entidad = $request->cbocat_entidades_fis;
            $municipio = $request->txtmunicipio_fis;
            $localidad = $request->txtlocalidad_fis;
            $colonia = $request->txtcolonia_fis;
            $cp = $request->txtcp_fis;
            $clavecata = $request->txtclavecata_fis;
            $calle = $request->txtcalle_fis;
            $entre = $request->txtentre_fis;
            $yentre = $request->txtyentre_fis;
            $noint = $request->txtnoint_fis;
            $noext = $request->txtnoext_fis;
        }

        if (! empty($id_domicilio)) {
            $actudomi = padron_dom::find($id_domicilio);
            $actudomi->timestamps = false;
            $actudomi->calle = $calle;
            $actudomi->entre = $entre;
            $actudomi->yentre = $yentre;
            $actudomi->numint = $noint;
            $actudomi->numext = $noext;
            $actudomi->cp = $cp;
            $actudomi->colonia = $colonia;
            $actudomi->localidad = $localidad;
            $actudomi->municipio = $municipio;
            $actudomi->estado = $entidades;
            $actudomi->cve_colonia = $cve_colonia;
            $actudomi->cve_localidad = $cve_localidad;
            $actudomi->cve_municipio = $cve_municipio;
            $actudomi->cve_entidad = $cve_entidad;
            $actudomi->clavecatastral = $clavecata;
            $actudomi->cve_calle_principal = $clave_calle;
            $actudomi->cve_calle_entre = $clave_entre;
            $actudomi->cve_calle_y_entre = $clave_yentre;

            $actudomi->save();
        }

        $datos['ubicacion'] = padron_dom::find($id_domicilio);

        //se hizo asi por que con eloquent en oracle
        //los id de los catalogos los convertia en numerico
        //encuentra el que es

        if (! empty($datos['ubicacion']->cve_entidad)) {
            //encuentra el que es
            $datos['cbo_entidades'] = DB::connection('oracle')->select('select clave,nombre
                                                  from contribuyentes.cat_entidad
                               where clave = '.$datos['ubicacion']->cve_entidad);
            //llena los combobox
            $datos['entidades'] = DB::connection('oracle')->select('select clave,nombre
                                                    from contribuyentes.cat_entidad
                                where clave <> '.$datos['ubicacion']->cve_entidad);
        }

        if (! empty($datos['ubicacion']->cve_municipio)) {
            //encuentra el que es
            $datos['cbo_municipios'] = DB::connection('oracle')->select('select clave,nombre
                                                from contribuyentes.cat_inegi_municipios
                            where clave = '.$datos['ubicacion']->cve_municipio);
            //llena los combobox
            $datos['municipios'] = DB::connection('oracle')->select('select clave,nombre
                                                    from contribuyentes.cat_inegi_municipios
                                where clave <> '.$datos['ubicacion']->cve_municipio);
        }

        if (! empty($datos['ubicacion']->cve_localidad)) {
            //encuentra el que es
            $datos['cbo_localidades'] = DB::connection('oracle')->select("select cv_localidad,nombre
                                                    from contribuyentes.cat_inegi_localidades_bcs
                                where cv_entidad='03' and cv_municipio='003'
                                and cv_localidad = ".$datos['ubicacion']->cve_localidad);

            //llena los combobox
            $datos['localidades'] = DB::connection('oracle')->select("select cv_localidad,nombre
                                                from contribuyentes.cat_inegi_localidades_bcs
                    where cv_entidad='03' and cv_municipio='003' 
                    and cv_localidad <> ".$datos['ubicacion']->cve_localidad.' order by cv_localidad');
        }

        if (! empty($datos['ubicacion']->cve_colonia)) {
            //encuentra el que es
            $datos['cbo_colonias'] = DB::connection('oracle')->select("select cv_colonia,nombre
                                                from contribuyentes.cat_inegi_colonias_bcs
                            where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001'
                            and cv_colonia = ".$datos['ubicacion']->cve_colonia);
            //llena los combobox
            $datos['colonias'] = DB::connection('oracle')->select("select cv_colonia,nombre
                                                    from contribuyentes.cat_inegi_colonias_bcs
                        where cv_entidad='03' and cv_municipio='003' and cv_localidad='0001'
                        and cv_colonia <> ".$datos['ubicacion']->cve_colonia.' order by nombre');
        }

        return view('ubicacion.editdomcontri', $datos);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(padron_dom $padron_dom)
    {
        //
    }
}
