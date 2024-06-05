<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DatosFacturacion extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'datos_facturacion';

    protected $fillable = [
        'persona_id',
        'persona_moral_id',
        'direccion_id',
        'regimen_fiscal',
        //"regimen_capital"
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
