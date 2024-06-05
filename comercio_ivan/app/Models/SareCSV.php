<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SareCSV extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'sare_csv';

    protected $fillable = [
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
    ];
}
