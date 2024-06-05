<?php

namespace App\Models;

use App\Contracts\HasRoles;
use App\Contracts\Tramitable;
use App\Notifications\ResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail, Tramitable
{
    use HasFactory;
    use HasRoles;
    use Notifiable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'nombre',
        'apellido_pat',
        'apellido_mot',
        'rfc',
        'curp',
        'telefono',
        'email',
        'email_verified_at',
        'direccion_de_notificacion_id',
        'role_id',
        'entidad_revision_id',
        'password',
        'regimen_fiscal',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'api_token',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function direccionDeNotificacion()
    {
        return $this->hasOne(Direccion::class, 'id', 'direccion_de_notificacion_id');
    }

    public function rol()
    {
        return $this->belongsTo(Roles::class, 'role_id');
    }

    public function entidad_revision()
    {
        return $this->belongsTo(EntidadRevision::class, 'entidad_revision_id');
    }

    public function direccion_notificacion()
    {
        return $this->belongsTo(Direccion::class, 'direccion_de_notificacion_id', 'id');
    }

    public function requisitos()
    {
        // Esta relacion deberia ser $this->belongToMany(Requisito::class);
        return $this->hasMany(UsuarioRequisito::class, 'user_id', 'id');
    }

    /**
     * Relacion polimorfica con los tramites.
     */
    public function tramites()
    {
        return $this->morphMany(Tramite::class, 'tramitable');
    }

    /**
     * Regresa las personas morales creadas por el usuario.
     */
    public function personasMorales()
    {
        return $this->hasMany(PersonaMoral::class, 'persona_id');
    }

    public function personaRequisitos()
    {
        return $this->morphMany(PersonaRequisito::class, 'persona');
    }

    public function licencias()
    {
        return $this->morphMany(NegocioLicencia::class, 'propietario');
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPassword($token));
    }

    public function getIsAdminAttribute()
    {
        return $this->rol->pluck('nombre')->contains('Superadmin');
    }

    public function getNombreCompletoAttribute()
    {
        return $this->nombre.' '.$this->apellido_pat.' '.$this->apellido_mot;
    }
}
