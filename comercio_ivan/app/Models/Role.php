<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['nombre', 'label', 'group', 'descripcion'];

    public static $SUPER_ADMIN = 'superadmin';
    public static $ENTIDAD_REVISORA = 'entidad-revisora';
    public static $PERSONA = 'persona';
    public static $COMERCIO_ADMIN = 'comercio-admin';
    public static $DIRECTOR_ENTIDAD_REVISORA = 'entidad-revisora-director';
    public static $DIRECTOR_DE_COMERCIO = 'comercio-director';
    public static $ADMINISTRADOR_DE_COMERCIO_VISOR = 'comercio-admin-visor';

    /**
     * Relacion de un Rol con un Permiso.
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    /**
     * Relacion del Rol con Usuarios
     */
    public function users()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Assignar permisos a rol.
     */
    public function givePermissionTo($permissions)
    {
        if ($permissions instanceof Permission) {
            return $this->permissions()->save($permissions);
        }
        if (is_array($permissions)) {
            return $this->permissions()->sync($permissions);
        }
        throw new \Exception("Invalid type of permission provided");
    }
}
