<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionsController extends Controller
{
    /**
     * Regresa los permisos del sistema.
     */
    public function index(Request $request)
    {
        $this->authorize('index:permisos');

        return Permission::withCount('roles')
            ->when($request->has('search_key'), function ($query) use ($request) {
                $query->where('name', 'ilike', '%' . $request->input('search_key') . '%');
            })
            ->orderBy('id')
            ->paginate(page: $request->input('current_page'), perPage: $request->input('per_page'));
    }

    /**
     * Crear un nuevo permiso.
     */
    public function store(Request $request)
    {
        $this->authorize('store:permisos');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'label' => ['required', 'string', 'max:255', 'unique:permissions,label'],
        ]);

        Permission::create($data);
    }

    /**
     * Actualizar un permiso.
     */
    public function update(Permission $permission, Request $request)
    {
        $this->authorize('update:permisos');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'label' => ['required', 'string', 'max:255', 'unique:permissions,label,' . $permission->id],
        ]);

        $permission->update($data);
    }

    /**
     * Eliminar un permiso.
     */
    public function destroy(Permission $permission)
    {
        $this->authorize('delete:permisos');
        $permission->delete();
    }
}
