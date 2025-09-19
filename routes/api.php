<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BorrowController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\TaxController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [UserController::class, 'register']);
Route::post('/registerSA',[UserController::class,'registerSA']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'getDashboardStats']);

    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::put('/profile', [UserController::class, 'updateUserCoreData']);
    
    Route::prefix('kendaraan')->group(function(){
        Route::get('/', [VehicleController::class, 'index']);
        Route::get('/{kendaraan}', [VehicleController::class, 'show']);
        Route::post('/', [VehicleController::class, 'store']);
        Route::put('/{kendaraan}', [VehicleController::class, 'update']);
        Route::delete('/{kendaraan}', [VehicleController::class, 'destroy']);
        Route::patch('/{kendaraan}/status', [VehicleController::class, 'updateStatus']);
    });

    Route::prefix('pinjam')->group(function () {
        Route::get('/', [BorrowController::class, 'index']);
        Route::post('/', [BorrowController::class, 'store']);
        Route::get('/statistics', [BorrowController::class, 'getStatistics']); 
        Route::patch('/return/{pinjam}', [BorrowController::class, 'returnVehicle']);
        Route::post('/generate-report', [BorrowController::class, 'generateReport']);
        // Route::get('/maintenance', [BorrowController::class, 'getMaintenanceList']);
        // Route::post('/maintenance/{kendaraanId}', [BorrowController::class, 'setMaintenance']);
        // Route::post('/maintenance/{kendaraanId}/complete', [BorrowController::class, 'completeMaintenance']);
        // Route::get('/user/{userId}', [BorrowController::class, 'getByUser']);
        Route::get('/kendaraan/{kendaraanId}', [BorrowController::class, 'getByKendaraan']);
        Route::get('/{pinjam}', [BorrowController::class, 'show']);
        Route::delete('/{pinjam}', [BorrowController::class, 'destroy']);
    });
    
    Route::prefix('pajak')->group(function () {
        Route::get('/', [TaxController::class, 'index']);
        Route::post('/', [TaxController::class, 'store']);
        // Route::get('/expired', [TaxController::class, 'getExpired']);
        // Route::get('/expiring-soon', [TaxController::class, 'getExpiringSoon']);
        Route::post('/bulk-update', [TaxController::class, 'bulkUpdate']);
        Route::get('/kendaraan/{kendaraan}', [TaxController::class, 'getByKendaraan']);
        Route::get('/{pajak}', [TaxController::class, 'show']);
        Route::put('/{pajak}', [TaxController::class, 'update']);
        Route::delete('/{pajak}', [TaxController::class, 'destroy']);
    });

    Route::prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'getAllUsers']);
        Route::get('/users/{user}', [UserController::class, 'getOtherProfile']);
        Route::post('/users', [UserController::class, 'createAccountByAdmin']);
        Route::put('/users/{user}', [UserController::class, 'updateUserDetail']);
        Route::delete('/users/{user}', [UserController::class, 'deleteAccount']);
    });
    
    Route::prefix('report')->group(function () {
        Route::get('/borrowing', [ReportController::class, 'generateBorrowingReport']);
    });
});
