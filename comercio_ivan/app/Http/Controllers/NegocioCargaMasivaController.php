<?php

namespace App\Http\Controllers;

use App\Models\CatalogoTramite;
use App\Models\Direccion;
use App\Models\EstadoRevision;
use App\Models\GiroComercialNegocio;
use App\Models\Negocio;
use App\Models\NegocioImport;
use App\Models\Revision;
use App\Models\Subtramite;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class NegocioCargaMasivaController extends Controller
{
    public $negocios = null;

    public function __construct()
    {
        $this->negocios = new Negocio();
    }

    public function store(Request $request)
    {
        //datos fijos o de control

        $persona_id = 2054;
        $persona_moral_id = 939;
        $catalogo_tramite_id = 3;
        $__tramite_id = 3;
        $array = Excel::toArray(new NegocioImport(), storage_path('ejemploLayout.xlsx'))[0];
        \DB::beginTransaction();
        foreach ($array as $row) {
            try {
                if ($row[0] == 'calle_principal') {
                    continue;
                } //dejaron los headers, skipear;

                \Log::debug('Ingresando el negocio: '.$row[12]);
                $calle_principal = $row[0];
                $calle_principal = $row[1];
                $calles = $row[2];
                $numero_externo = $row[3];
                $numero_interno = $row[4];
                $colonia_id = $row[5];
                $codigo_postal = $row[6];
                $latitud = $row[7];
                $longitude = $row[8];
                $tipo_de_negocio_id = $row[9];
                $persona_id = $row[10];
                $persona_moral_id = $row[11];
                $nombre_del_negocio = $row[12];
                $categoria_id = $row[13];
                $catalogo_tramite_id = $row[14];
                $status = $row[15];
                $servicio_priv_recoleccion = $row[16];
                $impacto_giro_comercial = $row[17];
                $numero_licencia_funcionamiento_previa = $row[18];
                $tarifa_recoleccion_id = $row[19];
                $tipo_anuncio = $row[20];
                $leyenda_anuncio = $row[21];
                $lugar_instalacion = $row[22];
                $sector = $row[23];
                $superficie_m2 = $row[24];
                $cajones_estacionamiento = $row[25];
                $nivel_recoleccion_basura = $row[26];
                $fecha_inicio_operaciones = $row[27];
                $largo_anuncio = $row[28];
                $ancho_anuncio = $row[29];
                $inversion = $row[30];
                $no_empleados_h = $row[31];
                $no_empleados_m = $row[32];
                $empleados_cap_diferentes = $row[33];
                $telefono = $row[34];
                $horarios = $row[35];
                $clave_catastral = $row[36];
                $tipo_predio = $row[37];
                $comprobante_domicilio = $row[38];
                $venta_alcohol = $row[39];
                $descripcion_actividad = $row[40];
                $documento_predio_propiedad = $row[41];
                $tipo_predio_propiedad = $row[42];
                $tipo = $row[43];
                $comprobante_domicilio = $row[44];
                $foto_frontal_fachada = $row[45];

                $direccion = Direccion::create([
                    'calle_principal' => $calle_principal,
                    'calles' => $calles,
                    'numero_externo' => $numero_externo,
                    'numero_interno' => $numero_interno,
                    'colonia_id' => $colonia_id != null ? $colonia_id : -1,
                    'codigo_postal' => $codigo_postal,
                    'latitud' => $latitud,
                    'longitude' => $longitude,
                    'tipo' => $tipo,
                ]);
                \Log::debug('Direción Creada: '.$calle_principal);
                $negocio = Negocio::create([
                    'direccion_id' => $direccion['id'],
                    'tipo_de_negocio_id' => 1,
                    'persona_id' => $persona_id,
                    'persona_moral_id' => $persona_moral_id,
                    'nombre_del_negocio' => $nombre_del_negocio,
                    'categoria_id' => 1,
                    'catalogo_tramite_id' => $catalogo_tramite_id,
                    'status' => 'ENVIADO',
                    'servicio_priv_recoleccion' => $servicio_priv_recoleccion,
                    'impacto_giro_comercial' => $impacto_giro_comercial,
                    'numero_licencia_funcionamiento_previa' => $numero_licencia_funcionamiento_previa,
                    //'giro_comercial_id' => 1,
                    'tarifa_recoleccion_id' => $tarifa_recoleccion_id,
                    'tipo_anuncio' => $tipo_anuncio,
                    'leyenda_anuncio' => $leyenda_anuncio,
                    'lugar_instalacion' => $lugar_instalacion,
                    'sector' => $sector,
                    'superficie_m2' => $superficie_m2,
                    'cajones_estacionamiento' => $cajones_estacionamiento,
                    'nivel_recoleccion_basura' => $nivel_recoleccion_basura,
                    //'foto_frontal_fachada' => $foto_frontal_fachada,
                    'fecha_inicio_operaciones' => $fecha_inicio_operaciones,
                    'largo_anuncio' => $largo_anuncio,
                    'ancho_anuncio' => $ancho_anuncio,
                    'inversion' => $inversion,
                    'no_empleados_h' => $no_empleados_h,
                    'no_empleados_m' => $no_empleados_m,
                    'empleados_cap_diferentes' => $empleados_cap_diferentes,
                    'telefono' => $telefono,
                    'horarios' => '[]',
                    'clave_catastral' => $clave_catastral,
                    'tipo_predio' => $tipo_predio,

                    // added 7 feb 23
                    //'comprobante_domicilio' => $comprobante_domicilio_negocio,
                    'venta_alcohol' => $venta_alcohol,
                    'descripcion_actividad' => $descripcion_actividad,
                    // added 2 mar 23
                    //'documento_predio_propiedad' => $documento_predio_propiedad,
                    //'tipo_predio_propiedad' => $tipo_predio_propiedad,
                    // added 28 mar 23
                    'tipo' => $tipo,
                ]);

                \Log::debug('Negocio Creado: '.$nombre_del_negocio);

                $tramite = $negocio->tramite_padre()->create([
                    'catalogo_tramites_id' => $__tramite_id,
                    'tramite_padre_id' => null,
                ]);
                \Log::debug('Tramite  Creado: '.$tramite->id);
                $negocio->catalogo_tramite_id = $__tramite_id;
                $negocio->save();

                $negocio_id = $negocio['id'];
                \Log::debug('Tramite Comercio  Creado: '.$tramiteComercio->id);
                $subtramites = Subtramite::where('orden', 1)->where('catalogo_tramite_padre_id', $__tramite_id)->get();
                //$subtramites = Subtramite::where('orden', 1)->where('catalogo_tramite_padre_id', $catalogo_tramite_id)->get();
                foreach ($subtramites as $subtramite) {
                    $tramite_de_subtramite = $negocio->tramites()->create([
                        'catalogo_tramites_id' => $subtramite['catalogo_tramite_hijo_id'],
                        'tramite_padre_id' => $tramite->id,
                    ]);

                    \Log::debug('Subtramite  Creado: '.$tramite_de_subtramite->id);
                    $catalogo_tramite = CatalogoTramite::find($subtramite['catalogo_tramite_hijo_id']);

                    $revision = Revision::create([
                        'entidad_revision_id' => $catalogo_tramite['entidad_revisora_id'],
                        'status' => 'ENVIADO',
                        'negocio_id' => $negocio_id,
                        'tramite_id' => $tramite_de_subtramite['id'],
                    ]);
                    \Log::debug('Revisión  Creada: '.$revision->id);
                    EstadoRevision::create([
                        'revision_id' => $revision['id'],
                        'status' => 'ENVIADO',
                        'usuario_id' => $persona_id,
                        'observaciones' => 'Revision iniciada',
                    ]);
                    \Log::debug('Guardando Giros del negocio: '.$nombre_del_negocio);
                    $this::saveNegocioGiroscomerciales($venta_alcohol, $negocio->id);
                    \Log::debug('Termino de Guardar: '.$nombre_del_negocio);
                }
            } catch (\Exception $e) {
                \DB::rollback();
                \Log::debug('Marco Error en: '.$e);
                throw $e;
            }
        }
        \DB::commit();
    }

    public function saveNegocioGiroscomerciales($venta_alcohol, $negocio_id)
    {

        GiroComercialNegocio::create([
            'giro_comercial_id' => 562,
            'negocio_id' => $negocio_id,
        ]);
        if ($venta_alcohol === true) {
            GiroComercialNegocio::create([
                'giro_comercial_id' => 559,
                'negocio_id' => $negocio_id,
            ]);
        }
    }
}
