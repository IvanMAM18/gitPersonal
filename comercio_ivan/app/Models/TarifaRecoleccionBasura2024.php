<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TarifaRecoleccionBasura2024 extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tarifa_recoleccion_basura2024';

    protected $fillable = [
        'volumen',
        'sector',
        'tipo_tarifa',
        'valor',
        'valor_anual',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
