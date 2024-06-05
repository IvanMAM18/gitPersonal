<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use App\Models\Tramite;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class EntidadRevisionNegociosController extends Controller
{
    public function index(Request $request)
    {
        $year = $request['year'] ?? now('Y');
        $esProSare = $request['es_pro_sare'] ?? false;

        // Filtro por estatus
        $estatus = [];
        if ($request->has('estatus')) {
            $estatus = $request->input('estatus');
        }

        $estadoAvisoEntero = null;
        if ($request->has('aviso_entero_status')) {
            $estadoAvisoEntero = $request->input('aviso_entero_status');
        }

        // Filtro por nombre del negocio
        $nombreDelNegocio = '';
        if ($request->has('nombre_del_negocio') && $request->input('nombre_del_negocio')) {
            $nombreDelNegocio = $request->input('nombre_del_negocio');
        }

        // Filtro por nombre tamano de la empresa
        $tamanoEmpresa = -1;
        if ($request->has('tamano_empresa') && $request->input('tamano_empresa')) {
            $tamanoEmpresa = $request->input('tamano_empresa');
            if($tamanoEmpresa == -1) {
                $tamanoEmpresa = null;
            }
        }

        // Filtro por tramite ID
        $tramiteId = null;
        if ($request->has('tramite_id') && $request->input('tramite_id') != null) {
            $tramiteId = $request->input('tramite_id');
        }

        $nivelRecoleccionDeBasura = [];
        if($request->has('nivel_recoleccion_basura')) {
            $nivelRecoleccionDeBasura = $request->input('nivel_recoleccion_basura');
        }

        // Entidad Revisora
        $entidadRevisionId = currentUser()->entidad_revision->id;
        if ($entidadRevisionId == 5) {
            $entidadRevisionId = 6;
        }

        return Tramite::hijos()
            ->with([
                'catalogo_tramite:id,nombre,pago,entidad_revisora_id',
                'aviso_entero:id,aviso_entero.tramite_id,estado',
                'revisiones' => function($query) use($entidadRevisionId, $estatus){
                    $query
                        ->where('entidad_revision_id', $entidadRevisionId)
                        ->with([
                            'negocio_requisitos_revision:id,status,revision_id'
                        ]);
                },
                'tramitable' => function($query){
                    $query->select('id','nombre_del_negocio','persona_id','persona_moral_id', 'tamano_empresa', 'venta_alcohol', 'nivel_recoleccion_basura', 'created_at')
                        ->with([
                            'giro_comercial:giro_comercial.id,nombre',
                            'licenciaAlcohol.licencia:id,clave'
                        ]);
                },
            ])
            ->whereHasMorph('tramitable', [Negocio::class], function ($query) use ($nombreDelNegocio, $esProSare, $tamanoEmpresa, $nivelRecoleccionDeBasura) {
                $query->validado()
                    ->when($tamanoEmpresa != -1, fn($query) => $query->where('tamano_empresa', $tamanoEmpresa))
                    ->when($esProSare, fn($query) => $query->esBajoImpacto(), fn($query) => $query->esMedianoAltoImpacto())
                    ->where('nombre_del_negocio', 'ilike', '%' . $nombreDelNegocio . '%')
                    ->when($nivelRecoleccionDeBasura, fn($query) => $query->whereIn('nivel_recoleccion_basura', $nivelRecoleccionDeBasura));
            })
            ->whereHas('tramite_padre', fn($query) => $query->whereYear('created_at', $year))
            ->when($tramiteId, function ($query) use($tramiteId) {
                $query->where('tramite_padre_id', $tramiteId);
            })
            // $tieneFiltroAvisoEntero es True cuando se selecciono alguno de los valores: PAGADO, EXPIRADO, VIGENTE
            ->whereHas('catalogo_tramite', function (Builder $query) use ($entidadRevisionId, $estadoAvisoEntero) {

                $query->where('entidad_revisora_id', $entidadRevisionId);

                if($estadoAvisoEntero == 'N/A') {
                    $query->where('pago', false);
                }

                if(in_array($estadoAvisoEntero, ['PENDIENTE', 'VIGENTE', 'PAGADO', 'EXPIRADO'])) {
                    $query->where('pago', true);
                }

            })
            ->when($estadoAvisoEntero, function ($query) use($estadoAvisoEntero){

                if($estadoAvisoEntero == 'PENDIENTE') {
                    $query->whereDoesntHave('aviso_entero');
                }

                if(in_array($estadoAvisoEntero, ['VIGENTE', 'PAGADO', 'EXPIRADO'])) {
                    $query->whereRelation('aviso_entero', 'estado', $estadoAvisoEntero);
                }

            })
            ->when(count($estatus), function($query) use($estatus){
                $query->whereHas('revisiones', function($query) use($estatus){
                    $query->whereIn('status', $estatus);
                });
            })
            ->whereYear('created_at', $year)
            ->orderBy('id')
            ->paginate( perPage: $request->input('per_page'))
            ->through(function($tramite){
                // Quitar appends del negocio.
                $tramite->tramitable->setAppends([]);
                return $tramite;
            });
    }
}
