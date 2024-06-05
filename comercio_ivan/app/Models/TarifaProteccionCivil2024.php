<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TarifaProteccionCivil2024 extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tarifa_proteccion_civil2024';

    protected $fillable = [
        'sector',
        'tipo_tarifa',
        'concepto_detalle_id',
        'programa_interno',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function conceptoDetalle()
    {
        return $this->belongsTo(ConceptoDetalle::class);
    }
}
