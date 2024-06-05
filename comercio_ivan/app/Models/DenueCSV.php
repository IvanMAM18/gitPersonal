<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DenueCSV extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'denue_csv';

    protected $fillable = [
        'ENCONTRADOS',
        'SARE_FOLIO',
        'LICENCIA_2022',
        'CLAVEMUN',
        'FOLIO',
        'CUENTAS',
        'CURP',
        'RFC',
        'NOMBRE',
        'APELLIDO1',
        'APELLIDO2',
        'ESTABLECIMIENTO',
        'DIRECCION',
        'ENTRE',
        'YENTRE',
        'LATITUDE',
        'LONGITUDE',
    ];
}
