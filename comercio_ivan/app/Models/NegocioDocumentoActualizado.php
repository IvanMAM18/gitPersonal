<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NegocioDocumentoActualizado extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'negocio_id', 'docto', 'ruta', 'tramite_id', 'año_refrendo',
    ];
}
