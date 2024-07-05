<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ValidarProgramaInterno extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'validar_programa_interno';  

    protected $fillable = [
        'negocio_id',
        'observacion',
        'anio',
        'trabajador_id',
        'validar_programa_interno'
    ];

    public function negocio()
    {
        return $this->belongsTo(Negocio::class);
    }

    public function trabajador()
    {
        return $this->belongsTo(User::class, 'trabajador_id');
    }
}

