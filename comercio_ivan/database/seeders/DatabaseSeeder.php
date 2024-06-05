<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            CondicionantesSeeder::class,
            UserSeeder::class,
            EntidadRevisionSeeder::class,
            GirosComercialesRecoleccionBasuraSeeder::class,
            RolesSeeder::class,
            TarifaRecoleccionBasuraSeeder::class,
            GirosFromCSVSeeder::class,
            RequisitosSeeder::class,
            TramitesSeeder::class,
            CodigosPostalesSeeder::class,
            CatalogoServicioPrivadoRecoleccionBasuraSeeder::class,
        ]);
    }
}
