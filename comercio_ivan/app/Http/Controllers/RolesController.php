<?php

namespace App\Http\Controllers;

use App\Models\Roles;

class RolesController extends Controller
{
    /**
     * Regresa todos los roles.
     */
    public function index()
    {
        return Roles::all();
    }
}
