<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Subtramite extends Model
{
    use HasFactory;
    use Softdeletes;

    protected $table = 'subtramites';

    protected $fillable = [
        'catalogo_tramite_padre_id',
        'catalogo_tramite_hijo_id',
        'orden',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function catalogo_tramite_hijo()
    {
        return $this->hasMany(CatalogoTramite::class, 'id', 'catalogo_tramite_hijo_id');
    }

    public function catalogo_tramite_hijo_unico()
    {
        return $this->hasOne(CatalogoTramite::class, 'id', 'catalogo_tramite_hijo_id');
    }

    public static function storeSubTramite(Request $request)
    {
        $subtramite = Subtramite::create($request->all());

        return $subtramite;
    }

    public static function updateSubTramite(Request $request)
    {
        $subtramite = Subtramite::where('id', $request->id)->first();
        if ($subtramite !== null) {
            $subtramite->catalogo_tramite_padre_id = $request->catalogo_tramite_padre_id;
            $subtramite->catalogo_tramite_hijo_id = $request->catalogo_tramite_hijo_id;
            $subtramite->orden = $request->orden !== null ? $request->orden : $subtramite->orden;
            $subtramite->save();
        }

        return $subtramite;
    }
}
