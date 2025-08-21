<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BorrowController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\TaxController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [UserController::class, 'register']);
Route::post('/registerSA',[UserController::class,'registerSA']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    
    Route::prefix('kendaraan')->group(function(){
        Route::get('/', [VehicleController::class, 'index']);
        Route::get('/available', [VehicleController::class, 'getAvailableVehicles']);
        Route::get('/filter', [VehicleController::class, 'filter']);
        Route::get('/{id}', [VehicleController::class, 'show']);
    });

    Route::prefix('pinjam')->group(function () {
        Route::get('/', [BorrowController::class, 'index']);
        Route::post('/', [BorrowController::class, 'store']);
        Route::get('/statistics', [BorrowController::class, 'getStatistics']); 
        Route::post('/return/{id}', [BorrowController::class, 'returnVehicle']);
        Route::post('/generate-report', [BorrowController::class, 'generateReport']);
        Route::get('/maintenance', [BorrowController::class, 'getMaintenanceList']);
        Route::post('/maintenance/{kendaraanId}', [BorrowController::class, 'setMaintenance']);
        Route::post('/maintenance/{kendaraanId}/complete', [BorrowController::class, 'completeMaintenance']);
        Route::get('/user/{userId}', [BorrowController::class, 'getByUser']);
        Route::get('/kendaraan/{kendaraanId}', [BorrowController::class, 'getByKendaraan']);
        Route::get('/{id}', [BorrowController::class, 'show']);
        Route::delete('/{id}', [BorrowController::class, 'destroy']);
    });
    
    Route::prefix('pajak')->group(function () {
        Route::get('/', [TaxController::class, 'index']);
        Route::post('/', [TaxController::class, 'store']);
        Route::get('/expired', [TaxController::class, 'getExpired']);
        Route::get('/expiring-soon', [TaxController::class, 'getExpiringSoon']);
        Route::post('/bulk-update', [TaxController::class, 'bulkUpdate']);
        Route::get('/kendaraan/{kendaraanId}', [TaxController::class, 'getByKendaraan']);
        Route::get('/{id}', [TaxController::class, 'show']);
        Route::put('/{id}', [TaxController::class, 'update']);
        Route::delete('/{id}', [TaxController::class, 'destroy']);
    });

    Route::middleware('admin')->group(function () {
        Route::put('/admin/account/{id}', [UserController::class, 'updateAccount']);
        Route::delete('/admin/account/{id}', [UserController::class, 'deleteAccount']);
        Route::get('/admin/accounts', [UserController::class, 'showAllAccounts']);
        Route::get('/admin/users', [UserController::class, 'getAllUsers']);

        Route::post('/kendaraan', [VehicleController::class, 'store']);
        Route::put('/kendaraan/{id}', [VehicleController::class, 'update']);
        Route::delete('/kendaraan/{id}', [VehicleController::class, 'destroy']);
        Route::patch('/kendaraan/{id}/status', [VehicleController::class, 'updateStatus']);

    });
    Route::middleware('superadmin')->group(function () {
        Route::post('/admin/create-account', [UserController::class, 'createAccountByAdmin']);
    });
});
