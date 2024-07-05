<?php

namespace App\Contracts;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Roles;

trait HasRoles
{
    /**
     * Regresa la relacion usuario rol.
     */
    public function rol()
    {
        return $this->belongsTo(Roles::class, 'role_id');
    }

    /**
     * La relacion con los roles.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class)->with('permissions');
    }

    /**
     * Regresa todos los permisos del usario.
     */
    public function permissions()
    {
        $permissions = [];
        foreach ($this->roles as $role) {
            $permissions = array_merge($permissions, $role->permissions->pluck('label')->toArray());
        }
        return $permissions;
    }

    /**
     * Assignar un rol al usuario.
     */
    public function assignRole($role)
    {
        if (!$this->hasRole($role->nombre)) {
            if ($role instanceof Role) {
                return $this->roles()->save($role);
            }
            return $this->roles()->sync(
                get_array_keys($role, 'id')
            );
        }
    }

    /**
     * Remover rol de el usuario.
     */
    public function removeRole(Role $role)
    {
        if ($this->hasRole($role->name)) {
            return $this->roles()->detach($role);
        }
    }

    /**
     * Regresa si el usuario tiene el rol dado.
     */
    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles->contains('label', $role);
        }
        return !!$role->intersect($this->roles)->count();
    }

    /**
     * Regresa si el usuario tiene el permiso dado.
     */
    public function hasPermission(Permission $permission)
    {
        return $this->hasRole($permission->roles);
    }

    /**
     * Regresa si el usuario tiene el rol Superadmin.
     */
    public function esSuperAdmin()
    {
        return $this->roleEs(Role::$SUPER_ADMIN);
    }

    /**
     * Regresa si el usuario tiene el rol EntidadRevisora.
     */
    public function esEntidadRevisora()
    {
        return $this->roleEs(Role::$ENTIDAD_REVISORA);
    }

    /**
     * Regresa si el usuario tiene el rol Persona.
     * Si es persona tambien es valido para cuando no exista un rol asociado al usurio.
     */
    public function esPersona()
    {
        return $this->rol === null || $this->roleEs(Role::$PERSONA);
    }

    /**
     * Regresa si el usuario tiene el rol comercio_admin.
     */
    public function esAdministradorDeComercio()
    {
        return $this->roleEs(Role::$COMERCIO_ADMIN);
    }

    /**
     * Regresa si el usuario tiene el rol EntidadRevisoraDirector.
     */
    public function esEntidadRevisoraDirector()
    {
        return $this->roleEs(Role::$DIRECTOR_ENTIDAD_REVISORA);
    }

    /**
     * Regresa si el usuario tiene el rol ComercioDirector.
     */
    public function esDirectorDeComercio()
    {
        return $this->roleEs(Role::$DIRECTOR_DE_COMERCIO);
    }

    /**
     * Regresa si el usuario tiene el rol ComercioAdminVisor.
     */
    public function esAdministradorDeComercioVisor()
    {
        return $this->roleEs(Role::$ADMINISTRADOR_DE_COMERCIO_VISOR);
    }

    /**
     * Verifica que el usuario tiene un rol y el pasado en la variable $role;
     */
    public function roleEs($role)
    {
        return $this->rol && $this->rol->label === $role;
    }

    /**
     * Filtra usuarios que tienen el rol id.
     */
    public function scopeHasRole($query, $rolId)
    {
        $query->whereHas('roles', fn($q) => $q->where('id', $rolId));
    }
}
