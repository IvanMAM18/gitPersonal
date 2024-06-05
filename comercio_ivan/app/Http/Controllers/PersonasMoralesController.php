<?php

namespace App\Http\Controllers;

use App\Models\DatosFacturacion;
use App\Models\Direccion;
use App\Models\Negocio;
use App\Models\PersonaMoral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PersonasMoralesController extends Controller
{
    public function moveRegimenCapitalToPersonaMoral()
    {
        $dfs = DatosFacturacion::select(['id', 'persona_moral_id', 'regimen_capital'])->whereNotNull('persona_moral_id')->whereNotNull('regimen_capital')->get();

        $pmold = [];
        $pmnew = [];
        foreach ($dfs as $df) {
            $pm = PersonaMoral::where('id', $df->persona_moral_id)->first();
            //array_push($pmold,$pm);
            $pm->regimen_capital = $df->regimen_capital;
            $pm->save();
        }
        $pms = PersonaMoral::select(['id', 'regimen_capital'])->wherenotnull('regimen_capital')->get();

        return ['dfs' => $dfs, 'pms' => $pms];
    }

    public function actualziarPersonaMoral(Request $request)
    {
        $persona_moral = PersonaMoral::find($request['id']);

        $persona_moral->razon_social = $request['razon_social'];
        $persona_moral->regimen_capital = $request['regimen_capital'];
        $persona_moral->regimen_fiscal = $request['regimen_fiscal'];
        $persona_moral->save();

        return $persona_moral;
    }

    public function crearPersonaMoral(Request $request)
    {
        $personaMoralByRFC = PersonaMoral::where('rfc', $request->input('rfc'))->get();

        if (count($personaMoralByRFC) > 0) {
            return ['error_rfc' => true];
        }

        $direccion = $request->direccion;
        if ($direccion != null) {
            $direccion = Direccion::create([
                'calle_principal' => $direccion['calle_principal'],
                'calles' => $direccion['calles'],
                'codigo_postal' => $direccion['codigo_postal_colonia']['codigo_postal'],
                'colonia_id' => $direccion['codigo_postal_colonia']['colonia_id'],
                'latitud' => $direccion['coordenadas']['latitud'],
                'longitude' => $direccion['coordenadas']['longitude'],
                'numero_externo' => $direccion['numero_externo'],
                'numero_interno' => $direccion['numero_interno'],
                'tipo' => '-',
                'delegacion' => $direccion['delegacion'],
            ]);
        }

        $direccionNoti = $request->direccionNoti;

        if ($request->input('mismaDireccion') === false) {
            $direccionNoti = Direccion::create([
                'calle_principal' => $direccionNoti['calle_principal'],
                'calles' => $direccionNoti['calles'],
                'codigo_postal' => $direccionNoti['codigo_postal_colonia']['codigo_postal'],
                'colonia_id' => $direccionNoti['codigo_postal_colonia']['colonia_id'],
                'latitud' => $direccionNoti['coordenadas']['latitud'],
                'longitude' => $direccionNoti['coordenadas']['longitude'],
                'numero_externo' => $direccionNoti['numero_externo'],
                'numero_interno' => $direccionNoti['numero_interno'],
                'tipo' => '-',
                'delegacion' => $direccion['delegacion'],
            ]);
        }

        $carta_de_situacion_fiscal = '-';
        $mismaDireccion = $request->input('mismaDireccion');
        $dir_notif_id = $mismaDireccion === false ? ($direccionNoti != null ? $direccionNoti->id : 0) : ($direccion != null ? $direccion->id : 0);
        $persona_moral = PersonaMoral::create([
            'razon_social' => $request->input('razon_social'),
            'rfc' => $request->input('rfc'),
            'acta_constitutiva_path' => $request->input('acta_constitutiva_path'),
            'carta_de_situacion_fiscal' => $carta_de_situacion_fiscal,
            'persona_id' => Auth::user()->id,
            'regimen_fiscal' => $request->input('regimen_fiscal'),
            'regimen_capital' => $request->input('regimen_capital'),
            'direccion_id' => $direccion !== null ? $direccion->id : 0,
            'direccion_de_notificacion_id' => $dir_notif_id,
        ]);

        if ($request->input('negocio_id') !== -1) {
            $negocio = Negocio::find($request->input('negocio_id'));
            if ($negocio !== null) {
                $negocio->persona_moral_id = $persona_moral->id;
                $negocio->save();
            }
        }

        return $persona_moral;
    }

    public function actualizarDireccionPersonaMoral(Request $request)
    {

        $direccion = Direccion::find($request['id']);

        $direccion->calle_principal = $request['calle_principal'];
        $direccion->calles = $request['calles'];
        $direccion->codigo_postal = $request['codigo_postal'];
        $direccion->colonia_id = $request['colonia_id'];
        $direccion->latitud = $request['latitud'];
        $direccion->longitude = $request['longitude'];
        $direccion->numero_externo = $request['numero_externo'];
        $direccion->numero_interno = $request['numero_interno'];
        $direccion->tipo = $request['tipo'];
        $direccion->delegacion = $request['delegacion'];
        $direccion->save();
        $persona_moral = PersonaMoral::find($request['persona_moral_id']);
        if ($request['accion'] === 'direccion_id') {
            $persona_moral->direccion_id = $direccion->id;
        }
        if ($request['accion'] === 'direccion_notificacion_id') {
            $persona_moral->direccion_notificacion_id = $direccion->id;
        }

        return $direccion;
    }

    public function crearDireccionPersonaMoral(Request $request)
    {

        $direccion = Direccion::create([
            'calle_principal' => $request['calle_principal'],
            'calles' => $request['calles'],
            'codigo_postal' => $request['codigo_postal'],
            'colonia_id' => $request['colonia_id'],
            'latitud' => $request['latitud'],
            'longitude' => $request['longitude'],
            'numero_externo' => $request['numero_externo'],
            'numero_interno' => $request['numero_interno'],
            'tipo' => $request['tipo'],
            'delegacion' => $request['delegacion'],
        ]);

        $persona_moral = PersonaMoral::find($request['persona_moral_id']);
        if ($request['accion'] === 'direccion_id') {
            $persona_moral->direccion_id = $direccion->id;
        }
        if ($request['accion'] === 'direccion_notificacion_id') {
            $persona_moral->direccion_de_notificacion_id = $direccion->id;
        }
        $persona_moral->save();

        return $direccion;
    }

    public function getPersonasMoralesPorUsuario()
    {
        if (Auth::user() == null) {
            return redirect('/login');
        }

        if (Auth::user()->entidad_revision_id !== null) {
            return [];
        }

        $id_usuario = Auth::user()->id;

        return PersonaMoral::where('persona_id', $id_usuario)->get();
    }
}
