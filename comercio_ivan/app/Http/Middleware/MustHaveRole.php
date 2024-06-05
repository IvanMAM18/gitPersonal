<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class MustHaveRole
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, ...$args)
    {
        $user = $request->user();

        $roles = $args;


        // 'rol:superadmin'
        if (in_array('superadmin', $roles) && $user->esSuperAdmin()) {
            return $next($request);
        }

        // 'rol:entidad-revisora'
        if (in_array('entidad-revisora', $roles) && ($user->esEntidadRevisora() || $user->esEntidadRevisoraDirector())) {
            return $next($request);
        }

        // 'rol:persona'
        if (in_array('persona', $roles) && $user->esPersona()) {
            return $next($request);
        }

        // 'rol:admin-comercio'
        if (in_array('admin-comercio', $roles) && $user->esAdministradorDeComercio()) {
            return $next($request);
        }

        // rol:director-entidad-revisora
        if (in_array('director-entidad-revisora', $roles) && $user->esEntidadRevisoraDirector()) {
            return $next($request);
        }

        // rol:director-comercio
        if (in_array('director-comercio', $roles) && $user->esDirectorDeComercio()) {
            return $next($request);
        }

        // rol:admin-comercio-visor
        if (in_array('admin-comercio-visor', $roles) && $user->esAdministradorDeComercioVisor()) {
            return $next($request);
        }

        if ($request->wantsJson()) {
            return response('No Authorizado', 403);
        }

        return redirect('/app');
    }
}
