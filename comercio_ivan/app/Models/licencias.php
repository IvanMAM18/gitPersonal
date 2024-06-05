<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class licencias extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'negocio_id',
        'año_de_funcionamiento',
        'fecha_expiracion',
        'tipo_de_licencia',
        'tipo_de_registro',
        'observaciones',
    ];
}
