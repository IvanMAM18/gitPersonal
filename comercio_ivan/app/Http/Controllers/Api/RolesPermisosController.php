<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RolesPermisosController extends Controller
{
    /**
     * Actualiza el rol dado con los permisos pasados en el request.
     */
    public function update(Role $role, Request $request)
    {
        $this->authorize('update:roles');

        $data = $request->validate([
            'permissions' => ['sometimes', 'array'],
        ]);

        $role->givePermissionTo($data['permissions']);
    }
}
