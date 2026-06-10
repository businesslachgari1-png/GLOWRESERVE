<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SalonController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\SalonManagementController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Google OAuth Routes
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Public Routes
Route::get('/salons', [SalonController::class, 'index']);
Route::get('/salons/{slug}', [SalonController::class, 'show']);
Route::get('/salons/{id}/reviews', [ReviewController::class, 'salonReviews']);
Route::get('/appointments/available-slots', [AppointmentController::class, 'getAvailableSlots']);

// Protected Routes - Client
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Appointments
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/my-appointments', [AppointmentController::class, 'myAppointments']);
    Route::post('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);

    // Reviews / review eligibility
    Route::get('/salons/{salonId}/completed-appointments', [AppointmentController::class, 'completedAppointmentsForSalon']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
});

// Protected Routes - Salon Owners
Route::middleware('auth:sanctum')->prefix('salon-management')->group(function () {
    Route::get('/my-salon', [SalonManagementController::class, 'mySalon']);
    Route::post('/salon', [SalonManagementController::class, 'storeSalon']);
    
    // Services
    Route::post('/services', [SalonManagementController::class, 'addService']);
    Route::put('/services/{id}', [SalonManagementController::class, 'updateService']);
    Route::delete('/services/{id}', [SalonManagementController::class, 'deleteService']);
    
    // Employees
    Route::post('/employees', [SalonManagementController::class, 'addEmployee']);
    
    // Appointments
    Route::get('/appointments', [SalonManagementController::class, 'salonAppointments']);
    Route::put('/appointments/{id}/status', [SalonManagementController::class, 'updateAppointmentStatus']);
});
