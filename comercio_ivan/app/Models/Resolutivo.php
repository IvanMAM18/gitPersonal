<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resolutivo extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'resolutivos';

    protected $fillable = [
        'fecha_expedicion',
        'fecha_expiracion',
        'tipo_de_registro',
        'servidor_publico',
        'detalles',
        'observaciones',
        'negocio_id',
        'entidad_revisora_id',
        'folio',
        'tramite_id',
    ];

    public function entidad_revision()
    {
        return $this->belongsTo(EntidadRevision::class, 'entidad_revisora_id');
        // return $this->belongsTo(Inciso::class, 'inciso', 'inciso');
    }

    public function tramite()
    {
        return $this->belongsTo(Tramite::class, 'tramite_id');
        // return $this->belongsTo(Inciso::class, 'inciso', 'inciso');
    }

    public function negocio()
    {
        return $this->belongsTo(Negocio::class, 'negocio_id');
        // return $this->belongsTo(Inciso::class, 'inciso', 'inciso');
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

    public function scopeConTramite($query, $year = null)
    {
        $query->with('tramite')
            ->when($year, function ($query) use ($year) {
                $query->whereHas('tramite', function ($q) use ($year) {
                    $q->whereYear('created_at', $year);
                });
            });
    }
}
