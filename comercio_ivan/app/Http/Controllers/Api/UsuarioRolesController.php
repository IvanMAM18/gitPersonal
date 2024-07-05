<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UsuarioRolesController extends Controller
{
    /**
     * Actualiza los roles del usuario.
     */
    public function update(User $user, Request $request)
    {
        $this->authorize('update:usuarios');

        $data = $request->validate([
            'roles' => ['required', 'array'],
        ]);

        $user->roles()->sync($data['roles']);
    }
}
