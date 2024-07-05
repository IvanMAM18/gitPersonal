<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class GiroComercial extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'giro_comercial';

    protected $appends = [
        'nombre_impacto'
    ];

    protected $fillable = [
        'nombre',
        'clave_scian',
        'descripcion',
        'catalogo_giro_comercial_id',
        'tipo',
        'servicio_publico_id',
        'tipo_sector',
        'cobro_programa_interno',
        'certificado_medio_ambiente',
        'licencia_alcohol_giro_comercial',
    ];

    public function servicios_publicos()
    {
        return $this->hasOne(CatalogoGirosComercialesRecoleccionBasura::class, 'id', 'servicio_publico_id');
    }

    public function getNombreImpactoAttribute()
    {
        return Str::replace('_', ' ', $this->tipo);
    }

    /**
     * Filtro para giros comerciales.
     */
    public function scopeSearch($query, $filters)
    {
        $query->when($filters['impacto'] ?? null, fn($query) => $query->where('tipo', $filters['impacto']))
            ->when($filters['sector'] ?? null, fn($query) => $query->where('tipo_sector', $filters['sector']))
            ->when($filters['medio_ambiente'] ?? null, fn($query) => $query->where('certificado_medio_ambiente', $filters['medio_ambiente']))
            ->when($filters['programa_interno'] ?? null, fn($query) => $query->where('cobro_programa_interno', $filters['programa_interno']))
            ->when($filters['vende_alcohol'] ?? null, fn($query) => $query->where('licencia_alcohol_giro_comercial', $filters['vende_alcohol']))
            ->when($filters['clave_scian'] ?? null, fn($query) => $query->where('clave_scian', 'ILIKE', '%' . $filters['clave_scian'] . '%'))
            ->when($filters['descripcion'] ?? null, fn($query) => $query->where('descripcion', 'ILIKE', '%' . $filters['descripcion'] . '%'))
            ->when($filters['nombre'] ?? null, fn($query) => $query->where('nombre', 'ILIKE', '%' . $filters['nombre'] . '%'));
    }
}

