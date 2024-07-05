<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioPasswordController extends Controller
{
    /**
     * Actualiza el password del usuario.
     */
    public function update(User $user, Request $request)
    {
        $this->authorize('update:usuarios');

        $data = $request->validate([
            'password' => ['required', 'string', 'min:6', 'max:32', 'confirmed'],
        ]);

        $data['password'] = Hash::make($data['password']);

        $user->update($data);
    }
}
