<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
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

    // Patient dashboard routes
    Route::get('/patient/stats', [PatientController::class, 'stats']);
    Route::get('/patient/appointments', [PatientController::class, 'appointments']);
    Route::get('/patient/activity', [PatientController::class, 'activity']);
});

Route::get('/status', function () {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'ok',
        'environment' => app()->environment(),
    ]);
});
