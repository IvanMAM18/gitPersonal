<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Roles;
use Illuminate\Http\Request;

class RolesController extends Controller
{
    /**
     * Regresa los roles en el sistema, la api acepta el parametro all para regresar todos los roles,
     * si no se pasa el parametro regresara los roles paginados.
     */
    public function index(Request $request)
    {
        $this->authorize('index:roles');

        $query = Role::with('permissions')
            ->when($request->has('search_key'), function ($query) use ($request) {
                $query->where('nombre', 'ilike', '%' . $request->input('search_key') . '%');
            })
            ->orderBy('id');

        if ($request->has('all')) {
            return $query->get();
        }

        return $query->paginate(page: $request->input('current_page'), perPage: $request->input('per_page'));
    }

    /**
     * Crear un nuevo rol.
     */
    public function store(Request $request)
    {
        $this->authorize('store:roles');

        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'label' => ['required', 'string', 'max:255', 'unique:roles,label'],
            'descripcion' => ['sometimes', 'string', 'max:10000'],
        ]);

        Role::create($data);
    }

    /**
     * Actualizazr el rol dado.
     */
    public function update(Role $role, Request $request)
    {
        $this->authorize('update:roles');

        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'label' => ['required', 'string', 'max:255', 'unique:roles,label,' . $role->id],
            'descripcion' => ['sometimes', 'string', 'max:10000'],
        ]);

        $role->update($data);
    }

    /**
     * Eliminar rol dado.
     */
    public function destroy(Role $role)
    {
        $this->authorize('delete:roles');

        $role->delete();
    }
}
