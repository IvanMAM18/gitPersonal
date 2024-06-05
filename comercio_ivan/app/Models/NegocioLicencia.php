<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NegocioLicencia extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    protected $table = 'negocios_licencias';

    protected $visible = ['negocioOperador', 'negocioPropietario', 'licencia', 'id', 'created_at', 'propietario'];

    protected $fillable = [
        'negocio_propietario_id',
        'negocio_operador_id',
        'licencia_id',
        'trabajador_id',
        'trabajador_id_baja',
    ];

    public function trabajador()
    {
        return $this->belongsTo(User::class, 'trabajador_id');
    }

    public function licencia()
    {
        return $this->belongsTo(LicenciaAlcohol::class, 'licencia_id');
    }

    public function negocioOperador()
    {
        return $this->belongsTo(Negocio::class, 'negocio_operador_id');
    }

    public function trabajadorBaja()
    {
        return $this->belongsTo(User::class, 'trabajador_id');
    }

    public function propietario()
    {
        return $this->morphTo();
    }

    public function negocioPropietario()
    {
        if ($this->propietario == null) {
            return $this->belongsTo(Negocio::class, 'negocio_propietario_id');
        } else {
            return $this->propietario;
        }
    }
}
