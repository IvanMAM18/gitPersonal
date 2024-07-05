<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class Trabajador extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'trabajadores';

    protected $fillable = [
        'persona_id',
        'departamento_id',
        'entidad_revisora_id',
        'rol_id',
        'foto',
        'numero_trabajador',
        'nombre_usuario',
        'contrasena',
        'firma_path',
    ];

    protected $hidden = ['contrasena'];

    protected $appends = ['foto_url'];

    public static function storeTrabajador(Request $request)
    {
        return Trabajador::create($request->all());
    }

    public static function updateTrabajador(Request $request)
    {
        $trabajador = Trabajador::where('id', $request->id)->first();
        if ($trabajador !== null) {
            $trabajador->persona_id = $request->persona_id;
            $trabajador->departamento_id = $request->departamento_id;
            $trabajador->entidad_revisora_id = $request->entidad_revisora_id;
            $trabajador->rol_id = $request->rol_id;
            $trabajador->numero_trabajador = $request->numero_trabajador;
            $trabajador->nombre_usuario = $request->nombre_usuario;
            $trabajador->contrasena = $request->contrasena;
            $trabajador->firma_path = $request->firma_path;
            $trabajador->save();
        }

        return $trabajador;
    }

    protected function getFotoUrlAttribute()
    {
        return Storage::url($this->foto);
    }
}
