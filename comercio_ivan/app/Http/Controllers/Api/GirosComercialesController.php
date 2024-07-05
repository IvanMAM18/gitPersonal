<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GiroComercial;
use Illuminate\Http\Request;

class GirosComercialesController extends Controller
{
    /**
     * Regresa los giros comerciales segun lo pida el request paginados o todos.
     */
    public function index(Request $request)
    {
        return GiroComercial::latest()
            ->search($request->all())
            ->when($request->has('page'), fn($query) => $query->paginate(perPage: $request->input('per_page')), fn($query) => $query->get());
    }
}
