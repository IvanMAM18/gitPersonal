<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    public function test_can_see_the_registration_page()
    {
        $this->get('/register')
            ->assertStatus(200);
    }

    public function test_required_fields_on_registration()
    {
        $this->post('/register')
            ->assertSessionHasErrors(['nombre', 'apellido_pat', 'email', 'password', 'rfc', 'curp'])
            ->assertSessionDoesntHaveErrors(['apellido_mot']);
    }

    public function test_password_must_match_confirmation()
    {
        $this->post('/register', [
            'nombre' => 'Juan',
            'apellido_pat' => 'Perez',
            'apellido_mot' => '',
            'email' => 'example@email.com',
            'password' => 'secret',
            'password_confirmation' => '',
            'rfc' => 'test-rfc-ok',
            'curp' => 'AEAJ920224HBSRTR06',
        ])
            ->assertSessionHasErrors(['password']);
    }

    public function test_password_must_have_eight_characters()
    {
        $this->post('/register', [
            'nombre' => 'Juan',
            'apellido_pat' => 'Perez',
            'apellido_mot' => '',
            'email' => 'example@email.com',
            'password' => '1234567',
            'password_confirmation' => '1234567',
            'rfc' => 'test-rfc-ok',
            'curp' => 'AEAJ920224HBSRTR06',
        ])
            ->assertSessionHasErrors(['password']);
    }

    public function test_rfc_is_invalid()
    {
        $this->post('/register', [
            'nombre' => 'Juan',
            'apellido_pat' => 'Perez',
            'apellido_mot' => '',
            'email' => 'example@email.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
            'rfc' => 'test-rfc-fail',
            'curp' => 'AEAJ920224HBSRTR06',
        ])
            ->assertSessionHasErrors(['rfc']);
    }

    public function test_curp_is_invalid()
    {
        $this->post('/register', [
            'nombre' => 'Juan',
            'apellido_pat' => 'Perez',
            'apellido_mot' => '',
            'email' => 'example@email.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
            'rfc' => 'test-rfc-ok',
            'curp' => 'asdadasdasd',
        ])
            ->assertSessionHasErrors(['curp']);
    }

    public function test_email_is_invalid()
    {
        $this->post('/register', [
            'nombre' => 'Juan',
            'apellido_pat' => 'Perez',
            'apellido_mot' => '',
            'email' => 'example_email.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
            'rfc' => 'test-rfc-ok',
            'curp' => 'AEAJ920224HBSRTR06',
        ])
            ->assertSessionHasErrors(['email']);
    }

    public function test_email_is_not_taken()
    {
        $this->post('/register', [
            'nombre' => 'Juan',
            'apellido_pat' => 'Perez',
            'apellido_mot' => '',
            'email' => 'superadmin@gmail.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
            'rfc' => 'test-rfc-ok',
            'curp' => 'AEAJ920224HBSRTR06',
        ])
            ->assertSessionHasErrors(['email']);
    }

    public function test_rfc_curp_together_must_be_unique()
    {
        User::factory()->create([
            'id' => 10000,
            'rfc' => 'test-rfc-ok',
            'curp' => 'AEAJ920224HBSRTR06',
        ]);

        $this->post('/register', [
            'nombre' => 'Juan',
            'apellido_pat' => 'Perez',
            'apellido_mot' => '',
            'email' => 'example@email.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
            'rfc' => 'test-rfc-ok',
            'curp' => 'AEAJ920224HBSRTR06',
        ])
            ->assertSessionHasErrors(['rfc_curp']);
    }

    public function test_can_authentiate_user()
    {
        $response = $this->post('/register', [
            'nombre' => 'Juan',
            'apellido_pat' => 'Perez',
            'apellido_mot' => '',
            'email' => 'example@example.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
            'rfc' => 'test-rfc-ok',
            'curp' => 'AEAJ920224HBSRTR06',
        ])->assertStatus(200)
            ->assertJson(['redirect' => 'correo-de-verificacion-enviado']);

        $this->assertAuthenticated()->withoutExceptionHandling();
    }
}
