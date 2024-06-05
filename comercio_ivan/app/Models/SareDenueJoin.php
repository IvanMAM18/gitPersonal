<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SareDenueJoin extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'sare_denue_join';

    protected $fillable = [
        'FOLIO',
        'NOMBRE',
        'APELLIDO1',
        'APELLIDO2',
        'ESTABLECIMIENTO',
        'DIRECCION',
        'ENTRE',
        'YENTRE',
        'ENCONTRADOS',
        'SARE_FOLIO',
        'LICENCIA_2022',
        'LATITUDE',
        'LONGITUDE',
    ];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
}
