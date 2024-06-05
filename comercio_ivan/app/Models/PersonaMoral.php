<?php

namespace App\Models;

use App\Contracts\Tramitable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonaMoral extends Model implements Tramitable
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'personas_morales';

    protected $fillable = [
        'razon_social',
        'rfc',
        'acta_constitutiva_path',
        'carta_de_situacion_fiscal',
        'persona_id',
        'direccion_id',
        'direccion_de_notificacion_id',
        'regimen_fiscal',
        'regimen_capital',
    ];

    /**
     * Relacion polimorfica con los tramites.
     */
    public function tramites()
    {
        return $this->morphMany(Tramite::class, 'tramitable');
    }

    public function direccion_notificacion()
    {
        return $this->belongsTo(Direccion::class, 'direccion_de_notificacion_id');
    }

    public function persona()
    {
        return $this->belongsTo(User::class, 'persona_id', 'id');
    }

    public function personaRequisitos()
    {
        return $this->morphMany(PersonaRequisito::class, 'persona');
    }

    public function licencias()
    {
        return $this->morphMany(NegocioLicencia::class, 'propietario');
    }

    public function getNombreAttribute()
    {
        return $this->razon_social;
    }

    public function getEmailAttribute()
    {
        return $this->persona->email;
    }
}
