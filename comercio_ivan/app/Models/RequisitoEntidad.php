<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequisitoEntidad extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'requisitos_entidad';

    protected $fillable = [
        'entidad_revisora_id',
        'catalogo_requisito_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
