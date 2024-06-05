<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TarifaProgramaInterno2024 extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tarifa_programas_internos2024';

    protected $fillable = [
        'descripcion',
        'min_trabajadores',
        'valor',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
