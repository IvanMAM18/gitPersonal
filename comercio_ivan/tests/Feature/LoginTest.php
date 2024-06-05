<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class LoginTest extends TestCase
{
    public function test_redirigir_la_pagina_mis_tramites_a_login_si_no_se_esta_autenticado()
    {
        $response = $this->get('/app/mis-tramites');
        $response->assertRedirect('/login');
    }

    public function test_validar_login_form()
    {
        $this->post('/login')
            ->assertStatus(302)
            ->assertSessionHasErrors(['email', 'password']);
    }

    public function test_validar_email_valido()
    {
        $this->post('/login', [
            'email' => 'asdasdasd',
            'password' => 'password',
        ])
            ->assertStatus(302)
            ->assertSessionHasErrors(['email'])
            ->assertSessionDoesntHaveErrors(['password']);
    }

    public function test_can_be_authenticated()
    {
        $user = User::factory()->create(['role_id' => 1]);

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ])
            ->assertOk()
            ->assertSessionDoesntHaveErrors(['password', 'password'])
            ->assertJson(['redirect' => '/app/admin-cruds']);

        $this->assertAuthenticatedAs($user);
    }

    public function test_redirect_to_verify_email_page_if_is_not_verified()
    {
        $user = User::factory()->create(['email_verified_at' => null]);

        $this->actingAs($user);

        $this->get('/app/mis-tramites')
            ->assertRedirect('email/verify');
    }
}
