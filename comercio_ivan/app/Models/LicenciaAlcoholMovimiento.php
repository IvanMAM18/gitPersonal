<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LicenciaAlcoholMovimiento extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    protected $table = 'licencia_alcoholes_movimientos';

    protected $fillable = [
        'licencia_alcoholes_anterior_id',
        'licencia_alcoholes_nueva_id',
        'acta_de_sesion',
        'observacion',
        'trabajador_id',
    ];

    public function trabajador()
    {
        return $this->belongsTo(User::class, 'trabajador_id');
    }

    public function licenciaAnterior()
    {
        return $this->belongsTo(LicenciaAlcohol::class, 'licencia_alcoholes_anterior_id');
    }

    public function licenciaNueva()
    {
        return $this->belongsTo(LicenciaAlcohol::class, 'licencia_alcoholes_nueva_id');
    }
}
