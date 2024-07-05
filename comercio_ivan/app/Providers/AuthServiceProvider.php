<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Permission;
use Exception;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        VerifyEmail::toMailUsing(function ($notifiable, $url) {
            return (new MailMessage())
                ->greeting('H.XVII Ayuntamiento de La Paz')
                ->salutation('Gracias')
                ->subject('Verifica tu dirección de correo')
                ->line('Da click al botón para verificar tu dirección de correo.')
                ->action('Verificar', $url);
        });

        $this->registerPolicies();

        if ($this->hasDatabaseConnection()) {


            // Dynamically register permissions with Laravel's Gate.
            foreach ($this->getPermissions() as $permission) {
                Gate::define($permission->label, function (User $user) use ($permission) {
                    return $user->hasPermission($permission);
                });
            }
        }
    }

    /**
     * Regresa todos los permisos con sus roles.
     */
    protected function getPermissions()
    {
        if (!Schema::hasTable('permissions')) {
            return [];
        }
        return cache()->remember('permissions-with-roles', now()->addDay(), function () {
            return Permission::with('roles')->get();;
        });
    }

    /**
     * Checa si hay coneccion a la base de datos.
     */
    protected function hasDatabaseConnection()
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (Exception $exception) {
            return false;
        }
    }
}
