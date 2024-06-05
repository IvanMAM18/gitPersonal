<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Requisito extends Model
{
    use HasFactory;
    use SoftDeletes;

    public static $APROBADO = 'APROBADO';

    protected $table = 'requisitos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'codigo',
        'expediente',
        'expediente_requerido',
        'caduca',
        'tipo',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public static function storeRequisito(Request $request)
    {
        try {
            \DB::beginTransaction();
            $nombre = $request->input('nombre');
            $codigo = strtolower(preg_replace('/\s+/', '-', $nombre));
            $requisito = Requisito::create([
                'nombre' => $request->input('nombre'),
                'descripcion' => $request->input('descripcion'),
                'codigo' => $codigo,
                'expediente' => $request->input('expediente') ? 1 : 0,
                'expediente_requerido' => $request->input('expediente_requerido') ? 1 : 0,
                'caduca' => $request->input('caduca'),
                'tipo' => $request->input('tipo'),
            ]);

            $requisito_entidad = Requisito::storeEntidadesRevisoras($request->entidades_revisoras, $requisito->id);

            \DB::commit();

            return [
                'requisito' => $requisito,
                'requisito_entidad' => $requisito_entidad,
            ];
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }
    }

    private static function storeEntidadesRevisoras($entidades_ids, $catalogo_requisito_id)
    {
        for ($i = 0; $i < count($entidades_ids); $i++) {
            RequisitoEntidad::create([
                'entidad_revisora_id' => $entidades_ids[$i],
                'catalogo_requisito_id' => $catalogo_requisito_id,
            ]);
        }
    }

    public static function updateRequisito(Request $request)
    {
        try {
            \DB::beginTransaction();
            $requisito = Requisito::where('id', $request->id)->first();
            if ($requisito !== null) {
                $requisito->nombre = $request->nombre;
                $requisito->descripcion = $request->descripcion;
                $requisito->tipo = $request->tipo;
                $requisito->save();
            }

            $requisito_entidades = RequisitoEntidad::where('catalogo_requisito_id', $requisito->id)->get();

            for ($i = 0; $i < count($requisito_entidades); $i++) {
                $requisito_entidades[$i]->delete();
            }

            $requisito_entidad = Requisito::storeEntidadesRevisoras($request->entidades_revisoras, $requisito->id);

            \DB::commit();

            return [
                'requisito' => $requisito,
                'requisito_entidad' => $requisito_entidad,
            ];
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }
    }

    public function entidades_revisoras()
    {
        //return $this->belongsTo('App\Models\GiroComercial');
        return $this->hasManyThrough(
            // required
            'App\Models\EntidadRevision', // the related model
            'App\Models\RequisitoEntidad', // the pivot model
            // optional
            'catalogo_requisito_id', // the current model id in the pivot
            'id', // the id of related model
            'id', // the id of current model
            'entidad_revisora_id' // the related model id in the pivot
        );
    }

    public function archivo()
    {
        return $this->belongsTo('App\Models\UsuarioRequisito', 'id', 'requisito_id');
    }

    public function negocio_archivo()
    {
        return $this->belongsTo('App\Models\RequisitoNegocio', 'id', 'requisito_id');
    }

    public function catalogo_requisito()
    {
        return $this->belongsTo('App\Models\CatalogoRequisito');
    }

    public function persona_requisito()
    {
        return $this->belongsTo('App\Models\PersonaRequisito', 'id', 'requisito_id');
    }

    public function scopeAprobado($query)
    {
        return $query->where('status', self::$APROBADO);
    }
}
