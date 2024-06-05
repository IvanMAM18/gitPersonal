<?php

namespace Database\Seeders;

use App\Models\Roles;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->truncate();

        $roles = [
            ['id' => 1, 'nombre' => 'Superadmin', 'descripcion' => 'Control total del sistema'],
            ['id' => 2, 'nombre' => 'EntidadRevisora', 'descripcion' => 'Entidad dedicada a revisar los documentos'],
            ['id' => 3, 'nombre' => 'Persona', 'descripcion' => 'Persona negocio'],
            ['id' => 4, 'nombre' => 'comercio_admin', 'descripcion' => 'Admin de Resoluciones'],
            ['id' => 5, 'nombre' => 'EntidadRevisoraDirector', 'descripcion' => 'Director de entidad dedicada a generar resolutivos'],
            ['id' => 6, 'nombre' => 'ComercioDirector', 'descripcion' => 'Director de entidad Comercio dedicada a generar resolutivos'],
            ['id' => 7, 'nombre' => 'ComercioAdminVisor', 'descripcion' => 'Director de entidad comercio dedicada a revisar registros'],
        ];

        foreach ($roles as $role) {
            Roles::updateOrCreate(['id' => $role['id']], $role);
        }
    }
}
