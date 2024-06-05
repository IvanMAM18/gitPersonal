<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->entidadesRevisoras();
        //Entidades revisoras id
    }

    protected function entidadesRevisoras()
    {
        $users = [
            // Super Admin
            [
                'id' => 1,
                'nombre' => 'SuperAdmin',
                'apellido_pat' => '',
                'apellido_mot' => '',
                'role_id' => 1,
                'entidad_revision_id' => 0,
                'email' => 'superadmin@gmail.com',
            ],

            // Entidad Revisoras
            [
                'id' => 2,
                'nombre' => 'Uso de Suelo',
                'apellido_pat' => '',
                'apellido_mot' => '',
                'role_id' => 2,
                'entidad_revision_id' => 1,
                'email' => 'uso_de_suelo@gmail.com',
            ],
            [
                'id' => 3,
                'nombre' => 'Protección Civil',
                'apellido_pat' => '',
                'apellido_mot' => '',
                'role_id' => 2,
                'entidad_revision_id' => 2,
                'email' => 'proteccion_civil@gmail.com',
            ],
            [
                'id' => 4,
                'nombre' => 'Medio Ambiente',
                'apellido_pat' => '',
                'apellido_mot' => '',
                'role_id' => 2,
                'entidad_revision_id' => 3,
                'email' => 'ecologia@gmail.com',
            ],
            [
                'id' => 5,
                'nombre' => 'Servicios Públicos',
                'apellido_pat' => '',
                'apellido_mot' => '',
                'role_id' => 2,
                'entidad_revision_id' => 4,
                'email' => 'servicios_publicos@gmail.com',
            ],
            [
                'id' => 6,
                'nombre' => 'Comercio Admin',
                'apellido_pat' => '',
                'apellido_mot' => '',
                'role_id' => 4,
                'entidad_revision_id' => 1,
                'email' => 'comercio_admin@gmail.com',
            ],
            [
                'id' => 7,
                'nombre' => 'Eliseo',
                'apellido_pat' => 'Geraldo',
                'apellido_mot' => 'Gonzalez',
                'role_id' => null,
                'entidad_revision_id' => null,
                'email' => 'e@gmail.com',
            ],
        ];

        foreach ($users as $user) {
            User::factory()->create($user);
        }
    }
}
