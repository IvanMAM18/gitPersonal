<?php

namespace App\Providers;

use App\Helpers\ClavesScian;
use App\Services\CatastroGateway;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(CatastroGateway::class, function () {
            return new CatastroGateway($this->app['config']['services']['catastro'], $this->app['request']);
        });

        $this->app->singleton(ClavesScian::class, function () {
            return new ClavesScian;
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Model::preventLazyLoading(!app()->isProduction());
        Paginator::useBootstrap();

        // Extender la validacion unique para case-sensitive en postgres.
        Validator::extend('iunique', function ($attribute, $value, $parameters, $validator) {
            if (isset($parameters[1])) {
                [$connection] = $validator->parseTable($parameters[0]);
                $wrapped = DB::connection($connection)->getQueryGrammar()->wrap($parameters[1]);
                $parameters[1] = DB::raw("lower({$wrapped})");
            }
            return $validator->validateUnique($attribute, Str::lower($value), $parameters);
        }, trans('validation.iunique'));
    }
}
