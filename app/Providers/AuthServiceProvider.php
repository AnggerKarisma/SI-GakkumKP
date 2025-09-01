<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Kendaraan;
use App\Models\User;
use App\Policies\VehiclePolicy;
use App\Policies\UserPolicy;

class AuthServiceProvider extends ServiceProvider
{

    protected $policies = [
        // Daftarkan policy Anda di sini
        Kendaraan::class => VehiclePolicy::class,
        User::class => UserPolicy::class,
        
    ];
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
