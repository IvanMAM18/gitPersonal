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
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function actividades()
    {
        return $this->hasMany(Actividad::class);
    }

    /**
     * Relacion direccion de notificacion.
     */
    public function direccionDeNotificacion()
    {
        return $this->hasOne(Direccion::class, 'id', 'direccion_de_notificacion_id');
    }

    /**
     * Relacion direccion de notficacion, nose cual es la buena.
     */
    public function direccion_notificacion()
    {
        return $this->belongsTo(Direccion::class, 'direccion_de_notificacion_id', 'id');
    }

    /**
     * Relacion ROL (NO MANTENIBLES) Ahora usamos muchos roles
     */
    public function rol()
    {
        return $this->belongsTo(Roles::class, 'role_id');
    }

    /**
     * Relacion entidad revisora.
     */
    public function entidad_revision()
    {
        return $this->belongsTo(EntidadRevision::class, 'entidad_revision_id');
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

    /**
     * Relacion persona requisitos.
     */
    public function personaRequisitos()
    {
        return $this->morphMany(PersonaRequisito::class, 'persona');
    }

    /**
     * Relacion de licencias.
     */
    public function licencias()
    {
        return $this->morphMany(NegocioLicencia::class, 'propietario');
    }

    /**
     * Reescribe la notificacion para cambiar el password.
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPassword($token));
    }

    /**
     * Accessor para saber si el usuario tiene el rol super admin.
     */
    public function getIsAdminAttribute()
    {
        return $this->rol->pluck('nombre')->contains('Superadmin');
    }

    /**
     * Guarda siempre en la base de datos el Email en minusculas.
     */
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = trim(strtolower($value));
    }

    /**
     * Guarda siempre en la base de datos el RFC con mayusculas.
     */
    public function setRfcAttribute($value)
    {
        $this->attributes['rfc'] = trim(strtoupper($value));
    }

    /**
     * Guarda siempre en la base de datos el CURP con mayusculas.
     */
    public function setCurpAttribute($value)
    {
        $this->attributes['curp'] = trim(strtoupper($value));
    }

    /**
     * Accessor para el nombre completo del usuario.
     */
    public function getNombreCompletoAttribute()
    {
        return $this->nombre . ' ' . $this->apellido_pat . ' ' . $this->apellido_mot;
    }

    /**
     * Buscar usuario por: nombre, email, rfc, curp y entidad_revisora
     */
    public function scopeSearch($query, $filters)
    {
        $query->whereRaw("CONCAT(id, ' ', nombre, ' ', apellido_pat, ' ', apellido_mot, ' ', email, ' ', rfc, ' ', curp) ilike ?", ['%' . ($filters['search_key'] ?? '') . '%'])
            ->when($filters['entidad_revisora_id'] ?? null, fn($query) => $query->where('entidad_revision_id', $filters['entidad_revisora_id']))
            ->when($filters['rol_id'] ?? null, fn($query) => $query->hasRole($filters['rol_id']));
    }

    /**
     * Add select para regresar el nombre completo del usuario.
     */
    public function scopeConNombreCompleto($query)
    {
        $query->selectRaw("*, CONCAT(nombre, ' ', apellido_pat, ' ', apellido_mot) nombre_completo");
    }
}
