<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Concepto extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'conceptos';

    protected $guarded = [];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function detalles()
    {
        return $this->hasMany(ConceptoDetalle::class, 'concepto_id', 'id');
    }

    public function obtenerMesesTxt()
    {
        $meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
        ];
        $mesActual = \Carbon\Carbon::now()->month;

        return $mesActual != 12
            ? "DE {$meses[$mesActual - 1]} A {$meses[11]}"
            : "DE {$meses[11]}";
    }
}
