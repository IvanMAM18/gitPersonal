<?php

namespace App\Http\Controllers;

use App\Models\UsuarioRequisito;

class RequisitoController extends Controller
{
    /**
     * Regresa los requisitos para los usuarios.
     */
    public function all()
    {
        // Esto deberia ser currentUser()->requisitos()->get();
        $usuarioRequisitos = UsuarioRequisito::with('requisito')
            ->where('user_id', currentUser()->id)
            ->get();

        return response()->json([
            'ok' => true,
            'requisitos' => $usuarioRequisitos,
        ]);
    }
}
