<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LicenciaAlcohol extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    protected $table = 'licencia_alcoholes';

    protected $fillable = [
        'clave',
        'tipo',
        'tipo_abreviado',
        'movimientos',
        'vigente',
        'trabajador_id',
        'folio',
    ];

    public function trabajador()
    {
        return $this->belongsTo(User::class, 'trabajador_id');
    }
}
