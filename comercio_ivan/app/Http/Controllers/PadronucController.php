<?php

namespace App\Http\Controllers;

use App\Models\padronuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PadronucController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $datos['listas'] = padronuc::orderBy('id_puc', 'desc')->paginate(5);

        return view('padron.altacontribuyente', $datos);

        //return response()->json($datos);
    }

    public function buscaubipadron(Request $request)
    {

        $datosubicacion = DB::connection('oracle')->select('select *
        from contribuyentes.padronuc,
             contribuyentes.padronuc_dom
        where contribuyentes.padronuc.id_puc = contribuyentes.padronuc_dom.id_puc
        and   contribuyentes.padronuc.id_puc='.$request->busca_id_pu.'');

        return response()->json($datosubicacion);
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

        $fecha_reg = date('Y-m-d');
        $usuario_reg = 'SARE'; //ES EL USAURIO QUE CAPTURA
        $estatus = 'ACTIVO';

        if ($request->optpersona == '1') {
            $tipo_persona = 'FISICA';
        }
        if ($request->optpersona == '2') {
            $tipo_persona = 'MORAL';
        }
        if ($request->optpersona == '3') {
            $tipo_persona = 'GENERICA';
        }

        if ($request->optgenero == '1') {
            $genero = 'H';
        } else {
            $genero = 'M';
        }

        if ($request->optsat == '1') {
            $sat = 'S';
        } else {
            $sat = 'N';
        }

        //guarda datosn cat contactalos solicitante
        $guardar_padron_contri = new padronuc();
        $guardar_padron_contri->timestamps = false;
        $guardar_padron_contri->rfc = $request->txtrfc;
        $guardar_padron_contri->tipo_persona = $tipo_persona;
        $guardar_padron_contri->curp = $request->txtcurp;
        $guardar_padron_contri->nombre = $request->txtrazonsocial;
        $guardar_padron_contri->apellido1 = $request->txtApellidoPaterno;
        $guardar_padron_contri->apellido2 = $request->txtApellidoMaterno;
        $guardar_padron_contri->fecha_reg = $fecha_reg;
        $guardar_padron_contri->usuario_reg = $usuario_reg;
        $guardar_padron_contri->estatus = $estatus;
        $guardar_padron_contri->genero = $genero;
        $guardar_padron_contri->fechanac = $request->txtfecha_naci;
        $guardar_padron_contri->nacionalidad = $request->txtnacionalidad;
        $guardar_padron_contri->entidad = $request->txtentidad;
        $guardar_padron_contri->correo = $request->txtce;
        $guardar_padron_contri->celular = $request->txtcel;
        $guardar_padron_contri->telefono = $request->txttel;
        $guardar_padron_contri->representante = $request->txtrepresentante;
        $guardar_padron_contri->registrado_sat = $sat;

        $datos = DB::connection('oracle')->select('select max(id_puc) as idpu
                                                from contribuyentes.padronuc');
        $idmaxpu = $datos[0]->idpu;
        $idmaxpu = $idmaxpu + 1;
        $guardar_padron_contri->id_puc = $idmaxpu;

        $guardar_padron_contri->save();

        $despliega['listas'] = padronuc::orderBy('id_puc', 'desc')->paginate(10);

        return view('padron.altacontribuyente', $despliega);

        return response()->json($guardar_padron_contri);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(padronuc $padronuc)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\padronuc  $padronuc
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $id_puc)
    {
        // if (request()->ajax())
        //{
        $datos['contribuyente'] = padronuc::find($id_puc);

        // $datos['entidades']=padron_cat_entidades::all();
        // $datos['municipios']=padron_cat_municipios::all();
        // $datos['localidades']=padron_cat_localidades::all();
        // $datos['colonias']=padron_cat_colonias::all();

        //return response()->json($idpuc);
        //return view('padron.editcontribuyente',$datos,$idpuc);
        return view('padron.editcontribuyente', $datos);
        //}
        //else
        //{
        //abort(404,"error");
        //}
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Models\padronuc  $padronuc
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id_puc)
    {
        if ($request->optpersona == '1') {
            $tipo_persona = 'FISICA';
        }
        if ($request->optpersona == '2') {
            $tipo_persona = 'MORAL';
        }
        if ($request->optpersona == '3') {
            $tipo_persona = 'GENERICA';
        }

        if ($request->optgenero == '1') {
            $genero = 'H';
        } else {
            $genero = 'M';
        }

        if ($request->optsat == '1') {
            $sat = 'S';
        } else {
            $sat = 'N';
        }

        $actupadron = padronuc::find($id_puc);
        $actupadron->timestamps = false;
        $actupadron->rfc = $request->txtrfc;
        $actupadron->tipo_persona = $tipo_persona;
        $actupadron->curp = $request->txtcurp;
        $actupadron->nombre = $request->txtrazonsocial;
        $actupadron->apellido1 = $request->txtApellidoPaterno;
        $actupadron->apellido2 = $request->txtApellidoMaterno;
        $actupadron->genero = $genero;
        $actupadron->fechanac = $request->txtfecha_naci;
        $actupadron->nacionalidad = $request->txtnacionalidad;
        $actupadron->entidad = $request->txtentidad;
        $actupadron->correo = $request->txtce;
        $actupadron->celular = $request->txtcel;
        $actupadron->telefono = $request->txttel;
        $actupadron->representante = $request->txtrepresentante;
        $actupadron->registrado_sat = $sat;

        $actupadron->save();

        $datos['contribuyente'] = padronuc::find($id_puc);

        return view('padron.editcontribuyente', $datos);

        //return response()->json($actupadron);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(padronuc $padronuc)
    {
        //
    }
}
