<?php

namespace App\Http\Controllers;

use App\Models\GiroComercial;
use App\Models\GiroComercialNegocio;
use App\Models\Negocio;
use App\Models\TarifaRecoleccionBasura;
use App\Models\Tramite;
use Illuminate\Http\Request;

class GirosComercialesController extends Controller
{
    public function getGirosComercialesAPI()
    {
        return GiroComercial::orderBy('nombre', 'asc')->get();
    }
    public function getGirosComerciales()
    {
        return GiroComercial::orderBy('nombre', 'asc')->get();
    }

    public function getGirosNegocio($negocio_id)
    {
        $negocio = Negocio::select(['id'])
            ->where('id', $negocio_id)
            ->with('giro_comercial', function ($q) {
                $q->select(['giro_comercial.id', 'giro_comercial.nombre']);
            })
            ->first();

        return [
            'ok' => true,
            'giros_negocio' => $negocio->giro_comercial,
        ];
    }

    public function updateGirosNegocio(Request $request, $negocio_id)
    {
        $catalogo_tramites_equivalentes_alto_bajo = [
            'bajo' => [
                1 => 2,
                3 => 4,
                6 => 5,
                8 => 7,
                9 => 9,
                11 => 10,
            ],
            'alto' => [
                2 => 1,
                4 => 3,
                5 => 6,
                7 => 8,
                9 => 9,
                10 => 11,
            ],
        ];
        try {
            \DB::beginTransaction();
            /**
             * Obtenemos el negocio solo los campos necesarios, los
             * nuevos giros, y el impacto
             * actual para poder actualizarlo después
             */
            $negocio = Negocio::select(['id', 'tarifa_recoleccion_id', 'catalogo_tramite_id', 'venta_alcohol'])
                ->where('id', $negocio_id)
                ->with('giro_comercial', function ($q) {
                    $q->select(['giro_comercial.id', 'giro_comercial.nombre']);
                })
                ->first();
            $nuevos_giros = $request->all();
            $nuevo_negocio_impacto = 'bajo_impacto'; // 'bajo_impacto','mediano_alto_impacto'

            /**
             * Borramos los giros actuales del negocio
             * para luego crear los nuevos, aunque solo se agregue uno nuevo
             * mantener ese algoritmo sería complicado
             */
            GiroComercialNegocio::where('negocio_id', $negocio_id)->delete();
            $ventaAlcohol = false;
            foreach ($nuevos_giros as $nombre_giro) {
                /**
                 * Como los giros recibidos son los nombres de estos
                 * recuperamos tu tipo y su id, con el tipo detectamos si uno
                 * es de alto impacto, si lo es lo guardamos en el negocio más abajo.
                 *
                 * igualmente creamos los nuevos giros ya ligados al negocio
                 */
                $giro_comercial = GiroComercial::select(['id', 'tipo', 'nombre'])->where('nombre', $nombre_giro)->first();

                if ($giro_comercial->tipo === 'mediano_alto_impacto') {
                    $nuevo_negocio_impacto = 'mediano_alto_impacto';
                }
                $ventaAlcohol = $this->buscarGiroAlcohol($giro_comercial->nombre, $ventaAlcohol);
                GiroComercialNegocio::create([
                    'giro_comercial_id' => $giro_comercial->id,
                    'negocio_id' => $negocio_id,
                ]);
            }
            $negocio->venta_alcohol = $ventaAlcohol;
            $negocio->save();
            /**
             * Toca revisar la recolección, periodo y valor
             * para determinar si tendrá una nueva liga
             */
            $tarifa_actual = TarifaRecoleccionBasura::find($negocio->tarifa_recoleccion_id);

            $nueva_tarifa_recoleccion = $tarifa_actual;
            $valor_uma_actual = $tarifa_actual->valor_uma;

            /**
             * Volvemos a recuperar los giros comerciales debido
             * a que la lista en negocios está desactualizada
             */
            $giros_comerciales = $negocio->giro_comercial()->get();

            /**
             * Toca encontrar el giro con la UMA más grande
             */
            foreach ($giros_comerciales as $i => $value) {
                if (
                    $tarifa_actual->volumen != '' &&
                    $tarifa_actual->periodo != '' &&
                    $value->servicio_publico_id != 12 &&
                    $value->servicio_publico_id != 13 &&
                    $value->servicio_publico_id != 14
                ) {
                    $tarifa = TarifaRecoleccionBasura::select(['id', 'valor_uma'])
                        ->where('giro_comercial_id', $value->servicio_publico_id)
                        ->where('volumen', $tarifa_actual->volumen)
                        ->where('periodo', $tarifa_actual->periodo)
                        ->first();

                    if ($tarifa->valor_uma > $valor_uma_actual) {
                        $nueva_tarifa_recoleccion = $tarifa;
                        $valor_uma_actual = $tarifa->valor_uma;
                    }
                }
            }

            $negocio->tarifa_recoleccion_id = $nueva_tarifa_recoleccion->id;
            $negocio->impacto_giro_comercial = $nuevo_negocio_impacto;
            $negocio->save();

            /**
             * ACTUALIZACIÓN DE TRÁMITES
             */
            $negocio_id = $negocio->id;

            $tramite_comercio = $negocio->tramitePadre();

            // generando actualizados
            $__tramite_id = $negocio->catalogo_tramite_id;

            if ($negocio->catalogo_tramite_id == 1 || $negocio->catalogo_tramite_id == 2) {
                if ($nuevo_negocio_impacto == 'bajo_impacto') {
                    $__tramite_id = 2;
                } else {
                    $__tramite_id = 1;
                }
            }
            if ($negocio->catalogo_tramite_id == 3 || $negocio->catalogo_tramite_id == 4) {
                if ($nuevo_negocio_impacto == 'bajo_impacto') {
                    $__tramite_id = 4;
                } else {
                    $__tramite_id = 3;
                }
            }

            $negocio->catalogo_tramite_id = $__tramite_id;
            $negocio->save();

            /**
             * Buscar tramite comercio y actualizar el
             * tramite para enviar borrar
             */
            /*
                        $tramites = Tramite::select(['id', 'catalogo_tramites_id', 'tramite_padre_id'])
                            ->where('tramite_padre_id', $tramite_comercio->id)
                            ->orWhere('id', $tramite_comercio->tramite_id)
                            ->get();
                        */
            //Se actualiza función de los giros para considerar el tramite padre cuando éste cambia de impacto
            $results = \DB::select('SELECT tc.negocio_id, t.id AS tramite_id,   t.tramite_padre_id, ct.descripcion , r.id as revision_id, r.status, ct.id as catalogo_tramite_id FROM  tramites t
                join tramites_comercio tc on tc.tramite_id =t.id
                join catalogo_tramites ct on ct.id =t.catalogo_tramites_id
                left join revision r on t.id = r.tramite_id
                WHERE tc.negocio_id = ? and tc.deleted_at is null and t.deleted_at is null order by ct.id;', [$negocio_id]);

            $impacto = ($nuevo_negocio_impacto == 'bajo_impacto') ? 'bajo' : 'alto';
            $catalogo_seleccionado = $catalogo_tramites_equivalentes_alto_bajo[$impacto];

            foreach ($results as $key => $result) {
                $trm = Tramite::find($result->tramite_id);

                // Revision::where('id', $result->rid)->update(['tramite_id', $trm->id]);
                if ($trm->tramite_padre_id != null) {
                    $trm->tramite_padre_id = $tramite_comercio->tramite_id;
                }
                if (isset($catalogo_seleccionado[$trm->catalogo_tramites_id])) {
                    $trm->catalogo_tramites_id = $catalogo_seleccionado[$trm->catalogo_tramites_id];
                }
                if ($trm->catalogo_tramites_id == 5 || $trm->catalogo_tramites_id == 6) {
                    if ($trm->tramite_padre->catalogo_tramite->id == 3) {
                        $trm->catalogo_tramites_id = 5;
                    }
                }
                $trm->save();

                if ($trm->catalogo_tramites_id == 11) {
                    $revision = Revision::find($result->revision_id);
                    if ($revision->status == 'VISOR') {
                        $revision->status = 'ENVIADO';
                    }
                    $revision->save();
                }
            }
            /*
            foreach ($tramites as $tramite) {
                if (isset($catalogo_seleccionado[$tramite->catalogo_tramites_id])) {
                    $tramite->catalogo_tramites_id = $catalogo_seleccionado[$tramite->catalogo_tramites_id];
                    $tramite->save();
                }
            }
            */
            \DB::commit();

            return [
                'ok' => true,
                'nueva_tarifa_recoleccion' => $nueva_tarifa_recoleccion,
                'valor_uma_actual' => $valor_uma_actual,
                'negocio' => $negocio,
                'giros_comerciales' => $giros_comerciales,
            ];
        } catch (\Throwable $th) {
            \DB::rollback();

            return [
                'ok' => false,
                'error' => 'ERROR',
            ];
        }
    }

    public function buscarGiroAlcohol($giro, $venta_alcohol)
    {
        $actividades = [
            'Comercio al por menor en tiendas de abarrotes, ultramarinos y misceláneas',
            'Comercio al por mayor de abarrotes',
            'Comercio al por mayor de vinos y licores',
            'Comercio al por mayor de cerveza',
            'Comercio al por menor de vinos y licores',
            'Comercio al por menor de cerveza',
            'Centros nocturnos, discotecas y similares',
            'Bares, cantinas y similares',
            'Elaboración de cerveza',
            'Elaboración de bebidas alcohólicas a base de uva',
            'Elaboración de pulque',
            'Elaboración de sidra y otras bebidas fermentadas',
            'Elaboración de ron y otras bebidas destiladas de caña',
            'Elaboración de bebidas destiladas de agave',
            'Casinos',
            'Hoteles con casino',
        ];

        if (in_array($giro, $actividades)) {
            return true;
        } else {
            return $venta_alcohol;
        }
    }
}
