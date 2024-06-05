<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  string|null  ...$guards
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                if (currentUser()->esSuperAdmin()) {
                    return redirect('/app/admin-cruds');
                }

                if (currentUser()->esAdministradorDeComercio()) {
                    return redirect('/app/comercio-admin');
                }

                if (currentUser()->esPersona()) {
                    return redirect('/app/mis-tramites');
                }

                return redirect(RouteServiceProvider::HOME);
            }
        }

        return $next($request);
    }
}
