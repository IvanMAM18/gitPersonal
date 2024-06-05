<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\EmailVerification;
use App\Models\TemporalUser;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Auth;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('guest')
            ->except('logout');
    }

    /**
     * Este metodo es llamado por laravel despues de tener una autenticacion con exito.
     */
    public function authenticated(Request $request)
    {
        $user = $request->user();

        if ($user->esPersona()) {
            return response(['redirect' => '/app/mis-tramites']);
        }
        if ($user->esEntidadRevisora()) {
            return response(['redirect' => '/app/entidad-home']);
        }
        if ($user->esSuperAdmin()) {
            return response(['redirect' => '/app/admin-cruds']);
        }
        if ($user->esEntidadRevisoraDirector()) {
            return response(['redirect' => '/app/resolutivos']);
        }
        if ($user->esAdministradorDeComercio() || $user->esDirectorDeComercio() || $user->esAdministradorDeComercioVisor()) {
            return response(['redirect' => '/app/comercio-admin']);
        }

        // Cualquier otra cosa ya que desconozco que pase.
        return response(['redirect' => '/app/mis-tramites']);
    }

    /**
     * Este metodo es llamado por laravel cuando se cierra sesión.
     */
    public function loggedOut()
    {
        return redirect('login');
    }

    /**
     * Validaciones del email
     */
    protected function validateLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'El campo correo electrónico es obligatorio.',
            'email.email' => 'El campo correo electrónico no es una dirección valida.',
            'password.required' => 'El campo contraseña es obligatorio.',
        ]);
    }

    /**
     * Nos aseguramos de que el input sea lowercase para compararlo con lo de la base de datos.
     */
    protected function credentials(Request $request)
    {
        $credentials = [
            'email' => strtolower($request->input($this->username())),
            'password' => $request->get('password'),
        ];
        return $credentials;
    }
}
