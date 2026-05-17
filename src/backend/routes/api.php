<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\DoctorDashboardController;
use App\Http\Controllers\PatientController;
use Illuminate\Http\Request;

// Public routes for landing page
Route::get('/doctors/featured', [DoctorController::class, 'featured']);
Route::get('/stats/public', [DoctorController::class, 'publicStats']);

// Public routes for booking page
Route::get('/specialties', [DoctorController::class, 'specialties']);
Route::get('/doctors', [DoctorController::class, 'bySpecialty']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('jwt.auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Patient dashboard routes
    Route::get('/patient/stats', [PatientController::class, 'stats']);
    Route::get('/patient/appointments', [PatientController::class, 'appointments']);
    Route::post('/patient/appointments', [PatientController::class, 'store']);
    Route::put('/patient/appointments/{id}', [PatientController::class, 'update']);
    Route::delete('/patient/appointments/{id}', [PatientController::class, 'destroy']);
    Route::get('/patient/activity', [PatientController::class, 'activity']);

    // Doctor dashboard routes
    Route::get('/doctor/stats', [DoctorDashboardController::class, 'stats']);
    Route::get('/doctor/appointments/today', [DoctorDashboardController::class, 'todayAppointments']);
    Route::get('/doctor/patients/recent', [DoctorDashboardController::class, 'recentPatients']);
    Route::get('/doctor/monthly-summary', [DoctorDashboardController::class, 'monthlySummary']);

    // Admin dashboard routes
    Route::get('/admin/stats', [AdminDashboardController::class, 'stats']);
    Route::get('/admin/analytics/appointments', [AdminDashboardController::class, 'appointmentsAnalytics']);
    Route::get('/admin/analytics/revenue', [AdminDashboardController::class, 'revenueAnalytics']);
    Route::get('/admin/doctors/top', [AdminDashboardController::class, 'topDoctors']);
    Route::get('/admin/activity', [AdminDashboardController::class, 'activity']);
    Route::get('/admin/appointments', [AdminDashboardController::class, 'appointments']);
    Route::get('/admin/patients', [AdminDashboardController::class, 'patients']);
    Route::get('/admin/doctors', [AdminDashboardController::class, 'doctors']);
    Route::post('/admin/patients', [AdminDashboardController::class, 'storePatient']);
    Route::post('/admin/doctors', [AdminDashboardController::class, 'storeDoctor']);
    Route::post('/admin/appointments', [AdminDashboardController::class, 'storeAppointment']);
});

Route::get('/status', function () {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'ok',
        'environment' => app()->environment(),
    ]);
});
