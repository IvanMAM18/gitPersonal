<?php

namespace Database\Seeders;

use App\Models\EntidadRevision;
use App\Models\Roles;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ComercioAdminVisor extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $role = Roles::firstOrCreate(['nombre' => 'ComercioAdminVisor']);
        $entidad_revision = EntidadRevision::firstOrCreate(['nombre' => 'Comercio']);
        //
        DB::table('users')->insert([
            'nombre' => 'Comercio',
            'apellido_pat' => 'Admin',
            'apellido_mot' => 'Visor',
            //'role_id' => 'Director de entidad comercio dedicada a revisar registros',
            'entidad_revision_id' => $entidad_revision->id,
            'email' => 'comercio_admin_visor@gmail.com',
            'password' => Hash::make('123'),
            'email_verified_at' => \Carbon\Carbon::now(),
            'role_id' => $role->id,

        ]);
    }
}
