<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConceptoDetalleInciso extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'conceptos_detalles_incisos';

    protected $guarded = [];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function inciso()
    {
        return $this->belongsTo(Inciso::class, 'inciso', 'inciso');
    }

    public function inciso_instance()
    {
        return $this->belongsTo(Inciso::class, 'inciso', 'inciso');
    }

    public function descuentos()
    {
        return $this->inciso_instance->descuentos();
    }

    public function getOpcionesAttribute($value)
    {
        return $value ? json_decode($value) : $value;
    }
}
