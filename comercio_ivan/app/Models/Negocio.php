<?php

namespace App\Models;
use App\Contracts\Tramitable;
use App\Helpers\ServiciosPublicosPI;
use App\Helpers\EntidadRevisora;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Negocio extends Model implements Tramitable
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'negocios';

    protected $fillable = [
        'direccion_id',
        'tipo_de_negocio_id',
        'persona_id',
        'persona_moral_id',
        'numero_licencia_funcionamiento_previa',
        'catalogo_tramite_id',
        'nombre_del_negocio',
        'categoria_id',
        'status',
        'tarifa_recoleccion_id',
        'impacto_giro_comercial',
        'tipo_predio',
        'tipo_anuncio',
        'leyenda_anuncio',
        'lugar_instalacion',
        'sector',
        'fecha_inicio_operaciones',
        'largo_anuncio',
        'ancho_anuncio',
        'inversion',
        'no_empleados_h',
        'no_empleados_m',
        'empleados_cap_diferentes',
        'telefono',
        'horarios',
        'clave_catastral',
        'superficie_m2',
        'nivel_recoleccion_basura',
        'cajones_estacionamiento',
        'foto_frontal_fachada',
        'validado_por',
        'comprobante_domicilio',
        'venta_alcohol',
        'descripcion_actividad',
        'servicio_priv_recoleccion',
        'documento_predio_propiedad',
        'tipo_predio_propiedad',
        'predio_playa_ejidal',
        'predio_playa_ejidal_documento',
        'tipo',
        'camara_id',
        'autoempleo',
        'tamano_empresa',
        'tamano_empresa',
        'trabajador_baja_id',
    ];

    protected $appends = [
        'propietario',
        'rfc',
        'estador',
    ];

    protected $casts = [
        'venta_alcohol' => 'bool',
    ];

    public $anio_padre_tramite = null;

    public function resolutivos()
    {
        return $this->hasMany(Resolutivo::class, 'negocio_id', 'id');
    }

    public function direccion()
    {
        return $this->hasOne('App\Models\Direccion', 'id', 'direccion_id');
    }

    public function persona()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'persona_id');
    }

    public function usuario_requisitos()
    {
        return $this->hasMany(UsuarioRequisito::class, 'user_id', 'persona_id');
    }

    public function persona_moral()
    {
        return $this->belongsTo('App\Models\PersonaMoral');
    }

    public function categoria()
    {
        return $this->belongsTo('App\Models\Categoria');
    }

    public function giro_comercial()
    {
        //uptdated to many to many through
        //return $this->belongsTo('App\Models\GiroComercial');
        return $this->hasManyThrough(
            // required
            'App\Models\GiroComercial', // the related model
            'App\Models\GiroComercialNegocio', // the pivot model
            // optional
            'negocio_id', // the current model id in the pivot
            'id', // the id of related model
            'id', // the id of current model
            'giro_comercial_id' // the related model id in the pivot
        );
    }

    // public function giros_comerciales()
    // {
    //     return $this->belongsToMany(
    //         GiroComercial::class, // The related model
    //         'giro_comercial_negocio', // The pivot table
    //         'negocio_id', // The foreign key in the pivot table for the current model
    //         'giro_comercial_id' // The foreign key in the pivot table for the related model
    //     );
    // }

    public function revisiones()
    {
        return $this->hasMany(Revision::class);
    }
    public function validarProgramaInterno()
    {
        return $this->hasMany(ValidarProgramaInterno::class);
    }
    public function validarProgramaInternoPorAnio($year = null)
    {
        return $this->validarProgramaInterno()
            ->when($year, fn ($q) => $q->where('anio', $year))
            ->first();
    }
    /**
     * Relacion polimorfica con los tramites.
     */
    public function tramites()
    {
        return $this->morphMany(Tramite::class, 'tramitable')
            ->whereNotNull('tramite_padre_id');
    }
    /**
     * Regresa el tramite padre por año.
     */
    public function tramitePadre($year = null)
    {
        return $this->tramitesPadres()
            ->when($year, fn ($q) => $q->whereYear('created_at', $year))
            ->first();
    }

    public function tramitesPadres()
    {
        return $this->morphMany(Tramite::class, 'tramitable')
            ->whereNull('tramite_padre_id');
    }

    // Metodo solo para soportar versiones anteriores.
    public function tramite_padre()
    {
        return $this->morphMany(Tramite::class, 'tramitable')
            ->whereNull('tramite_padre_id');
        // esto seria lo ideal:
        //        return $this->hasOne(Tramite::class, 'tramitable_id', 'id')
        //            ->where('tramitable_type', Negocio::class)
        //            ->whereNull('tramite_padre_id');
    }

    public function tramites_padres()
    {
        return $this->morphMany(Tramite::class, 'tramitable')
            ->whereNull('tramite_padre_id');
    }

    public function catalogo_tramite()
    {
        return $this->belongsTo(CatalogoTramite::class);
    }

    public function tarifa_recoleccion_basura()
    {
        return $this->belongsTo('App\Models\TarifaRecoleccionBasura', 'tarifa_recoleccion_id');
    }

    public function scopeEsMedianoAltoImpacto($query)
    {
        $query->where('impacto_giro_comercial', 'mediano_alto_impacto');
    }

    public function scopeEsBajoImpacto($query)
    {
        $query->where('impacto_giro_comercial', 'bajo_impacto');
    }

    public function scopeValidado($query)
    {
        $query->where('negocios.validado_por', '!=', 0);
    }

    public function scopeNoValidado($query)
    {
        $query->where('negocios.validado_por', 0);
    }
    public function scopeRechazado($query) {
        return $query->whereHas('revisiones', function ($query) {
            $query->where("entidad_revision_id", EntidadRevisora::$COMERCIO)
                  ->where('status', 'RECHAZADO');
        });
    }
    public function scopeConTramitesObsoletos(Builder $query, $tramiteEspecificos = null)
    {
        return $query->where(function ($query) use ($tramiteEspecificos) {
            $query->whereHas('tramitesPadres', function ($query) use ($tramiteEspecificos) {
                $query->whereYear('created_at', (date('Y') - 1))
                    ->when($tramiteEspecificos, fn($q) => $q->whereIn('catalogo_tramites_id', $tramiteEspecificos));
            })
                ->whereDoesntHave('tramitesPadres', function ($query) {
                    $query->whereYear('created_at', date('Y'));
                });
        });
    }
    // public function scopeEstadoResolutivo(Builder $query)
    // {
    //     $fechaActual = Carbon::now()->format('Y-m-d H:i:s');
    //     $year = Carbon::now()->year;

    //     return $query == null || $query->resolutivos == null ? null
    //         : ($query->resolutivos->whereBetween('fecha_expedicion', ["{$year}-01-01 00:00:00", $fechaActual])->first() ? 'VIGENTE'
    //             : ($query->tramite_comercio_padre ? 'EN REVISION' : 'PENDIENTE'));
    // }
    public function scopePorRFC(Builder $query, $rfc)
    {
        return $query->where(function ($query) use ($rfc) {
            $query->whereNull('negocios.persona_moral_id')
                ->where('users.rfc', 'ILIKE', "%$rfc%");
        })->orWhere(function ($query) use ($rfc) {
            $query->whereNotNull('negocios.persona_moral_id')
                ->where('personas_morales.rfc', 'ILIKE', "%$rfc%");
        });
    }

    public function scopeTieneGiroConClaveSCIAN(Builder $query, $arregloClaves)
    {
        return $query->whereHas('giro_comercial', function ($giroComercial) use ($arregloClaves) {
            $giroComercial->whereIn('clave_scian', $arregloClaves);
        });
    }

    public function scopeTieneResolutivoActivo(Builder $query)
    {
        $ENTIDAD_COMERCIO_ID = 5;

        return $query->whereHas('resolutivos', function ($resolutivo) use ($ENTIDAD_COMERCIO_ID) {
            $resolutivo->
                where('entidad_revisora_id', $ENTIDAD_COMERCIO_ID)->
                where('fecha_expiracion', '>=', \Carbon\Carbon::now());
        });
    }

    public function get_tramite_padre($entidad_revision)
    {
        try {
            $subtramites = Subtramite::select('subtramites.*')
                ->where('catalogo_tramite_hijo_id', '=', $entidad_revision)
                ->get();

            return $subtramites;
        } catch (\Throwable $th) {
            return $th;
        }
    }

    public function getTramitePadrePorAño($year = null)
    {
        $year = $year ? $year : now()->year;

        return $this->tramite_padre()
            ->whereYear('created_at', $year)
            ->first();
    }

    public function getTramitesPorAño($year = null)
    {
        $year = $year != null ? $year : now()->year;

        return $this->tramites()
            ->whereYear('created_at', $year)
            ->with("aviso_entero")
            ->with("catalogo_tramite")
            ->get();
    }
    public function getSubtramites($tramite_id)
    {
        $subtramites = Subtramite::select('*')
            ->join('catalogo_tramites', 'catalogo_tramites.entidad_revisora_id', '=', 'subtramites.catalogo_tramite_padre_id')
            ->join('tramites', 'tramites.')
            ->get();

        return $subtramites;
    }

    public function allNotApproved($entidad_revision)
    {
        try {
            $negocio_users = Negocio::select('negocios.*')
                ->join('revision', 'revision.negocio_id', '=', 'negocios.id')
                ->with('user')
                ->with('giro_comercial')
                ->with('catalogo_tramite')
                ->with('persona_moral')
                ->with('tramites', function ($query) {
                    $query->with('catalogo_tramites');
                })
                ->with('revisiones', function ($revision) use ($entidad_revision) {
                    $revision
                        ->with('tramites', function ($tramite) {
                            $tramite->with('aviso_entero');
                        })
                        ->with('requisito_revision', function ($requisito_revision) {
                            $requisito_revision
                                ->with('negocio_requisito', function ($negocio_requisito) {
                                    $negocio_requisito
                                        ->with('requisito')
                                        ->get();
                                })
                                ->get();
                        })
                        ->with('negocio_requisitos_revision', function ($negocio_requisitos_revision) {
                            $negocio_requisitos_revision
                                ->with('negocio_requisito_archivo');
                        })
                        ->where('entidad_revision_id', $entidad_revision)
                        ->orderBy('id', 'desc');
                })
                ->where('revision.entidad_revision_id', '=', $entidad_revision)
                ->where('negocios.validado_por', '!=', 0)
                ->orderBy('id', 'ASC')
                ->get();

            return response()->json($negocio_users);
        } catch (\Throwable $th) {
            return $th;
        }
    }

    public function validador()
    {
        return $this->hasOne(User::class, 'id', 'validado_por');
    }

    public function licenciaAlcohol()
    {
        return $this->hasOne(NegocioLicencia::class, 'negocio_operador_id');
    }

    public function licenciaAlcoholPropietario()
    {
        return $this->hasOne(NegocioLicencia::class, 'negocio_propietario_id');
    }

    public function licencias()
    {
        return $this->morphMany(NegocioLicencia::class, 'propietario');
    }

    public function tramite_realizado()
    {
        return $this->hasOne(CatalogoTramite::class, 'id', 'catalogo_tramite_id');
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

    public function getDireccionCompletaAttribute()
    {
        return $this == null || $this->direccion == null
        ? null
        : $this->direccion->calle_principal.' '.$this->direccion->calles
        .' '.$this->direccion->numero_exterior.' '.$this->direccion->numero_externo;
    }

    // sin sentido
    public function getEstadorAttribute()
    {
        $fechaActual = Carbon::now()->format('Y-m-d H:i:s');
        $year = Carbon::now()->year;

        return $this == null || $this->resolutivos == null ? null
            : ($this->resolutivos->whereBetween('fecha_expedicion', ["{$year}-01-01 00:00:00", $fechaActual])->first() ? 'VIGENTE'
                : ($this->tramite_comercio_padre ? 'EN REVISION' : 'PENDIENTE'));
    }

    public function getPropietarioAttribute()
    {
        return $this == null || $this->user == null ? null
            : ($this->persona_moral == null
                ? optional($this->user)->nombre.' '.optional($this->user)->apellido_pat.' '.optional($this->user)->apellido_mot :
                $this->persona_moral->razon_social);
    }

    public function getRfcAttribute()
    {
        return $this == null || $this->user == null ? null
        : ($this->persona_moral == null
        ? optional($this->user)->rfc :
        $this->persona_moral->rfc);
    }

    public function getNombreCatalogoGiroComercialAttribute()
    {
        return $this->tarifa_recoleccion_basura
            && $this->tarifa_recoleccion_basura->catalogo_giro_comercial
            ? $this->tarifa_recoleccion_basura->catalogo_giro_comercial->nombre
            : 'N/A';
    }

    public function getTipoTarifaAttribute()
    {

        if ($this->tamano_empresa != null) {
            return mb_strtoupper($this->tamano_empresa);
        } else {
            $numeroDeEmpleados = $this->no_empleados_h ? $this->no_empleados_h : 0;
            $numeroDeEmpleados += $this->no_empleados_m ? $this->no_empleados_m : 0;

            if ($this->autoempleo == true) {
                return 'AUTOEMPLEO';
            } elseif ($numeroDeEmpleados >= 1 && $numeroDeEmpleados <= 10) {
                return 'MICRO';
            } elseif ($numeroDeEmpleados >= 11 && $numeroDeEmpleados <= 30) {
                return 'PEQUEÑA';
            } elseif ($numeroDeEmpleados >= 31 && $numeroDeEmpleados <= 100) {
                return 'MEDIANA';
            } else {
                return 'GRANDE';
            }

            return null;
        }
    }

    public function getVolumenAttribute()
    {
        $tarifaRecoleccion = $this->tarifa_recoleccion_basura;
        if (! $tarifaRecoleccion) {
            return null;
        }

        return $tarifaRecoleccion->volumen;
    }

    public function getTieneProgramaInternoAttribute()
    {
        $giros = ServiciosPublicosPI::$GIROS_PROGRAMAS_INTERNOS;

        $giroProgramaInterno = $this->giro_comercial->filter(
            function ($giro) use ($giros) {
                return in_array($giro->clave_scian, $giros);
            })->count() > 0;

        $esMediano = $this->esMediano;

        $esGrande = $this->esGrande;

        $esDistribuidorDeGas = $this->esDistribuidoraDeGas;

        $validarProgramaInterno = $this->validarProgramaInternoPorAnio($this->anio_padre_tramite);

        if($validarProgramaInterno != null)
            return  $validarProgramaInterno->validar_programa_interno;

        return $giroProgramaInterno || $esMediano || $esGrande || $esDistribuidorDeGas;
    }

    public function getEsDistribuidoraDeGasAttribute()
    {

        $clavesParaDistribuidoras = ServiciosPublicosPI::$GIROS_DISTRIBUIDORAS_DE_GASES;

        return $this->giro_comercial->filter(
            function ($giro) use ($clavesParaDistribuidoras) {
                return in_array($giro->clave_scian, $clavesParaDistribuidoras);
            }
        )->count() > 0;
    }

    public function conVentaAlcoholes($query)
    {
        $query->where('venta_alcohol', true);
    }

    public function getEsMedianoAttribute()
    {
        return $this->tamano_empresa == 'mediana';
    }

    public function getEsGrandeAttribute()
    {
        return $this->tamano_empresa == 'grande';
    }
    public function getServicioBasuraAttribute()
    {
        switch ($this->nivel_recoleccion_basura) {
            case 'servicio_privado':
                return 'Servicio Privado';
            case 'cuenta_propia':
                return 'Uso de relleno sanitario';
            default:
                return 'Servicios Públicos';
        }
    }
    public function scopeWithoutRechazadoRevisions(Builder $query)
    {
        return $query->whereDoesntHave('revisiones', function ($query) {
            $query->where("entidad_revision_id", EntidadRevisora::$COMERCIO)
            ->where('status', 'RECHAZADO');
        });
    }
}
