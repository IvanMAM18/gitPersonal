<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CodigoPostal extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'codigos_postales';

    protected $fillable = [
        'codigo_postal',
        'clave_colonia',
        'nombre_localidad',
        'tipo',
        'clave_estado',
        'clave_estado_inegi',
        'clave_municipio',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
