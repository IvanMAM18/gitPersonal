<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CondicionantesNegocios extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'negocio_id',
        'condicionante_id',
    ];
}
