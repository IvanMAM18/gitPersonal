<?php

namespace App\Http\Controllers;

use App\Models\direcciones;
use App\Models\negocio;
use App\Models\Persona;
use App\Models\personas_morales;
use App\Models\Requisito;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PersonaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('solicitudes.index');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return User::create([
            'name' => $request->nombre,
            'email' => $request->correo,
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make($request->contrasena),
        ]);

        return response()->json($request);
        /*
                date_default_timezone_set('America/Mazatlan');
                $fecha = now();

                $graba = new User();
                $graba->timestamps = false;
                $graba->name = $request->nombre;
                $graba->email = $request->correo;
                $graba->password = $request->contrasena;
                //$graba->created_at = $fecha->format('d-m-Y H:i:s');
                //$graba->updated_at = $fecha->format('d-m-Y H:i:s');
                $graba->save();
        */

        $guardar_persona = new Persona();

        $guardar_persona->nombre = strtoupper($request->nombre);
        $guardar_persona->apellidopaterno = strtoupper($request->apelllidopaterno);
        $guardar_persona->apellidomaterno = strtoupper($request->apelllidomaterno);
        $guardar_persona->curp = strtoupper($request->curp);
        $guardar_persona->rfc = strtoupper($request->rfc);
        $guardar_persona->telefono = strtoupper($request->telefono);
        $guardar_persona->correo = strtoupper($request->correo);
        $guardar_persona->sexo = $request->sexo;
        $guardar_persona->save();

        //personas morales
        $guardar_persona_morales = new personas_morales();

        $guardar_persona_morales->razonsocial = strtoupper($request->razonsocialinicial);
        $guardar_persona_morales->rfc = strtoupper($request->rfcinicial);
        $guardar_persona_morales->actaconstitutiva = strtoupper($request->actaconstitutiva);
        $guardar_persona_morales->cartasituacionfiscal = strtoupper($request->cartasituacionfiscal);
        $guardar_persona_morales->id_persona = $guardar_persona->id;
        $guardar_persona_morales->save();
        //personas morales

        //persona direccion
        $guardar_persona_direccion = new direcciones();

        $guardar_persona_direccion->calle_principal = strtoupper($request->calleprincipal);
        $guardar_persona_direccion->calles = strtoupper($request->calles);
        $guardar_persona_direccion->numero_externo = $request->numeroexterior;
        $guardar_persona_direccion->numero_interno = $request->numerointerior;
        $guardar_persona_direccion->colonia_id = $request->colonia;
        $guardar_persona_direccion->codigo_postal = $request->codigopostal;
        //$guardar_persona_morales->latitud = $request->;
        //$guardar_persona_morales->longitud = $request->;
        //$guardar_persona_morales->tipo = $request->;
        $guardar_persona_direccion->id_persona = $guardar_persona->id;
        $guardar_persona_direccion->save();
        //persona direccion

        //datos del negocio
        $guardar_negocio = new negocio();

        $guardar_negocio->nombrenegocio = strtoupper($request->nombrenegocio);
        //$guardar_negocio->status =
        //$guardar_negocio->folio =
        $guardar_negocio->apoderado_legal = strtoupper($request->apoderadolegal);
        $guardar_negocio->actividad_principal = strtoupper($request->actividadprincipal);
        $guardar_negocio->clave_catastral = $request->clavecatastral;
        $guardar_negocio->superficie_local = $request->superficielocal;
        $guardar_negocio->no_estacionamientos = $request->numeroestacionamiento;
        $guardar_negocio->clave_sapa = $request->clavesapa;
        $guardar_negocio->leyenda_anuncio = strtoupper($request->leyendaanuncio);
        $guardar_negocio->lugar_anuncio = strtoupper($request->lugaranuncio);
        $guardar_negocio->largo_anuncio = $request->largoanuncio;
        $guardar_negocio->ancho_anuncio = $request->anchoanuncio;
        $guardar_negocio->total_inversion = $request->totalinversion;
        $guardar_negocio->no_empleados = $request->numeroempleado;
        $guardar_negocio->no_hombres = $request->numerohombres;
        $guardar_negocio->no_mujeres = $request->numeromujeres;
        $guardar_negocio->persona_cap_diferentes = $request->personascapdiferentes;
        $guardar_negocio->observaciones = strtoupper($request->observaciones);
        $guardar_negocio->no_ssa = $request->nossa;
        $guardar_negocio->clave_reg_mpal = $request->claveregistromunicipal;

        $guardar_negocio->id_persona = $guardar_persona->id;

        $guardar_negocio->id_tiponegocio = $request->tipo;
        $guardar_negocio->id_gironegocio = $request->giro;
        $guardar_negocio->id_usonegocio = $request->usonegocio;
        $guardar_negocio->id_tipoanuncio = $request->tipoanuncio;
        $guardar_negocio->id_tipoasociacion = $request->tipoasociacion;
        $guardar_negocio->save();
        //datos del negocio

        //negocio direccion
        $guardar_negocio_direccion = new direcciones();

        $guardar_negocio_direccion->calle_principal = strtoupper($request->calleprincipalnegocio);
        $guardar_negocio_direccion->calles = strtoupper($request->callesnegocio);
        $guardar_negocio_direccion->numero_externo = $request->numeroexteriornegocio;
        $guardar_negocio_direccion->numero_interno = $request->numerointeriornegocio;
        $guardar_negocio_direccion->colonia_id = $request->colonianegocio;
        $guardar_negocio_direccion->codigo_postal = $request->codigopostalnegocio;
        //$guardar_negocio_direccion->latitud = $request->;
        //$guardar_negocio_direccion->longitud = $request->;
        //$guardar_negocio_direccion->tipo = $request->;
        $guardar_negocio_direccion->id_persona = $guardar_negocio->id;
        $guardar_negocio_direccion->save();
        //persona direccion
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Persona  $persona
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {

        // $datos = DB::table('persona')->where( 'correo', '=' ,'a');
        //->where('contrasena','=',$request->contrasena);

        // return response()->json($request);

        $credenciales = $request->only('email', 'password');
        //return response()->json($credenciales);

        if (Auth::attempt($credenciales)) {
            return response()->json('entro');
        }

        //$datos =persona::where('correo', '=' ,$request->mail,'and')->where('contrasena','=',$request->password)->first();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Models\persona  $persona
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {

        $act_persona = Persona::find($request->id_persona);
        $act_persona->nombre = strtoupper($request->nombre);
        $act_persona->apellidopaterno = strtoupper($request->apellidopaterno);
        $act_persona->apellidomaterno = strtoupper($request->apellidomaterno);
        $act_persona->curp = strtoupper($request->curp);
        $act_persona->rfc = strtoupper($request->rfc);
        $act_persona->telefono = strtoupper($request->telefono);
        $act_persona->correo = strtoupper($request->correo);
        $act_persona->sexo = $request->sexo;
        $act_persona->save();

        $act_per_mor = personas_morales::find($request->id_per_mor);
        $act_per_mor->razonsocial = strtoupper($request->razonsocial);
        $act_per_mor->rfc = strtoupper($request->per_mor_rfc);
        $act_per_mor->actaconstitutiva = strtoupper($request->actaconstitutiva);
        $act_per_mor->cartasituacionfiscal = strtoupper($request->cartasituacionfiscal);
        $act_per_mor->save();

        $act_dir_per = direcciones::find($request->id_dir_persona);
        $act_dir_per->calle_principal = strtoupper($request->calle_principal_persona);
        $act_dir_per->calles = strtoupper($request->calle_persona);
        $act_dir_per->numero_externo = $request->numero_externo_persona;
        $act_dir_per->numero_interno = $request->numero_interno_persona;
        if (! empty($request->id_colonia)) {
            $act_dir_per->colonia_id = $request->id_colonia;
        }
        $act_dir_per->codigo_postal = $request->codigo_postal_persona;
        //$act_dir_per->latitud = $request->;
        //$act_dir_per->longitud = $request->;
        //$act_dir_per->tipo = $request->;
        $act_dir_per->save();

        $act_negocio = negocio::find($request->id_negocio);
        $act_negocio->nombrenegocio = strtoupper($request->nombrenegocio);
        //$guardar_negocio->status =
        //$guardar_negocio->folio =
        $act_negocio->apoderado_legal = strtoupper($request->apoderado_legal);
        $act_negocio->actividad_principal = strtoupper($request->actividad_principal);
        $act_negocio->clave_catastral = $request->clave_catastral;
        $act_negocio->superficie_local = $request->superficie_local;
        $act_negocio->no_estacionamientos = $request->no_estacionamientos;
        $act_negocio->clave_sapa = $request->clave_sapa;
        $act_negocio->leyenda_anuncio = strtoupper($request->leyenda_anuncio);
        $act_negocio->lugar_anuncio = strtoupper($request->lugar_anuncio);
        $act_negocio->largo_anuncio = $request->largo_anuncio;
        $act_negocio->ancho_anuncio = $request->ancho_anuncio;
        $act_negocio->total_inversion = $request->total_inversion;
        $act_negocio->no_empleados = $request->no_empleados;
        $act_negocio->no_hombres = $request->no_hombres;
        $act_negocio->no_mujeres = $request->no_mujeres;
        $act_negocio->persona_cap_diferentes = $request->persona_cap_diferentes;
        $act_negocio->observaciones = strtoupper($request->observaciones);
        $act_negocio->no_ssa = $request->no_ssa;
        $act_negocio->clave_reg_mpal = $request->clave_reg_mpal;

        if (! empty($request->cv_tipo_negocio)) {
            $act_negocio->id_tiponegocio = $request->cv_tipo_negocio;
        }

        if (! empty($request->id_giro)) {
            $act_negocio->id_gironegocio = $request->id_giro;
        }

        if (! empty($request->id_uso_neg)) {
            $act_negocio->id_usonegocio = $request->id_uso_neg;
        }

        if (! empty($request->id_anuncio)) {
            $act_negocio->id_tipoanuncio = $request->id_anuncio;
        }

        if (! empty($request->id_cat_camara)) {
            $act_negocio->id_tipoasociacion = $request->id_cat_camara;
        }

        $act_negocio->save();

        $act_dir_neg = direcciones::find($request->id_dir_neg);
        $act_dir_neg->calle_principal = strtoupper($request->calle_principal_dir_neg);
        $act_dir_neg->calles = strtoupper($request->calles_dir_neg);
        $act_dir_neg->numero_externo = $request->numero_externo_dir_neg;
        $act_dir_neg->numero_interno = $request->numero_interno_dir_neg;
        if (! empty($request->colonianegocio)) {
            $act_dir_neg->colonia_id = $request->colonianegocio;
        }
        $act_dir_neg->codigo_postal = $request->codigo_postal_dir_neg;
        //$act_dir_per->latitud = $request->;
        //$act_dir_per->longitud = $request->;
        //$act_dir_per->tipo = $request->;
        $act_dir_neg->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Persona  $persona
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $borrarpersona = Persona::findOrFail($id);
        if ($borrarpersona) {
            $borrarpersona->delete();
        }
    }

    public function listar()
    {
        $datos = Persona::get();

        return response()->json($datos);
    }

    public function buscar($id)
    {
        /*
        $datos=persona::where('id', $id)->get();
        return response()->json($datos);
*/
        $datos = DB::connection('pgsql')
            ->select("select *,
        persona.id as id_persona,
        negocio.id as id_negocio,
        personas_morales.id as id_per_mor,
        personas_morales.rfc as per_mor_rfc,
        direcciones.id as id_dir_neg,
        direcciones.colonia_id as id_colonia_dir_neg,
        direcciones.calle_principal as calle_principal_dir_neg,
        direcciones.calles as calles_dir_neg,
        direcciones.numero_externo as numero_externo_dir_neg,
        direcciones.numero_interno as numero_interno_dir_neg,
        direcciones.codigo_postal as codigo_postal_dir_neg,
        (   select descripcion
            from public.catalogo_colonias
            where catalogo_colonias.id_colonia = direcciones.colonia_id
        ) as colonia_dir_neg,
        ( select id
        from public.direcciones
        where direcciones.id_persona = '".$id."'
        ) as id_dir_persona,
        ( select calle_principal
          from public.direcciones
          where direcciones.id_persona = '".$id."'
        ) as calle_principal_persona,
        ( select calles
          from public.direcciones
          where direcciones.id_persona = '".$id."'
        ) as calle_persona,
        ( select numero_externo
          from public.direcciones
          where direcciones.id_persona = '".$id."'
        ) as numero_externo_persona,
         ( select numero_interno
          from public.direcciones
          where direcciones.id_persona = '".$id."'
        ) as numero_interno_persona,
         ( select codigo_postal
          from public.direcciones
          where direcciones.id_persona = '".$id."'
        ) as codigo_postal_persona,
        ( select colonia_id
        from public.direcciones
        where direcciones.id_persona = '".$id."'
      ) as colonia_id_persona,
        (   select catalogo_colonias.descripcion
        from public.catalogo_colonias,public.direcciones
        where direcciones.id_persona = '".$id."'
        and direcciones.colonia_id = catalogo_colonias.id_colonia
        ) as colonia_persona,
        (   select cat_tipo_negocio.descripcion
           from public.cat_tipo_negocio,public.negocio
           where negocio.id_persona = '".$id."'
           and cat_tipo_negocio.cv_tipo_negocio = negocio.id_tiponegocio
       ) as tipo_negocio,
       (   select cat_bajo_impacto2020.descripcion
           from public.cat_bajo_impacto2020,public.negocio
           where negocio.id_persona = '".$id."'
           and cat_bajo_impacto2020.id_giro = negocio.id_gironegocio
       ) as giro_negocio,
      (   select catalogo_uso.descripcion
           from public.catalogo_uso,public.negocio
           where negocio.id_persona = '".$id."'
           and catalogo_uso.id_uso_neg = negocio.id_usonegocio
       ) as uso_negocio,
        (   select catalogo_tipo_anuncio.descripcion
           from public.catalogo_tipo_anuncio,public.negocio
           where negocio.id_persona = '".$id."'
           and catalogo_tipo_anuncio.id_anuncio = negocio.id_tipoanuncio
       ) as tipoanuncio_negocio,
       (   select cat_camaras.descripcion
           from public.cat_camaras,public.negocio
           where negocio.id_persona = '".$id."'
           and cat_camaras.id_cat_camara = negocio.id_tipoasociacion
       ) as tipocamara_negocio
        from public.personas_morales,
             public.persona,
             public.negocio,
             public.direcciones
        where persona.id='".$id."'
        and personas_morales.id_persona = persona.id
        and persona.id = negocio.id_persona
        and negocio.id = direcciones.id_persona");

        return response()->json($datos);
    }

    public function expediente_completado(User $user)
    {
        $requisitosObligatoriosIds = Requisito::whereIn('codigo', [
            'identificacion-frontal',
            'identificacion-trasera',
            'comprobante-de-domicilio',
        ])->pluck('id');

        return response([
            'completed' => $user->requisitos()->whereIn('requisito_id', $requisitosObligatoriosIds->toArray())->count(),
        ]);
    }
}
