<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class Website
{
    public static function user()
    {
        $user = Auth::user();

        $direccion_notificacion = $user->direccionDeNotificacion ? ($user->direccionDeNotificacion->calle_principal.' '.$user->direccionDeNotificacion->numero_externo) : null;

        return [
            'id' => $user->id,
            'apellido_paterno' => $user->apellido_pat,
            'nombre' => $user->nombre,
            'apellido_materno' => $user->apellido_mot,
            'curp' => $user->curp,
            'rfc' => $user->rfc,
            'email' => $user->email,
            'direccion_notificacion' => $direccion_notificacion,
            'role_id' => $user->rol?->id ?? null,
            'role' => $user->rol?->nombre ?? 'Persona',
            'entidad_revision' => $user->entidad_revision?->id ?? null,
            'entidad_revision_nombre' => $user->entidad_revision?->nombre ?? '',
        ];
    }
}
