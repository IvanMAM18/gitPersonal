<?php

namespace App\Http\Controllers;

use App\Models\EmailVerification;
use App\Models\TemporalUser;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ExternalServiceController extends Controller
{
    public function register(Request $request)
    {
        /**
         * Revisamos si el email ya se encuentra registrado, si
         * es así se envía la vinculación automáticamente
         */
        $user = User::where('email', $request->input('email'))->first();
        if ($user != null) {
            return response()->json([
                'ok' => true,
                'already_registered' => true,
                'verification_email_sent' => false,
            ]);
        }

        $rules = [
            'nombre' => 'required|string|max:255',
            'apellido_1' => 'required|string|max:255',
            'telefono' => 'required|string|max:18',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|max:50',
            'confirm_password' => 'required|string|min:8|max:50',
            'curp' => [
                'required',
                'string',
                'unique:users',
                'regex:/^[A-Z]{4}\d{6}[H,M][A-Z]{5}\d{2}$/i',
                'size:18',
            ],
        ];

        $messages = [
            'curp.regex' => 'Formato de CURP invádlia.',
            'curp.size' => 'La CURP debe tener 18 caracteres.',
            'curp.unique' => 'La CURP ya está en uso.',
            'rfc.regex' => 'Formato del RFC inválido.',
            'rfc.size' => 'El RFC debe tener 13 caracteres.',
            'rfc.unique' => 'El RFC ya está en uso.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'ok' => false,
                'already_registered' => false,
                'verification_email_sent' => false,
                'errors' => $validator->errors(),
            ], 200);
        }

        /**
         * Borramos el registro temporal si existe, con esto si el registro
         * se dio con un mal RFC o CURP, se puede volver a intentar
         */
        TemporalUser::where('email', $request->input('email'))->delete();

        $temporal_user = TemporalUser::create([
            'nombre' => $request->nombre,
            'apellido_pat' => $request->apellido_1,
            'apellido_mot' => $request->apellido_2,
            'email' => strtolower($request->email),
            'rfc' => strtoupper($request->rfc),
            'password' => Hash::make($request->password),
            'curp' => strtoupper($request->curp),
            'telefono' => $request->telefono,
        ]);

        $verification_email_sent = false;

        try {
            $token = sha1(time());
            EmailVerification::create([
                'email' => $temporal_user->email,
                'token' => $token,
                'expires_at' => Carbon::now()->addDays(1),
            ]);
            $temporal_user->enviarEmailVerificacionNotification($token, 'email/app/verificacion');

            $verification_email_sent = true;
        } catch (\Throwable $th) {
        }

        return response()->json([
            'ok' => true,
            'already_registered' => false,
            'verification_email_sent' => $verification_email_sent,
        ]);
    }

    public function registerVerified(Request $request)
    {
        $user = User::withTrashed()->where('email', $request->input('email'))->first();
        if ($user != null) {
            return response()->json([
                'ok' => true,
                'already_registered' => true,
                'active' => $user->deleted_at == null,
                'verification_email_sent' => false,
            ]);
        }

        $rules = [
            'nombre' => 'required|string|max:255',
            'apellido_1' => 'required|string|max:255',
            'telefono' => 'required|string|max:18',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|max:50',
            'confirm_password' => 'required|string|min:8|max:50',
            'curp' => [
                'required',
                'string',
                'unique:users',
                'regex:/^[A-Z]{4}\d{6}[H,M][A-Z]{5}\d{2}$/i',
                'size:18',
            ],
        ];

        $messages = [
            'curp.regex' => 'Formato de CURP invádlia.',
            'curp.size' => 'La CURP debe tener 18 caracteres.',
            'curp.unique' => 'La CURP ya está en uso.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'ok' => false,
                'already_registered' => false,
                'verification_email_sent' => false,
                'errors' => $validator->errors(),
            ], 200);
        }

        // creamos el usuario final
        $user = User::create([
            'nombre' => $request->nombre,
            'apellido_pat' => $request->apellido_1,
            'apellido_mot' => $request->apellido_2,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'curp' => strtoupper($request->curp),
            'telefono' => $request->telefono,
        ]);

        if ($request->rfc != null && $request->rfc != '') {
            $user->rfc = strtoupper($request->rfc);
            $user->save();
        }

        $token = sha1(time());

        $verification = EmailVerification::create([
            'email' => $user->email,
            'token' => $token,
            'expires_at' => Carbon::now()->addDays(1),
        ]);

        // simulamos verificación borrando el token
        $verification->deleted_at = Carbon::now();

        return response()->json([
            'ok' => true,
            'registered' => true,
            'active' => $user->deleted_at == null,
            'already_registered' => false,
            'verification_email_sent' => false,
        ]);
    }

    public function login(Request $request)
    {
    }
}
