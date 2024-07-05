<?php

namespace App\Http\Controllers;

class ListaDeGirosComercialesController extends Controller
{
    public function index()
    {
        return view('layouts.giros-comerciales');
    }
}
