<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Rules\CurpRule;
use App\Rules\ValidateRFC;
use Illuminate\Http\Request;
use App\Models\User;

class UsuariosController extends Controller
{
    /**
     * Regresa la lista de todos los usuarios.
     */
    public function index(Request $request)
    {
        $this->authorize('index:usuarios');

        return User::with(['roles:id,nombre,label', 'entidad_revision:id,nombre'])
            ->conNombreCompleto()
            ->search($request->all())
            ->orderBy('id')
            ->paginate(page: $request->input('page'));
    }

    /**
     * Guarda un usuario en la base de datos.
     */
    public function store(Request $request)
    {
        $this->authorize('store:usuarios');

        $data = $request->validate([
            'email' => ['required', 'string', 'max:255', 'iunique:users,email'],
            'telefono' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:6', 'max:32', 'confirmed'],
            'nombre' => ['required', 'string', 'max:255'],
            'apellido_pat' => ['required', 'string', 'max:255'],
            'apellido_mot' => ['nullable', 'string', 'max:255'],
            'rfc' => ['nullable', 'string', 'max:255', 'unique:users,rfc'],
            'curp' => ['nullable', 'string', 'max:255', 'unique:users,curp'],
            'regimen_fiscal' => ['nullable', 'numeric'],
            'entidad_revision_id' => ['nullable', 'numeric', 'exists:entidad_revision,id'],
        ]);

        User::create($data);
    }

    /**
     * Actualiza un usuario en la base de datos.
     */
    public function update(User $user, Request $request)
    {
        $this->authorize('update:usuarios');

        $data = $request->validate([
            'email' => ['required', 'string', 'max:255', 'iunique:users,email,' . $user->id],
            'telefono' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:6', 'max:32', 'confirmed'],
            'nombre' => ['required', 'string', 'max:255'],
            'apellido_pat' => ['required', 'string', 'max:255'],
            'apellido_mot' => ['nullable', 'string', 'max:255'],
            'rfc' => ['nullable', 'string', 'max:255', new ValidateRFC, 'unique:users,rfc,' . $user->id],
            'curp' => ['nullable', 'string', 'max:255', new CurpRule, 'unique:users,curp,' . $user->id],
            'regimen_fiscal' => ['nullable', 'numeric'],
            'entidad_revision_id' => ['nullable', 'numeric', 'exists:entidad_revision,id'],
        ]);

        if (is_null($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);
    }

    public function destroy(User $user)
    {
        $this->authorize('delete:usuarios');

        $user->delete();
    }
}
