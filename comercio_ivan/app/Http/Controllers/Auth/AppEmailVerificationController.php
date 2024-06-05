<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\EmailVerification;
use App\Models\TemporalUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppEmailVerificationController extends Controller
{
    public function verificarEmail(Request $request, $token)
    {
        $verification = EmailVerification::where('token', $token)->first();

        if ($verification) {
            $tempUser = TemporalUser::where('email', $verification->email)->first();

            if ($tempUser) {
                $user = User::create([
                    'nombre' => $tempUser->nombre,
                    'apellido_pat' => $tempUser->apellido_pat,
                    'apellido_mot' => $tempUser->apellido_mot,
                    'email' => $tempUser->email,
                    'password' => $tempUser->password,
                    'curp' => $tempUser->curp,
                    'rfc' => $tempUser->rfc,
                    'email_verified_at' => now(),
                    'telefono' => $tempUser->telefono,
                ]);

                $verification->delete();
                $tempUser->delete();

                Auth::loginUsingId($user->id);

                return redirect('/app/mis-tramites')->with('success', 'Tu cuenta ha sido verificada, utiliza tus credenciales para iniciar sesión.');
            }

            return 'Token inválido';
            // return redirect('/app')->with('error', 'No se ha encontrado ningún usuario temporal correspondiente.');
        }

        return 'Token inválido';
        // return redirect('/app')->with('error', 'El token de verificación no es válido.');
    }

    // no hay nada de seguridad en estas ruta.
    public function update($token)
    {
        $verification = EmailVerification::where('token', $token)->first();

        if ($verification != null) {
            $tempUser = TemporalUser::where('email', $verification->email)->first();
            $user = TemporalUser::where('curp', $tempUser->curp)->first();

            // en este caso el usuario ya existe en la base de datos, pero tiene otro email
            if ($user != null) {
                [$nombre, $dominio] = explode('@', $user->email);
                $primera_letra = substr($nombre, 0, 1);
                $ultima_letra = substr($nombre, -1, 1);
                $asteriscos = str_repeat('*', strlen($nombre) - 2);
                $email_ofuscado = $primera_letra.$asteriscos.$ultima_letra.'@'.$dominio;

                return 'Este usuario ya existe, fue registrado con el email '.$email_ofuscado.'. debes crear una cuenta con este email en la app para poder verificarla.';
            }

            if ($tempUser) {
                $user = User::create([
                    'nombre' => $tempUser->nombre,
                    'apellido_pat' => $tempUser->apellido_pat,
                    'apellido_mot' => $tempUser->apellido_mot,
                    'email' => $tempUser->email,
                    'password' => $tempUser->password,
                    'curp' => $tempUser->curp,
                    'rfc' => $tempUser->rfc,
                    'email_verified_at' => now(),
                    'telefono' => $tempUser->telefono,
                ]);

                $verification->delete();
                $tempUser->delete();

                Auth::loginUsingId($user->id);

                return redirect('/verification-in-app-completa')->with('success', 'Tu cuenta ha sido verificada, puedes volver a la app.');
            }

            return 'Token inválido :1';
            // return redirect('/app')->with('error', 'No se ha encontrado ningún usuario temporal correspondiente.');
        }

        return 'Token inválido :2';
        // return redirect('/app')->with('error', 'El token de verificación no es válido.');
    }

    /**
     * Regresa una vista para la app mobile diciendole que ya se verifico el correo electronico.
     */
    public function show()
    {
        return view('verification-in-app-completa');
    }
}
