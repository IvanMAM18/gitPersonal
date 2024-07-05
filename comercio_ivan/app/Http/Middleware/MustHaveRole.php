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

        // 'rol:comercio-admin'
        if (in_array('comercio-admin', $roles) && $user->esAdministradorDeComercio()) {
            return $next($request);
        }

        // rol:entidad-revisora-director
        if (in_array('entidad-revisora-director', $roles) && $user->esEntidadRevisoraDirector()) {
            return $next($request);
        }

        // rol:comercio-director
        if (in_array('comercio-director', $roles) && $user->esDirectorDeComercio()) {
            return $next($request);
        }

        // rol:comercio-admin-visor
        if (in_array('comercio-admin-visor', $roles) && $user->esAdministradorDeComercioVisor()) {
            return $next($request);
        }

        if ($request->wantsJson()) {
            return response('No Authorizado', 403);
        }

        return redirect('/app');
    }
}
