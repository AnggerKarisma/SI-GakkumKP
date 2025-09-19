<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Kendaraan;
use App\Models\User;
use App\Models\Pajak;
use App\Models\Pinjam;
use App\Policies\VehiclePolicy;
use App\Policies\UserPolicy;
use App\Policies\TaxPolicy;
use App\Policies\BorrowPolicy;

class AuthServiceProvider extends ServiceProvider
{

    protected $policies = [
        // Daftarkan policy Anda di sini
        Kendaraan::class => VehiclePolicy::class,
        User::class => UserPolicy::class,
        Pajak::class => TaxPolicy::class,
        Pinjam::class => BorrowPolicy::class,
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
        Gate::define('update-vehicle', [VehiclePolicy::class, 'update']);
        Gate::define('delete-vehicle', [VehiclePolicy::class, 'delete']);
        Gate::define('view-vehicle', [VehiclePolicy::class, 'view']);
        Gate::define('borrow-vehicle', [VehiclePolicy::class, 'borrow']);

        Gate::define('create-tax', [TaxPolicy::class, 'create']);
        Gate::define('view-detail-tax', [TaxPolicy::class, 'view']);
        Gate::define('update-tax', [TaxPolicy::class, 'update']);
        Gate::define('delete-tax', [TaxPolicy::class, 'delete']);
        
        Gate::define('get-borrow-index', [BorrowPolicy::class, 'viewAny']);
        Gate::define('return', [BorrowPolicy::class, 'returnVehicle']);
    }
}
