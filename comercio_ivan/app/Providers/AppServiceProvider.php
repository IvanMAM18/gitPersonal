<?php

namespace App\Providers;

use App\Helpers\ClavesScian;
use App\Models\Model;
use App\Services\CatastroGateway;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

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
        //        Model::preventLazyLoading(!app()->isProduction());
        Paginator::useBootstrap();
    }
}
