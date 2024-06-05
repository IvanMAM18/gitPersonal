<?php

namespace App\Contracts;

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
     * Regresa si el usuario tiene el rol Superadmin.
     */
    public function esSuperAdmin()
    {
        return $this->roleEs(Roles::$SUPER_ADMIN);
    }

    /**
     * Regresa si el usuario tiene el rol EntidadRevisora.
     */
    public function esEntidadRevisora()
    {
        return $this->roleEs(Roles::$ENTIDAD_REVISORA);
    }

    /**
     * Regresa si el usuario tiene el rol Persona.
     * Si es persona tambien es valido para cuando no exista un rol asociado al usurio.
     */
    public function esPersona()
    {
        return $this->rol === null || $this->roleEs(Roles::$PERSONA);
    }

    /**
     * Regresa si el usuario tiene el rol comercio_admin.
     */
    public function esAdministradorDeComercio()
    {
//        dd($this->rol->nombre, Roles::$COMERCIO_ADMIN);
        return $this->roleEs(Roles::$COMERCIO_ADMIN);
    }

    /**
     * Regresa si el usuario tiene el rol EntidadRevisoraDirector.
     */
    public function esEntidadRevisoraDirector()
    {
        return $this->roleEs(Roles::$DIRECTOR_ENTIDAD_REVISORA);
    }

    /**
     * Regresa si el usuario tiene el rol ComercioDirector.
     */
    public function esDirectorDeComercio()
    {
        return $this->roleEs(Roles::$DIRECTOR_DE_COMERCIO);
    }

    /**
     * Regresa si el usuario tiene el rol ComercioAdminVisor.
     */
    public function esAdministradorDeComercioVisor()
    {
        return $this->roleEs(Roles::$ADMINISTRADOR_DE_COMERCIO_VISOR);
    }

    /**
     * Verifica que el usuario tiene un rol y el pasado en la variable $role;
     */
    public function roleEs($role)
    {
        return $this->rol && $this->rol->nombre === $role;
    }
}
