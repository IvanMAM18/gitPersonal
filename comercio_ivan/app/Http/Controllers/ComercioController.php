<?php

namespace App\Http\Controllers;

use App\Models\Direccion;
use App\Models\PersonaMoral;
use Illuminate\Support\Facades\Auth;

class ComercioController extends Controller
{
    public function login()
    {
        return view('comercio.auth');
    }

    public function home()
    {
        return view('comercio.home');
    }

    public function index()
    {
        $user_id = Auth::user()->id;
        $personas_morales = PersonaMoral::where('persona_id', '=', $user_id)->get();
        if (currentUser()->esSuperAdmin()) {
            return redirect('/app/admin-cruds');
        }

        return $personas_morales;
    }

    public function mis_negocios()
    {
        /**
         * Lo óptimo sería enviar los giros con algo como esto
         * PD: este código no es funcional, son ejemplos.
         * $mis_negocios = Negocio::where('person_id', auth()->user->id)->->get();
         */
        $mis_negocios = [];
        if (currentUser()->esSuperAdmin()) {
            return redirect('/app/admin-cruds');
        }

        return view('comercio.mis-negocios', compact('mis_negocios'));
    }

    public function registro_negocio()
    {
        /**
         * $giros = GiroComercial::where('anio', 2022)->get();
         * $personas_morales = PersonaMoral::where('person_id', auth()->user->id)->get();
         */
        $giros = [];
        $personas_morales = [];
        if ($user->esSuperAdmin()) {
            return redirect('/app/admin-cruds');
        }

        return view('comercio.registrar-negocio', compact('giros', 'personas_morales'));
    }

    public function detalles_negocio($negocio_id)
    {
        /**
         *$negocio = Negocio::with('revisiones')->where('id', $negocio_id)->first();
         */
        $negocio = null;
        if ($user->esSuperAdmin()) {
            return redirect('/app/admin-cruds');
        }

        return view('comercio.detalles-negocio', compact('negocio'));
    }

    public function render_react_router_root()
    {
        $user = currentUser();
        if ($user->esSuperAdmin()) {
            return redirect('/app/admin-cruds');
        }

        // se envía a front la calle principal y numero externo de la dirección
        // de notificación del usuario, si existe
        $direccion_notificacion = null;
        $direccion_notificacion_ref = Direccion::find($user->direccion_de_notificacion_id);
        if ($direccion_notificacion_ref != null) {
            $direccion_notificacion = $direccion_notificacion_ref->calle_principal.' '.$direccion_notificacion_ref->numero_externo;
        }

        return view('comercio.react_router_root', compact('user', 'direccion_notificacion'));
    }
}
