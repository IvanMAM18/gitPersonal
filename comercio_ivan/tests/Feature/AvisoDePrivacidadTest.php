<?php

namespace Tests\Feature;

use Tests\TestCase;

class AvisoDePrivacidadTest extends TestCase
{
    public function test_abre_la_pagina_del_aviso_de_privacidad_integral()
    {
        $this->get(route('aviso-de-privacidad-integral'))
            ->assertOk();
    }

    public function test_abre_la_pagina_del_aviso_de_privacidad_simplificado()
    {
        $this->get(route('aviso-de-privacidad-simplificado'))
            ->assertOk();
    }
}
