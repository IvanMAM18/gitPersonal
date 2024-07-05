<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class TrabajadorFotoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['foto' => ['required', 'file', 'mimes:jpg,png,jpeg', 'max:500'],]);

        $foto = $request->file('foto');
        $ruta = $foto->store('trabajadores', 'public');
        
        return response()->json([
            'foto' => $ruta,
            'foto_url' => Storage::url($ruta, 'public'),
        ]);
    }

    public function index()
    {
        $ruta = URL::temporarySignedRoute(
            'trabajador-foto.store',
            now()->addHour(24)
        );

        return response()->json([
            'ruta' => $ruta,
        ]);
    }
}
