<?php

use App\Http\Controllers\AICommunicationController;
use App\Http\Controllers\AIMonitoringController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmailController;
use App\Http\Controllers\Api\EmailControllerV5;
use App\Http\Controllers\Api\HealthCheckController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\TodoController;
use App\Http\Controllers\EmailResponseController;
use App\Http\Controllers\SyncOrchestratorController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Health Check (Public)
|--------------------------------------------------------------------------
*/
Route::get('/health', [HealthCheckController::class, 'check'])
    ->name('health.check');

/*
|--------------------------------------------------------------------------
| Authentication Routes (No Versioning)
| Prefix: /api/auth
|--------------------------------------------------------------------------
*/
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    // Public auth routes
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('auth.forgot-password');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('auth.reset-password');
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('auth.verify-email');

    // Protected auth routes
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
        Route::post('/change-password', [AuthController::class, 'changePassword'])->name('auth.change-password');
        Route::post('/email/verification-notification', [AuthController::class, 'sendVerificationEmail'])->name('auth.send-verification');
    });
});

/*
|--------------------------------------------------------------------------
| API v1 Routes (Versioned)
| Prefix: /api/v1
|--------------------------------------------------------------------------
*/
Route::group([
    'middleware' => ['api', 'auth:api'],
    'prefix' => 'v1'
], function () {

    /*
    |--------------------------------------------------------------------------
    | User Management Routes
    | Prefix: /api/v1/users
    |--------------------------------------------------------------------------
    */
    Route::prefix('users')->group(function () {
        // Current user profile (me)
        Route::get('/me', [UserProfileController::class, 'getProfile'])->name('v1.users.me');
        Route::put('/me', [UserProfileController::class, 'updateProfile'])->name('v1.users.me.update');
        Route::post('/me/avatar', [UserProfileController::class, 'uploadAvatar'])->name('v1.users.me.avatar.upload');
        Route::delete('/me/avatar', [UserProfileController::class, 'deleteAvatar'])->name('v1.users.me.avatar.delete');

        // User management (admin routes)
        // TODO: Test /export, /bulk-delete, /bulk-update-type, /{id}/avatar (post and delete)
        Route::get('/', [UserManagementController::class, 'index'])->name('v1.users.index');
        Route::get('/stats', [UserManagementController::class, 'getStats'])->name('v1.users.stats');
        Route::post('/export', [UserManagementController::class, 'export'])->name('v1.users.export');
        Route::post('/bulk-delete', [UserManagementController::class, 'bulkDelete'])->name('v1.users.bulk-delete');
        Route::post('/bulk-update-type', [UserManagementController::class, 'bulkUpdateType'])->name('v1.users.bulk-update-type');
        Route::post('/', [UserManagementController::class, 'store'])->name('v1.users.store');
        Route::get('/{id}', [UserManagementController::class, 'show'])->whereNumber('id')->name('v1.users.show');
        Route::put('/{id}', [UserManagementController::class, 'update'])->whereNumber('id')->name('v1.users.update');
        Route::delete('/{id}', [UserManagementController::class, 'destroy'])->whereNumber('id')->name('v1.users.destroy');
        Route::post('/{id}/reset-password', [UserManagementController::class, 'resetPassword'])->whereNumber('id')->name('v1.users.reset-password');
        Route::post('/{id}/avatar', [UserManagementController::class, 'uploadAvatar'])->whereNumber('id')->name('v1.users.avatar.upload');
        Route::delete('/{id}/avatar', [UserManagementController::class, 'deleteAvatar'])->whereNumber('id')->name('v1.users.avatar.delete');
    });

    // User types and roles
    Route::get('/user-types', [UserManagementController::class, 'getUserTypes'])->name('v1.user-types');
    Route::get('/roles', [UserManagementController::class, 'getRoles'])->name('v1.roles');

    /*
    |--------------------------------------------------------------------------
    | Email Routes
    | Prefix: /api/v1/emails
    |--------------------------------------------------------------------------
    */
    Route::prefix('emails')->group(function () {
        // List and retrieve
        Route::get('/', [EmailController::class, 'index'])->name('v1.emails.index');
        Route::get('/messages', [EmailController::class, 'index'])->name('v1.emails.messages');
        Route::get('/messages/v5', [EmailControllerV5::class, 'index'])->name('v1.emails.messages.v5');
        Route::get('/stats', [EmailController::class, 'stats'])->name('v1.emails.stats');
        Route::get('/digest', [EmailController::class, 'digest'])->name('v1.emails.digest');
        Route::get('/{id}', [EmailController::class, 'show'])->whereNumber('id')->name('v1.emails.show');

        // Single email actions (REQ-EMAIL-005)
        Route::patch('/{id}/read', [EmailController::class, 'markAsRead'])->whereNumber('id')->name('v1.emails.read');
        Route::patch('/{id}/unread', [EmailController::class, 'markAsUnread'])->whereNumber('id')->name('v1.emails.unread');
        Route::patch('/{id}/star', [EmailController::class, 'star'])->whereNumber('id')->name('v1.emails.star');
        Route::patch('/{id}/unstar', [EmailController::class, 'unstar'])->whereNumber('id')->name('v1.emails.unstar');
        Route::patch('/{id}/trash', [EmailController::class, 'trash'])->whereNumber('id')->name('v1.emails.trash');
        Route::patch('/{id}/archive', [EmailController::class, 'archive'])->whereNumber('id')->name('v1.emails.archive');

        // Bulk operations (REQ-EMAIL-006)
        Route::post('/bulk-read', [EmailController::class, 'bulkRead'])->name('v1.emails.bulk-read');
        Route::post('/bulk-unread', [EmailController::class, 'bulkUnread'])->name('v1.emails.bulk-unread');
        Route::post('/bulk-trash', [EmailController::class, 'bulkTrash'])->name('v1.emails.bulk-trash');
        Route::post('/bulk-archive', [EmailController::class, 'bulkArchive'])->name('v1.emails.bulk-archive');
    });

    /*
    |--------------------------------------------------------------------------
    | Sync Orchestrator Routes
    | Prefix: /api/v1/sync
    |--------------------------------------------------------------------------
    */
    Route::prefix('sync')->group(function () {
        Route::post('/mail', [SyncOrchestratorController::class, 'syncMail'])->name('v1.sync.mail');
        Route::post('/ai', [SyncOrchestratorController::class, 'syncAi'])->name('v1.sync.ai');
        Route::post('/ai/{id}', [SyncOrchestratorController::class, 'syncAiById'])->whereNumber('id')->name('v1.sync.ai.by-id');
        Route::get('/status', [SyncOrchestratorController::class, 'status'])->name('v1.sync.status');
        Route::post('/cancel', [SyncOrchestratorController::class, 'cancel'])->name('v1.sync.cancel');
    });

    /*
    |--------------------------------------------------------------------------
    | AI Communication Routes
    | Prefix: /api/v1/communication
    |--------------------------------------------------------------------------
    */
    Route::prefix('communication')->group(function () {
        Route::get('/ai-dashboard', [AICommunicationController::class, 'aiDashboard'])->name('v1.communication.ai-dashboard');
        Route::get('/ai-message/{message_id}', [AICommunicationController::class, 'analyzeSingleMessage'])->name('v1.communication.ai-message');
    });

    /*
    |--------------------------------------------------------------------------
    | AI Monitoring Routes
    | Prefix: /api/v1/ai
    |--------------------------------------------------------------------------
    */
    Route::prefix('ai')->group(function () {
        Route::get('/usage', [AIMonitoringController::class, 'usage'])->name('v1.ai.usage');
    });

    /*
    |--------------------------------------------------------------------------
    | Email Response Routes
    | Prefix: /api/v1/emails
    |--------------------------------------------------------------------------
    */
    Route::post('/emails/respond', [EmailResponseController::class, 'respond'])->name('v1.emails.respond');

    /*
    |--------------------------------------------------------------------------
    | User Settings Routes
    | Prefix: /api/v1/settings
    |--------------------------------------------------------------------------
    */
    Route::prefix('settings')->group(function () {
        // Goals
        Route::get('/goals', [SettingsController::class, 'getGoals'])->name('v1.settings.goals');
        Route::put('/goals', [SettingsController::class, 'updateGoals'])->name('v1.settings.goals.update');

        // Categories
        Route::get('/categories', [SettingsController::class, 'getCategories'])->name('v1.settings.categories');
        Route::post('/categories', [SettingsController::class, 'createCategory'])->name('v1.settings.categories.create');
        Route::put('/categories/{id}', [SettingsController::class, 'updateCategory'])->whereNumber('id')->name('v1.settings.categories.update');
        Route::delete('/categories/{id}', [SettingsController::class, 'deleteCategory'])->whereNumber('id')->name('v1.settings.categories.delete');

        // Subcategories
        Route::post('/categories/{categoryId}/subcategories', [SettingsController::class, 'createSubcategory'])->whereNumber('categoryId')->name('v1.settings.subcategories.create');
        Route::put('/subcategories/{id}', [SettingsController::class, 'updateSubcategory'])->whereNumber('id')->name('v1.settings.subcategories.update');
        Route::delete('/subcategories/{id}', [SettingsController::class, 'deleteSubcategory'])->whereNumber('id')->name('v1.settings.subcategories.delete');

        // AI Services
        Route::get('/ai-services', [SettingsController::class, 'getAiServices'])->name('v1.settings.ai-services');
        Route::put('/ai-services', [SettingsController::class, 'updateAiServices'])->name('v1.settings.ai-services.update');

        // API Keys
        Route::get('/api-keys', [SettingsController::class, 'getApiKeys'])->name('v1.settings.api-keys');
        Route::post('/api-keys', [SettingsController::class, 'upsertApiKey'])->name('v1.settings.api-keys.upsert');
        Route::delete('/api-keys/{id}', [SettingsController::class, 'deleteApiKey'])->whereNumber('id')->name('v1.settings.api-keys.delete');

        // Apps Script Generator
        Route::get('/apps-script/settings', [SettingsController::class, 'getGmailAppScriptSettings'])->name('v1.settings.apps-script.settings');
        Route::post('/apps-script/settings', [SettingsController::class, 'saveGmailAppScriptSettings'])->name('v1.settings.apps-script.settings.save');
        Route::get('/apps-script/download', [SettingsController::class, 'generateAppsScript'])->name('v1.settings.apps-script.download');

        // Processing Logs
        Route::get('/processing-logs', [SettingsController::class, 'getProcessingLogs'])->name('v1.settings.processing-logs');
    });

    /*
    |--------------------------------------------------------------------------
    | Todo Routes
    | Prefix: /api/v1/todos
    |--------------------------------------------------------------------------
    */
    Route::prefix('todos')->group(function () {
        // Summary (must be before /{id} to avoid route conflicts)
        Route::get('/summary', [TodoController::class, 'summary'])->name('v1.todos.summary');

        // Create from email
        Route::post('/from-email', [TodoController::class, 'createFromEmail'])->name('v1.todos.from-email');

        // CRUD routes
        Route::get('/', [TodoController::class, 'index'])->name('v1.todos.index');
        Route::post('/', [TodoController::class, 'store'])->name('v1.todos.store');
        Route::get('/{id}', [TodoController::class, 'show'])->whereNumber('id')->name('v1.todos.show');
        Route::put('/{id}', [TodoController::class, 'update'])->whereNumber('id')->name('v1.todos.update');
        Route::delete('/{id}', [TodoController::class, 'destroy'])->whereNumber('id')->name('v1.todos.destroy');

        // Toggle completion
        Route::patch('/{id}/toggle', [TodoController::class, 'toggle'])->whereNumber('id')->name('v1.todos.toggle');
    });
});
