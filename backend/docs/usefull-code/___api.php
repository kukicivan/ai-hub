<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HealthCheckController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\UserProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;


Log::info('routes/api.php');

// Health Check Route (public)
Route::get('/health', [HealthCheckController::class, 'check']);

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

// Public Routes (auth prefix)
Route::middleware(['web'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->name('verification.verify');
});

// Protected routes
Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/email/verification-notification', [AuthController::class, 'sendVerificationEmail']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Profile Routes (profile prefix)
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserProfileController::class, 'getProfile']);
        Route::put('/', [UserProfileController::class, 'updateProfile']);
        Route::post('/avatar', [UserProfileController::class, 'uploadAvatar']);
        Route::delete('/avatar', [UserProfileController::class, 'deleteAvatar']);
    });

    // User Management Routes
    Route::get('/users', [UserManagementController::class, 'index']);
    Route::post('/users', [UserManagementController::class, 'store']);
    Route::get('/users/{id}', [UserManagementController::class, 'show']);
    Route::put('/users/{id}', [UserManagementController::class, 'update']);
    Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);
    Route::post('/users/{id}/reset-password', [UserManagementController::class, 'resetPassword']);

    // User Types and Roles
    Route::get('/user-types', [UserManagementController::class, 'getUserTypes']);
    Route::get('/roles', [UserManagementController::class, 'getRoles']);
});
