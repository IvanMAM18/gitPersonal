<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AvisoEntero;
use App\Models\Concepto;
use App\Models\ConceptoDetalle;
use App\Models\Negocio;
use App\Models\Persona_moral;
use App\Models\Tramite;
use App\Models\Inciso;
use Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Response;

class AvisoEnteroMultasController extends Controller
{
    public function index(Negocio $negocio, Request $request)
    {
        $data = $request->validate([
            'incisos' => ['required'],
        ], [
            'incisos.required' => 'El campo incisos es obligatorio.',
        ]);

        $incisos_ids = $data['incisos']; // array de ids, de los incisos

        $negocio->load(['persona_moral.direccion_notificacion', 'persona.direccion_notificacion']);
        
        $tramite = $negocio->tramitePadre()
            ->orderBy('id', 'desc')
            ->first();

        $persona_moral = $negocio->persona_moral;
        $persona = $negocio->persona;

        $rfc = $curp = $nombre = $apellido1 = $apellido2 = $direccion = '';
    
        $fechaEmision = Carbon::now()->format('Y-m-d');
        $fechaVigencia = Carbon::now()->endOfYear()->format('Y-m-d');

        if (Carbon::now()->month == 1) {
            $fechaVigencia = Carbon::now()->endOfMonth()->format('Y-m-d');
        }

        $direccion = null;

        if ($persona_moral != null) {
            $nombre = $persona_moral->razon_social;
            $apellido1 = '';
            $apellido2 = '';
            $rfc = $persona_moral->rfc;
            $curp = $persona ? $persona->curp : '';
            $regimen_fiscal = $persona_moral->regimen_fiscal;
            $direccion = $persona_moral->direccion_notificacion;
        } else if ($persona != null) {
            $nombre = $persona->nombre;
            $apellido1 = $persona->apellido_pat;
            $apellido2 = $persona->apellido_mot;
            $rfc = $persona->rfc;
            $curp = $persona->curp;
            $regimen_fiscal = $persona->regimen_fiscal;
            $direccion = $persona->direccion_notificacion;
        }

        $servicio = in_array($tramite->catalogo_tramite->entidad_revisora_id, [7])
            ? 'AJ'
            : 'Q';

        $incisos = Inciso::whereIn('id', $incisos_ids)->get();

        $datosGenerarAPI = [
            'fecha_emi' => $fechaEmision,
            'fecha_vig' => $fechaVigencia,
            'servicio' => $servicio,
            'nombre' => $nombre,
            'apellido1' => $apellido1,
            'apellido2' => $apellido2,
            'obs1' => "LOREM IPSUM DOLOR SITE AMET",
            'obs2' => "TRAMITE ID: $tramite->id NOMBRE COMERCIAL $negocio->nombre_del_negocio. DIRECCION: $direccion->calle_principal NO.INT.$direccion->numero_interior NO.EXT.$direccion->numero_exterior COLONIA $direccion->calles C.P. $direccion->codigo_postal",
            'obs3' => 'ESTE VALOR DEBE SER REEMPLZADO POR LA CANTIDAD DE UMAS',
            'obs4' => 'LOREM IPSUM DOLOR SITE AMET',
            'rfc' => strtoupper($rfc),
            'direccion' => "$direccion->calle_principal, $direccion->calles",
            'cp' => $direccion->codigo_postal,
            'curp' => strtoupper($curp),
            'regimen_fiscal' => $regimen_fiscal,
            'detalles' => $incisos,
        ];

        return [
            'ok' => true,
            'datos' => $datosGenerarAPI,
        ];
    }
}
