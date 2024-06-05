<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class UserRoleTest extends TestCase
{
    public function test_redirect_to_admin_cruds_page_if_the_user__is_super_admin()
    {
        $user = User::find(1);
        $this->assertTrue($user->esSuperAdmin());
        $this->actingAs($user);
        $this->get('/login')
            ->assertRedirect('/app/admin-cruds');
    }

    public function test_redirect_to_app_page_if_the_user_is_entidad_revisora()
    {
        $user = User::find(2);
        $this->assertTrue($user->esEntidadRevisora());
        $this->actingAs($user);
        $this->get('/login')
            ->assertRedirect('/app');
    }

    public function test_redirect_to_comercio_admin_page_if_the_user_is_administrador_de_comercio()
    {
        $user = User::find(6);
        $this->assertTrue($user->esAdministradorDeComercio());
        $this->actingAs($user);
        $this->get('/login')
            ->assertRedirect('/app/comercio-admin');
    }

    public function test_redirect_to_mis_tramites_page_if_the_user_is_persona()
    {
        $user = User::find(7);
        $this->assertTrue($user->esPersona());
        $this->actingAs($user);
        $this->get('/login')
            ->assertRedirect('/app/mis-tramites');
    }
}
