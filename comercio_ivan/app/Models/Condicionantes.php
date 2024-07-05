<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Condicionantes extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function catalogoDeTramites()
    {
        return $this->belongsToMany(CatalogoTramite::class);
    }

    public static function storeCondicionante(Request $request)
    {
        try {
            \DB::beginTransaction();
            $condicionante = Condicionantes::create($request->all());

            $condicionante_entidad = Condicionantes::storeEntidadesRevisoras($request->entidades_revisoras, $condicionante->id);

            \DB::commit();

            return [
                'condicionante' => $condicionante,
                'condicionante_entidad' => $condicionante_entidad,
            ];
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }
    }

    private static function storeEntidadesRevisoras($entidades_ids, $condicionante_id)
    {
        for ($i = 0; $i < count($entidades_ids); $i++) {
            CondicionanteEntidad::create([
                'entidad_revisora_id' => $entidades_ids[$i],
                'condicionante_id' => $condicionante_id,
            ]);
        }
    }

    public static function updateCondicionante(Request $request)
    {
        try {
            \DB::beginTransaction();
            $condicionante = Condicionantes::where('id', $request->id)->first();
            if ($condicionante !== null) {
                $condicionante->nombre = $request->nombre;
                $condicionante->descripcion = $request->descripcion;
                $condicionante->save();
            }

            $condicionante_entidades = CondicionanteEntidad::where('condicionante_id', $condicionante->id)->get();

            for ($i = 0; $i < count($condicionante_entidades); $i++) {
                $condicionante_entidades[$i]->delete();
            }

            $condicionante_entidad = Condicionantes::storeEntidadesRevisoras($request->entidades_revisoras, $condicionante->id);

            \DB::commit();

            return [
                'condicionante' => $condicionante,
                'condicionante_entidad' => $condicionante_entidad,
            ];
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }
    }

    public function entidadesRevisoras()
    {
        return $this->belongsToMany(EntidadRevision::class, 'condicionante_entidad', 'condicionante_id', 'entidad_revisora_id');
    }

    public function entidades_revisoras()
    {
        //return $this->belongsTo('App\Models\GiroComercial');
        return $this->hasManyThrough(
            // required
            'App\Models\EntidadRevision', // the related model
            'App\Models\CondicionanteEntidad', // the pivot model
            // optional
            'condicionante_id', // the current model id in the pivot
            'id', // the id of related model
            'id', // the id of current model
            'entidad_revisora_id' // the related model id in the pivot
        );
    }

    // public function condicionantes_revisions() {
    //     return $this->belongsTo(CondicionantesRevision::class, 'id' ,'condicionante_id');
    // }

}
