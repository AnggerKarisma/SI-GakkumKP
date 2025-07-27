<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    
    Route::post('/admin/create-account', [UserController::class, 'createAccountByAdmin']);
    Route::put('/admin/account/{id}', [UserController::class, 'updateAccount']);
    Route::delete('/admin/account/{id}', [UserController::class, 'deleteAccount']);
    Route::get('/admin/accounts', [UserController::class, 'showAllAccounts']);
    Route::get('/admin/users', [UserController::class, 'getAllUsers']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/kendaraan', [KendaraanController::class, 'index']);
    Route::get('/kendaraan/available', [KendaraanController::class, 'getAvailableVehicles']);
    Route::get('/kendaraan/filter', [KendaraanController::class, 'filter']);
    Route::get('/kendaraan/{id}', [KendaraanController::class, 'show']);
    
    Route::middleware('admin')->group(function () {
        Route::post('/kendaraan', [KendaraanController::class, 'store']);
        Route::put('/kendaraan/{id}', [KendaraanController::class, 'update']);
        Route::delete('/kendaraan/{id}', [KendaraanController::class, 'destroy']);
        Route::patch('/kendaraan/{id}/status', [KendaraanController::class, 'updateStatus']);
    });
});

Route::prefix('pinjam')->group(function () {
    Route::get('/', [PinjamController::class, 'index']);
    Route::post('/', [PinjamController::class, 'store']);
    Route::get('/active', [PinjamController::class, 'getActive']);
    Route::get('/overdue', [PinjamController::class, 'getOverdue']);
    Route::post('/return/{id}', [PinjamController::class, 'returnVehicle']);
    Route::post('/update-kendaraan-status', [PinjamController::class, 'updateKendaraanStatus']);
    Route::post('/generate-report', [PinjamController::class, 'generateReport']);
    Route::get('/user/{userId}', [PinjamController::class, 'getByUser']);
    Route::get('/kendaraan/{kendaraanId}', [PinjamController::class, 'getByKendaraan']);
    Route::get('/{id}', [PinjamController::class, 'show']);
    Route::delete('/{id}', [PinjamController::class, 'destroy']);
});

Route::prefix('pajak')->group(function () {
    Route::get('/', [PajakController::class, 'index']);
    Route::post('/', [PajakController::class, 'store']);
    Route::get('/expired', [PajakController::class, 'getExpired']);
    Route::get('/expiring-soon', [PajakController::class, 'getExpiringSoon']);
    Route::post('/bulk-update', [PajakController::class, 'bulkUpdate']);
    Route::get('/kendaraan/{kendaraanId}', [PajakController::class, 'getByKendaraan']);
    Route::get('/{id}', [PajakController::class, 'show']);
    Route::put('/{id}', [PajakController::class, 'update']);
    Route::delete('/{id}', [PajakController::class, 'destroy']);
});