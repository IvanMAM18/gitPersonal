<?php

namespace Tests;

use Database\Seeders\EntidadRevisionSeeder;
use Database\Seeders\RolesSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed(RolesSeeder::class);
        $this->seed(UserSeeder::class);
        $this->seed(EntidadRevisionSeeder::class);

        // Nose exactamente porque con postgress tengo que agregar esta linea.
        // Pero pareceiera que el autoincrements del ID no funciona bien con los tests.
        DB::statement("SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id)+1, 1), false) FROM users;");
    }
}
