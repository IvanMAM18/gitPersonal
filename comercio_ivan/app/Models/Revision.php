<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Revision extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'revision';

    protected $fillable = [
        'entidad_revision_id',
        'status',
        'negocio_id',
        'tramite_id',
        'hora',
        'fecha',
    ];

    /**
     * Regresa el negocio relacionado con la revision.
     */
    public function negocio()
    {
        return $this->belongsTo(Negocio::class);
    }

    public function estados_revision()
    {
        return $this->hasMany(EstadoRevision::class, 'revision_id');
    }

    public function condicionantesRevision()
    {
        return $this->hasMany(CondicionantesRevision::class);
    }

    // la puse en ingles porque la de abajo esta mal escrita. atte: Frank.
    // y no voy a arreglarlo en este momento
    public function requirements()
    {
        return $this->belongsToMany(Requisito::class, 'requisito_revision', 'revision_id', 'requisito_id')
            ->withPivot(['valor', 'status', 'estado_revision_id']);
    }

    public function requisitos()
    {
        return $this->hasMany(RequisitoRevision::class, 'revision_id');
    }
    public function requisito_revision()
    {
        return $this->hasMany(RequisitoRevision::class, 'revision_id', 'id');
    }

    public function negocio_requisitos_revision()
    {
        return $this->hasMany(NegocioRequisitoRevision::class, 'revision_id');
    }

    public function entidad()
    {
        return $this->belongsTo(EntidadRevision::class, 'entidad_revision_id', 'id');
    }

    // ESTA RELACION ESTA MAL
    public function tramites()
    {
        return $this->hasMany(Tramite::class, 'id', 'tramite_id');
    }
    public function tramite()
    {
        return $this->hasOne(Tramite::class, 'id', 'tramite_id');
    }

    public function scopeEnRevision($query)
    {
        return $query->whereIn('status', ['ENVIADO', 'EN REVISION']);
    }

    public function getEnRevisionAttribute()
    {
        return in_array($this->status, ['ENVIADO', 'EN REVISION']);
    }

    public function getHoraAttribute()
    {
        return $this == null || $this->updated_at == null
        ? null
        : $this->updated_at->timezone('America/Mazatlan')->format('H:i');
    }

    public function getFechaAttribute()
    {
        return $this == null || $this->updated_at == null
        ? null
        : $this->updated_at->timezone('America/Mazatlan')->format('d-m-Y');
    }

    public function getHoraCreacionAttribute()
    {
        return $this == null || $this->created_at == null
        ? null
        : $this->created_at->timezone('America/Mazatlan')->format('H:i');
    }

    public function getFechaCreacionAttribute()
    {
        return $this == null || $this->created_at == null
        ? null
        : $this->created_at->timezone('America/Mazatlan')->format('d-m-Y');
    }

    /**
     * Filtra revisiones que pertenecen a un tramite de Negocio, ademas acepta el año para filtrar por año.
     */
    public function scopeDeNegocio($query, $year = null)
    {
        $query->whereHas('tramite', function ($tramite) use ($year) {
            $tramite->whereHasMorph('tramitable', [Negocio::class])
                ->when($year, fn ($query) => $query->whereYear('created_at', $year));
        });
    }
}
