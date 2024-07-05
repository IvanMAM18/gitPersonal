<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Resetear las tablas.
        if (app()->environment('testing')) {
            DB::table('roles')->truncate();
        }
        DB::table('role_user')->truncate();
        DB::table('permission_role')->truncate();

        // Crear todos los roles si no existen.
        $roles = $this->getRoles();
        foreach ($roles as $role) {
            Role::updateOrCreate(['id' => $role['id']], $role);
        }

        $superAdminRole = Role::where('label', 'superadmin')->first();

        // Crear todos los permisos de la funcion getPermissions, de paso le damos esos permisos al superadmin,
        // que es quien tiene control de todas las funciones nadamas.
        $permissions = $this->getPermissions();
        foreach ($permissions as $permission) {
            $permission = Permission::updateOrCreate(['id' => $permission['id']], $permission);
            if ($superAdminRole) {
                $superAdminRole->givePermissionTo($permission);
            }
        }

        // Rol a Super Admins
        $this->assignarRoles(1);

        // Rol a Entidad Revisoras
        $this->assignarRoles(2, 2);

        // Assignar Rol a Contribuyentes
        $this->assignarRoles(null, 3);
        $this->assignarRoles(3);

        // Assignar Rol a Comercio Admin
        $this->assignarRoles(4);

        // Assignar Rol a Entidad Revisora Director
        $this->assignarRoles(5);

        // Assignar Rol a Comercio Director
        $this->assignarRoles(6);

        // Assignar Rol a Comercio Admin Visor
        $this->assignarRoles(7);

        // Resetear auto-increment en la tabla de permissions, como se llena con un seeder, en postgres pasa algo raro que deja de funcionar.
        DB::statement("SELECT setval(pg_get_serial_sequence('permissions', 'id'), coalesce(max(id)+1, 1), false) FROM permissions;");
    }

    /**
     * Asignar rol a usuarios tipo persona.
     */
    protected function assignarRoles($rolActualId, $rolId = null)
    {
        $rolId = $rolId ?? $rolActualId;
        // Assignar rol a usuarioos personas
        $role = Role::where('id', $rolId)->first();
        $usuarios = User::where('role_id', $rolActualId)->get();
        foreach($usuarios as $user) {
            $user->assignRole($role);
        }
    }

    /**
     * Regresa un array con los roles actuales del sistema.
     */
    protected function getRoles()
    {
        return [
            [
                'id' => 1,
                'nombre' => 'Superadmin',
                'label' => 'superadmin',
                'descripcion' => 'Control total del sistema'],
            [
                'id' => 2,
                'nombre' => 'EntidadRevisora',
                'label' => 'entidad-revisora',
                'descripcion' => 'Entidad dedicada a revisar los documentos'],
            [
                'id' => 3,
                'nombre' => 'Persona',
                'label' => 'persona',
                'descripcion' => 'Persona negocio'],
            [
                'id' => 4,
                'nombre' => 'comercio_admin',
                'label' => 'comercio-admin',
                'descripcion' => 'Admin de Resoluciones'],
            [
                'id' => 5,
                'nombre' => 'EntidadRevisoraDirector',
                'label' => 'entidad-revisora-director',
                'descripcion' => 'Director de entidad dedicada a generar resolutivos'],
            [
                'id' => 6,
                'nombre' => 'ComercioDirector',
                'label' => 'comercio-director',
                'descripcion' => 'Director de entidad Comercio dedicada a generar resolutivos'],
            [
                'id' => 7,
                'nombre' => 'ComercioAdminVisor',
                'label' => 'comercio-admin-visor',
                'descripcion' => 'Director de entidad comercio dedicada a revisar registros'],
        ];
    }

    /**
     * Regresa un array con todos los permisos del sistema.
     */
    protected function getPermissions()
    {
        return [
            // Roles
            [
                'id' => 1,
                'name' => 'Ver Roles',
                'label' => 'index:roles',
                'group' => 'Autorizaciones',
            ],
            [
                'id' => 2,
                'name' => 'Crear Roles',
                'label' => 'store:roles',
                'group' => 'Autorizaciones',
            ],
            [
                'id' => 3,
                'name' => 'Actualizar Roles',
                'label' => 'update:roles',
                'group' => 'Autorizaciones',
            ],
            [
                'id' => 4,
                'name' => 'Eliminar Roles',
                'label' => 'delete:roles',
                'group' => 'Autorizaciones',
            ],
            // Permisos
            [
                'id' => 5,
                'name' => 'Ver Permisos',
                'label' => 'index:permisos',
                'group' => 'Autorizaciones',
            ],
            [
                'id' => 6,
                'name' => 'Crear Permisos',
                'label' => 'store:permisos',
                'group' => 'Autorizaciones',
            ],
            [
                'id' => 7,
                'name' => 'Actualizar Permisos',
                'label' => 'update:permisos',
                'group' => 'Autorizaciones',
            ],
            [
                'id' => 8,
                'name' => 'Eliminar Permisos',
                'label' => 'delete:permisos',
                'group' => 'Autorizaciones',
            ],
            // Catalogo de Tramites
            [
                'id' => 9,
                'name' => 'Ver Tramites (Catalogo)',
                'label' => 'index:catalogo-tramites',
                'group' => 'Tramites',
            ],
            [
                'id' => 10,
                'name' => 'Crear Tramites (Catalogo)',
                'label' => 'store:catalogo-tramites',
                'group' => 'Tramites',
            ],
            [
                'id' => 11,
                'name' => 'Actualizar Tramites (Catalogo)',
                'label' => 'update:catalogo-tramites',
                'group' => 'Tramites',
            ],
            [
                'id' => 12,
                'name' => 'Eliminar Tramites (Catalogo)',
                'label' => 'delete:catalogo-tramites',
                'group' => 'Tramites',
            ],
            // Catalogo de Giros Comerciales
            [
                'id' => 13,
                'name' => 'Ver Giros Comerciales (Catalogo)',
                'label' => 'index:catalogo-giros-comerciales',
                'group' => 'Giros Comerciales',
            ],
            [
                'id' => 14,
                'name' => 'Crear Giro Comercial (Catalogo)',
                'label' => 'store:catalogo-giros-comerciales',
                'group' => 'Giros Comerciales',
            ],
            [
                'id' => 15,
                'name' => 'Eliminar Giro Comercial (Catalogo)',
                'label' => 'update:catalogo-giros-comerciales',
                'group' => 'Giros Comerciales',
            ],
            [
                'id' => 16,
                'name' => 'Eliminar Giro Comercial (Catalogo)',
                'label' => 'delete:catalogo-giros-comerciales',
                'group' => 'Giros Comerciales',
            ],
            // Catalogo de Condicionantes
            [
                'id' => 17,
                'name' => 'Ver Condicionantes (Catalogo)',
                'label' => 'index:condicionantes',
                'group' => 'Condicionantes',
            ],
            [
                'id' => 18,
                'name' => 'Crear Condicionante (Catalogo)',
                'label' => 'store:condicionantes',
                'group' => 'Condicionantes',
            ],
            [
                'id' => 19,
                'name' => 'Eliminar Condicionante (Catalogo)',
                'label' => 'update:condicionantes',
                'group' => 'Condicionantes',
            ],
            [
                'id' => 20,
                'name' => 'Eliminar Condicionante (Catalogo)',
                'label' => 'delete:condicionantes',
                'group' => 'Condicionantes',
            ],
            // Catalogo de Requisitos
            [
                'id' => 21,
                'name' => 'Ver Catalogo de Requisitos (Catalogo)',
                'label' => 'index:catalogo-requisitos',
                'group' => 'Requisitos',
            ],
            [
                'id' => 22,
                'name' => 'Crear Requisito (Catalogo)',
                'label' => 'store:catalogo-requisitos',
                'group' => 'Requisitos',
            ],
            [
                'id' => 23,
                'name' => 'Actualizar Requisito (Catalogo)',
                'label' => 'update:catalogo-requisitos',
                'group' => 'Requisitos',
            ],
            [
                'id' => 24,
                'name' => 'Eliminar Requisito (Catalogo)',
                'label' => 'delete:catalogo-requisitos',
                'group' => 'Requisitos',
            ],
            // Catalgoo de Submitramites
            [
                'id' => 25,
                'name' => 'Ver Subtramites (Catalogo)',
                'label' => 'index:catalogo-subtramites',
                'group' => 'Tramites',
            ],
            [
                'id' => 26,
                'name' => 'Crear Subtramite (Catalogo)',
                'label' => 'store:catalogo-subtramites',
                'group' => 'Tramites',
            ],
            [
                'id' => 27,
                'name' => 'Actualizar Subtramite (Catalogo)',
                'label' => 'update:catalogo-subtramites',
                'group' => 'Tramites',
            ],
            [
                'id' => 28,
                'name' => 'Eliminar Subtramite (Catalogo)',
                'label' => 'delete:catalogo-subtramites',
                'group' => 'Tramites',
            ],
            // Trabajadores
            [
                'id' => 29,
                'name' => 'Ver Trabajadores',
                'label' => 'index:trabajadores',
                'group' => 'Trabajadores',
            ],
            [
                'id' => 30,
                'name' => 'Crear Trabajador',
                'label' => 'store:trabajadores',
                'group' => 'Trabajadores',
            ],
            [
                'id' => 31,
                'name' => 'Actualizar Trabajador',
                'label' => 'update:trabajadores',
                'group' => 'Trabajadores',
            ],
            [
                'id' => 32,
                'name' => 'Eliminar Trabajador',
                'label' => 'delete:trabajadores',
                'group' => 'Trabajadores',
            ],
            // Usuarios
            [
                'id' => 33,
                'name' => 'Ver Usuarios',
                'label' => 'index:usuarios',
                'group' => 'Usuarios',
            ],
            [
                'id' => 34,
                'name' => 'Crear Usuario',
                'label' => 'store:usuarios',
                'group' => 'Usuarios',
            ],
            [
                'id' => 35,
                'name' => 'Actualizar Usuario',
                'label' => 'update:usuarios',
                'group' => 'Usuarios',
            ],
            [
                'id' => 36,
                'name' => 'Eliminar Usuario',
                'label' => 'delete:usuarios',
                'group' => 'Usuarios',
            ],
            // Conceptops
            [
                'id' => 37,
                'name' => 'Ver Conceptos',
                'label' => 'index:conceptos',
                'group' => 'Conceptos',
            ],
            [
                'id' => 38,
                'name' => 'Crear Concepto',
                'label' => 'store:conceptos',
                'group' => 'Conceptos',
            ],
            [
                'id' => 39,
                'name' => 'Actualizar Concepto',
                'label' => 'update:conceptos',
                'group' => 'Conceptos',
            ],
            [
                'id' => 40,
                'name' => 'Eliminar Concepto',
                'label' => 'delete:conceptos',
                'group' => 'Conceptos',
            ],
            // UMAS
            [
                'id' => 41,
                'name' => 'Ver UMAS',
                'label' => 'index:umas',
                'group' => 'Conceptos',
            ],
            [
                'id' => 42,
                'name' => 'Crear UMA',
                'label' => 'store:umas',
                'group' => 'Conceptos',
            ],
            [
                'id' => 43,
                'name' => 'Actualizar UMA',
                'label' => 'update:umas',
                'group' => 'Conceptos',
            ],
            [
                'id' => 44,
                'name' => 'Eliminar UMA',
                'label' => 'delete:umas',
                'group' => 'Conceptos',
            ],
        ];
    }
}
