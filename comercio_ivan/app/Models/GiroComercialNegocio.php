<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GiroComercialNegocio extends Model
{
    use HasFactory;
    use Softdeletes;

    protected $table = 'giro_comercial_negocio';

    protected $fillable = [
        'giro_comercial_id',
        'negocio_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
