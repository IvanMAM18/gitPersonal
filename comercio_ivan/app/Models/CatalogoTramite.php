<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoTramite extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'nombre',
        'entidad_revisora_id',
        'descripcion',
        'link',
        'departamento_id',
        'pago',
        'resolutivo',
        'en_linea',
        'tipo',
        'tipo_tramite',
    ];

    public function condicionantes()
    {
        return $this->belongsToMany(Condicionantes::class, 'catalogo_tramite_condicionantes', 'catalogo_tramite_id', 'condicionante_id')
            ->withTimestamps();
    }

    public function requisitos()
    {
        return $this->belongsToMany(Requisito::class, 'catalogo_tramites_requisitos', 'catalogo_tramites_id', 'requisito_id')
            ->withTimestamps();
    }

    public function entidad_revisora()
    {
        return $this->hasMany(EntidadRevision::class, 'id', 'entidad_revisora_id');
    }

    public function scopeParaNegocios($query)
    {
        $query->where('tipo_tramite', 'NEGOCIO');
    }

    public function scopeParaPersonas($query)
    {
        $query->where('tipo_tramite', 'PERSONA');
    }

    public function esTipoPersona()
    {
        return $this->typo == 'PERSONA';
    }

    public function esTipoNegocio()
    {
        return $this->typo == 'NEGOCIO';
    }

    /**
     * Filtra todos los catalogos que son de alcoholes.
     */
    public function scopeDeAlcoholes($query)
    {
        $query->whereIn('id', [13, 14, 15, 16]);
    }
}
