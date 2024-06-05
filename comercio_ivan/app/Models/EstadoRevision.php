<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EstadoRevision extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'estados_revision';

    protected $fillable = [
        'revision_id',
        'status',
        'usuario_id',
        'observaciones',
        'observaciones_backup',
        'hora',
        'fecha',
    ];

    public function estado()
    {
        /**
         * OBSOLETO
         */
        return $this->belongsTo('App\Models\Estado', 'estado_id');
    }

    public function requisitos()
    {
        return $this->hasMany('App\Models\RequisitoRevision');
    }

    public function negocio_requisitos()
    {
        return $this->hasMany('App\Models\NegocioRequisitoRevision', 'estado_revision_id');
    }

    public function revision()
    {
        return $this->belongsTo('App\Models\Revision');
    }

    public function revisor()
    {
        return $this->hasOne('App\Models\User', 'id', 'usuario_id');
    }

    public function getHoraAttribute()
    {
        return $this == null || $this->created_at == null
        ? null
        : $this->created_at->timezone('America/Mazatlan')->format('H:i');
    }

    public function getFechaAttribute()
    {
        return $this == null || $this->created_at == null
        ? null
        : $this->created_at->timezone('America/Mazatlan')->format('d-m-Y');
    }
}
