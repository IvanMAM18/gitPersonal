<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class LicenciasDeAlcoholTest extends TestCase
{
    public function test_que_la_ruta_negocios_con_licencia_de_alcoholes_funcionata(): void
    {
        $user = User::find(1);
        $this->actingAs($user);
        // Crear tramite persona o persona moral con licencia de alchol
        // y validar en el test que cuenta 1
        $year = date('Y');
        $this->get(route('contribuyentes-con-licencia-de-alcholes', $year))
            ->assertStatus(200);
        //            ->assertJsonCount(1);
    }
}
