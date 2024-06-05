<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Persona extends Model
{
    use SoftDeletes;

    protected $table = 'persona';

    protected $fillable = [
        'nombres',
        'apellido_paterno',
        'apellido_materno',
        'curp',
        'rfc',
        'telefono',
        'correo',
        'sexo',
        'direccion_id',
        'direccion_de_notificacion_id',
    ];

    public function direccion_notificacion()
    {
        return $this->belongsTo('App\Models\Direccion', 'direccion_de_notificacion_id');
    }
}
