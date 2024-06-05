<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tramite extends Model
{
    use HasFactory;
    use SoftDeletes;

    // protected $table = 'tramites_comercio';

    protected $appends = [];

    protected $fillable = [
        'catalogo_tramites_id',
        'tramite_padre_id',
        'tramitable_id',
        'tramitable_type',
        'created_at', // remover despuepues del refactor
        'updated_at', // remover despuepues del refactor
        'deleted_at', // remover despuepues del refactor
    ];

    protected $hidden = ['deleted_at'];

    public function subtramites()
    {
        return $this->hasMany(Subtramite::class, 'catalogo_tramite_padre_id', 'tramite_padre_id');
    }

    // new version
    public function tramitesHijos()
    {
        return $this->hasMany(Tramite::class, 'tramite_padre_id', 'id')
            ->whereNotNull('tramite_padre_id');
    }

    // legacy version
    public function tramites_hijos()
    {
        return $this->hasMany(Tramite::class, 'tramite_padre_id', 'id');
    }

    /**
     * Relacion Polimorfica con Negocios, PersonaMoral, User.
     */
    public function tramitable()
    {
        return $this->morphTo('tramitable');
    }

    // new version
    public function catalogo()
    {
        return $this->hasOne(CatalogoTramite::class, 'id', 'catalogo_tramites_id');
    }

    public function catalogo_tramite()
    {
        return $this->hasOne(CatalogoTramite::class, 'id', 'catalogo_tramites_id');
    }

    // legacy
    public function catalogo_tramites()
    {
        return $this->hasMany(CatalogoTramite::class, 'id', 'catalogo_tramites_id');
    }

    public function revisions()
    {
        return $this->hasMany(Revision::class, 'tramite_id', 'id');
    }

    public function revisiones()
    {
        return $this->hasMany(Revision::class);
    }

    public function ultima_revision()
    {
        return $this->hasOne(Revision::class, 'tramite_id', 'id')->ofMany('id', 'max');
    }

    public function avisos_entero()
    {
        return $this->hasMany(AvisoEntero::class, 'tramite_id', 'id');
    }

    public function tramite_padre()
    {
        return $this->belongsTo(Tramite::class, 'tramite_padre_id', 'id');
    }

    public function resolutivo()
    {
        return $this->hasOne(Resolutivo::class, 'tramite_id', 'id')->ofMany('id', 'max');
    }

    public function aviso_entero()
    {
        return $this->hasOne(AvisoEntero::class, 'tramite_id', 'id')->ofMany('id', 'max');
    }

    /**
     * Devuelve tramites que sean padre.
     */
    public function scopePadres($query)
    {
        $query->whereNotNull('tramite_padre_id');
    }

    /**
     * Devuelve tramites que sean hijos
     */
    public function scopeHijos($query)
    {
        $query->whereNotNull('tramite_padre_id');
    }

    /**
     * Filtra todos los tramites que son de alcoholes.
     */
    public function scopeDeAlcoholes($query)
    {
        $query->whereHas('catalogo', fn ($q) => $q->deAlcoholes());
    }

    public function scopeTieneNegocio($query, $negocioId)
    {
        //        return $query->whereHas('tramite_comercio', function(Builder $query) use ($negocioId) {
        //            $query->where('negocio_id', $negocioId);
        //        });
        return $query->whereHasMorph(
            'tramitable',
            [Negocio::class],
            fn ($query) => $query->where('negocios.id', $negocioId)
        );
    }

    public function scopeTieneEntidadRevision($query, $entidadRevisionId)
    {
        return $query->whereHas('catalogo_tramites', function (Builder $query) use ($entidadRevisionId) {
            $query->where('entidad_revisora_id', $entidadRevisionId);
        });
    }

    public function scopeTieneNegocioConImpacto($query, $impacto)
    {
        //        return $query->whereHas('tramite_comercio', function ($tramiteComercio) use ($impacto) {
        //            $tramiteComercio->whereHas('negocio', function ($negocio) use ($impacto) {
        //                $negocio->where('impacto_giro_comercial', $impacto);
        //            });
        //        });
        return $query->whereHasMorph(
            'tramitable',
            [Negocio::class],
            fn ($query) => $query->where('impacto_giro_comercial', $impacto)
        );
    }

    public function scopeTieneNegocioValidado($query)
    {
        return $query->whereHasMorph(
            'tramitable',
            [Negocio::class],
            fn ($query) => $query->validado()->whereNull('deleted_at')
        )
            ->whereNull('deleted_at');
    }

    public function scopeHasNegocio($query)
    {
        return $query->whereHasMorph(
            'tramitable',
            [Negocio::class]
        );
    }

    public function scopeTieneCatalogoTramiteConNombre($query, $nombreCatalogoTramite)
    {
        return $query->whereHas('catalogo', function ($catalogoTramite) use ($nombreCatalogoTramite) {
            $catalogoTramite->where('nombre', $nombreCatalogoTramite);
        });
    }

    public function scopeTieneNegocioConNivelRecoleccion($query, $nivelRecoleccion)
    {
        return $query->whereHasMorph(
            'tramitable',
            [Negocio::class],
            fn ($query) => $query->where('nivel_recoleccion_basura', $nivelRecoleccion)
        );
    }

    public function scopeTieneNegocioConNivelRecoleccionDiferenteA($query, $nivelesRecoleccion)
    {
        return $query->whereHasMorph(
            'tramitable',
            [Negocio::class],
            fn ($query) => $query->whereNotIn('nivel_recoleccion_basura', $nivelesRecoleccion)
        );
    }

    public function scopeTieneNegocioConNivelRecoleccionAll($query, $nivelesRecoleccion)
    {
        return $query->whereHasMorph(
            'tramitable',
            [Negocio::class],
            fn ($query) => $query->whereIn('nivel_recoleccion_basura', $nivelesRecoleccion)->whereNotIn('nivel_recoleccion_basura', $nivelesRecoleccion)
        );
    }

    public function scopeTieneObservacion($query)
    {
        $query->whereHas('revisions', function ($revision) {
            $revision->whereHas('estados_revision', function ($estadosRevision) {
                $estadosRevision->
                where('observaciones', '<>', '')->
                where('observaciones', '<>', 'Revision iniciada');
            });
        });
    }

    public function scopeRequierePago($query)
    {
        $query->whereHas('catalogo', function ($catalogoTramites) {
            $catalogoTramites->where('pago', true);
        });
    }

    public function scopeFilterTramites($query, $filters)
    {
        if ($filters != null) {
            $query
                //Si se elige N/A y Pendiente, me debe traer los tramites en pago = false y además en true pero que no tengan aviso_enteroSi se elige N/A y Pendiente, me debe traer los tramites en pago = false y que no tengan aviso_entero
                ->when(in_array('N/A', $filters) && in_array('PENDIENTE', $filters), function ($query) {
                    $query
                        ->with('catalogo_tramite')
                        ->whereDoesntHave('avisos_entero');
                })
                // Si se elige N/A y solamente N/A, debemos buscar los tramites que pago = false
                ->when(in_array('N/A', $filters), function ($query) {
                    $query->with('catalogo_tramite', function ($query) {
                        $query->where('pago', false);
                    });
                    $query->whereHas('catalogo_tramite', function ($query) {
                        $query->where('pago', false);
                    });
                })
                // Si se elige N/A y todas las demás, me debe traer las que estén en false y true, es decir todos y los que cumplan con la condición
                ->when(in_array('N/A', $filters) && (count($filters) > 1) && (! in_array('PENDIENTE', $filters)), function ($query) use ($filters) {
                    $query->with('catalogo_tramite');
                    $query->orWhereHas('avisos_entero', function ($avisoEnteroQuery) use ($filters) {
                        $avisoEnteroQuery->whereIn('estado', $filters);
                    });
                })
                ->when(! in_array('N/A', $filters) && (count($filters) > 0), function ($query) use ($filters) {
                    $query->with('catalogo_tramite', function ($query) {
                        $query->where('pago', true);
                    });
                    $query->whereHas('catalogo_tramite', function ($query) {
                        $query->where('pago', true);
                    });
                    $query->where(function ($subQuery) use ($filters) {
                        $subQuery->whereHas('avisos_entero', function ($avisoEnteroQuery) use ($filters) {
                            $avisoEnteroQuery->whereIn('estado', $filters);
                        });
                        if (in_array('PENDIENTE', $filters)) {
                            $subQuery->orWhereDoesntHave('avisos_entero');
                        }
                    });
                });
        } else {
            $query
                ->with('avisos_entero')
                ->with('catalogo_tramites');
        }
    }

    public function scopeTieneNegocioConVentaAlcohol($query)
    {
        return $query->whereHasMorph(
            'tramitable',
            [Negocio::class],
            fn ($query) => $query->where('venta_alcohol', true)
        );
    }

    public function scopeTieneNegocioConNivelRecoleccionAll2($query)
    {
        return $query->whereHasMorph(
            'tramitable',
            [Negocio::class],
            fn ($query) => $query->where('nivel_recoleccion_basura', '!=', null)
        );
    }

    public function scopeTieneAvisoEnteroVigente($query)
    {
        return $query->whereHas('aviso_entero', function (Builder $query) {
            $query->where('estado', 'VIGENTE');
        });
    }

    public function requierePagoT()
    {
        return $this->catalogo_tramite->pago;
    }

    public function scopeDelUsuario($query, User $user)
    {
        $query->whereHasMorph('tramitable', [User::class], fn ($q) => $q->where('id', $user->id))
            ->orWhereHasMorph('tramitable', [PersonaMoral::class], fn ($q) => $q->where('persona_id', $user->id));
    }

    public function scopeConTramitePadre($query, $year = null)
    {
        return $year != null
            ? $query->whereHas(
                'tramite_padre', 
                fn($query) => $query->whereYear('created_at', $year)
            ) : $query->has('tramite_padre');
    } 

    public function getHoraAttribute()
    {
        return $this->created_at->timezone('America/Mazatlan')->format('H:i');
    }

    public function getFechaAttribute()
    {
        return $this->created_at->timezone('America/Mazatlan')->format('d-m-Y');
    }
}
