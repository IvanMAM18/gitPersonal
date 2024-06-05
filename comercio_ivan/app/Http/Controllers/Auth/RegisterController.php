<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Rules\CurpRule;
use App\Rules\UsuarioUnicoVerificado;
use App\Rules\ValidateRFC;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Validar los campos.
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'nombre' => 'required|string',
            'apellido_pat' => 'required|string',
            'apellido_mot' => 'nullable',
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'rfc' => ['required', 'string', new ValidateRFC()],
            'curp' => ['required', 'string', new CurpRule()],
        ], [
            'apellido_pat.required' => 'El campo apellido paterno es obligatorio.',
            'email.required' => 'El campo correo electrónico es obligatorio.',
            'password.required' => 'El campo contraseña es obligatorio.',
            'password.min' => 'El campo contraseña debe contener al menos 8 caracteres.',
            'password.confirmed' => 'El campo confirmación de contraseña no coincide.',
        ])
            ->after([
                new UsuarioUnicoVerificado($data),
            ]);
    }

    /**
     * Una vez que ya se completo el registro.
     */
    protected function registered($request, $user)
    {
        return response(['redirect' => 'correo-de-verificacion-enviado']);
    }

    /**
     * Create a new user instance after a valid registration.
     */
    protected function create(array $data)
    {
        return User::create([
            'nombre' => $data['nombre'],
            'email' => trim(strtolower($data['email'])),
            'apellido_pat' => $data['apellido_pat'],
            'apellido_mot' => isset($data['apellido_mot']) ? $data['apellido_mot'] : null,
            'rfc' => strtoupper($data['rfc']),
            'curp' => strtoupper($data['curp']),
            'role_id' => null,
            'password' => Hash::make($data['password']),
        ]);
    }
}
