<?php

use App\Http\Controllers\AICommunicationController;
use App\Http\Controllers\AIMonitoringController;
use App\Http\Controllers\Api\EmailController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\SyncOrchestratorController;
use App\Http\Controllers\EmailResponseController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:api');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
});

Route::prefix('communication')->group(function () {
    // ✅ NEW: AI Dashboard View (HTML)
    Route::get('/ai-dashboard', [AICommunicationController::class, 'aiDashboard'])
        ->name('communication.ai-dashboard');

    // ✅ NEW: Single Message Analysis (HTML + JSON)
    Route::get('/ai-message/{message_id}', [AICommunicationController::class, 'analyzeSingleMessage'])
        ->name('communication.ai-message');

});

// Email API (JSON) - authenticated
Route::prefix('emails')->middleware('auth:api')->group(function () {
    Route::get('/', [EmailController::class, 'index'])->name('emails.index');
    Route::get('/{id}', [EmailController::class, 'show'])->whereNumber('id')->name('emails.show');
});

// Public compatibility route used by frontend dev server: /api/email/messages
// This mirrors the EmailController@index response but is left public for local dev convenience.
Route::get('email/messages', [EmailController::class, 'index'])->name('email.messages');

// V5 API endpoint with enhanced AI analysis structure
Route::get('email/messages/v5', [\App\Http\Controllers\Api\EmailControllerV5::class, 'index'])->name('email.messages.v5');

// Sync Orchestrator Routes
Route::prefix('sync')->group(function () {
    Route::post('/mail', [SyncOrchestratorController::class, 'syncMail'])
        ->name('sync.mail');

    Route::post('/ai', [SyncOrchestratorController::class, 'syncAi'])
        ->name('sync.ai');

    Route::post('/ai/{id}', [SyncOrchestratorController::class, 'syncAiById'])
        ->whereNumber('id')
        ->name('sync.ai.by-id');

    Route::get('/status', [SyncOrchestratorController::class, 'status'])
        ->name('sync.status');

    // Cancel sync operation - only release lock, do not stop in-progress tasks
    Route::post('/cancel', [SyncOrchestratorController::class, 'cancel'])
        ->name('sync.cancel');
});

// Incoming email webhook / responder
Route::post('/email/respond', [EmailResponseController::class, 'respond'])
    ->name('email.respond');
