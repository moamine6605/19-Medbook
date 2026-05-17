<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use Illuminate\Http\Request;

// Public routes for landing page
Route::get('/doctors/featured', [DoctorController::class, 'featured']);
Route::get('/stats/public', [DoctorController::class, 'publicStats']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::get('/status', function () {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'ok',
        'environment' => app()->environment(),
    ]);
});
