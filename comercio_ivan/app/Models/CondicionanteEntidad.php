<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CondicionanteEntidad extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'condicionante_entidad';

    protected $fillable = [
        'entidad_revisora_id',
        'condicionante_id',
    ];
}
