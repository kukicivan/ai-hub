<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\AiProcessingLog;
use App\Models\User;
use App\Models\UserAiService;
use App\Models\UserApiKey;
use App\Models\UserCategory;
use App\Models\UserGoal;
use App\Models\UserSubcategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SettingsController extends BaseController
{
    // ==================== GOALS ====================

    /**
     * Get all goals for the authenticated user.
     */
    public function getGoals(): JsonResponse
    {
        $userId = Auth::id();

        $goals = UserGoal::where('user_id', $userId)
            ->orderBy('type')
            ->orderBy('sort_order')
            ->get();

        return $this->sendResponse(['goals' => $goals], 'Goals retrieved successfully');
    }

    /**
     * Update goals for the authenticated user.
     */
    public function updateGoals(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'goals' => 'required|array',
            'goals.*.key' => 'required|string|max:255',
            'goals.*.value' => 'required|string',
            'goals.*.type' => 'required|in:primary,secondary',
            'goals.*.is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $userId = Auth::id();

        foreach ($request->goals as $index => $goalData) {
            UserGoal::updateOrCreate(
                [
                    'user_id' => $userId,
                    'key' => $goalData['key'],
                ],
                [
                    'type' => $goalData['type'],
                    'value' => $goalData['value'],
                    'is_active' => $goalData['is_active'] ?? true,
                    'sort_order' => $index,
                ]
            );
        }

        $goals = UserGoal::where('user_id', $userId)
            ->orderBy('type')
            ->orderBy('sort_order')
            ->get();

        return $this->sendResponse(['goals' => $goals], 'Goals updated successfully');
    }

    // ==================== CATEGORIES ====================

    /**
     * Get all categories with subcategories for the authenticated user.
     */
    public function getCategories(): JsonResponse
    {
        $userId = Auth::id();

        $categories = UserCategory::where('user_id', $userId)
            ->with(['subcategories' => function ($query) {
                $query->orderBy('sort_order');
            }])
            ->orderBy('sort_order')
            ->get();

        return $this->sendResponse(['categories' => $categories], 'Categories retrieved successfully');
    }

    /**
     * Create a new category.
     */
    public function createCategory(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:high,medium,low',
            'subcategories' => 'array',
            'subcategories.*.name' => 'required|string|max:255',
            'subcategories.*.display_name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $userId = Auth::id();

        // Check for duplicate name
        $exists = UserCategory::where('user_id', $userId)
            ->where('name', $request->name)
            ->exists();

        if ($exists) {
            return $this->sendError('Category with this name already exists', [], 422);
        }

        $maxOrder = UserCategory::where('user_id', $userId)->max('sort_order') ?? -1;

        $category = UserCategory::create([
            'user_id' => $userId,
            'name' => $request->name,
            'display_name' => $request->display_name,
            'description' => $request->description,
            'priority' => $request->priority,
            'is_active' => true,
            'is_default' => false,
            'sort_order' => $maxOrder + 1,
        ]);

        // Create subcategories
        if ($request->has('subcategories')) {
            foreach ($request->subcategories as $index => $sub) {
                UserSubcategory::create([
                    'category_id' => $category->id,
                    'name' => $sub['name'],
                    'display_name' => $sub['display_name'],
                    'description' => $sub['description'] ?? null,
                    'is_active' => true,
                    'sort_order' => $index,
                ]);
            }
        }

        $category->load('subcategories');

        return $this->sendResponse(['category' => $category], 'Category created successfully');
    }

    /**
     * Update a category.
     */
    public function updateCategory(Request $request, int $id): JsonResponse
    {
        $userId = Auth::id();

        $category = UserCategory::where('user_id', $userId)
            ->where('id', $id)
            ->first();

        if (!$category) {
            return $this->sendError('Category not found', [], 404);
        }

        $validator = Validator::make($request->all(), [
            'display_name' => 'string|max:255',
            'description' => 'nullable|string',
            'priority' => 'in:high,medium,low',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $category->update($request->only(['display_name', 'description', 'priority', 'is_active']));
        $category->load('subcategories');

        return $this->sendResponse(['category' => $category], 'Category updated successfully');
    }

    /**
     * Delete a category.
     */
    public function deleteCategory(int $id): JsonResponse
    {
        $userId = Auth::id();

        $category = UserCategory::where('user_id', $userId)
            ->where('id', $id)
            ->first();

        if (!$category) {
            return $this->sendError('Category not found', [], 404);
        }

        $category->delete();

        return $this->sendResponse([], 'Category deleted successfully');
    }

    // ==================== SUBCATEGORIES ====================

    /**
     * Add subcategory to a category.
     */
    public function createSubcategory(Request $request, int $categoryId): JsonResponse
    {
        $userId = Auth::id();

        $category = UserCategory::where('user_id', $userId)
            ->where('id', $categoryId)
            ->first();

        if (!$category) {
            return $this->sendError('Category not found', [], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $maxOrder = UserSubcategory::where('category_id', $categoryId)->max('sort_order') ?? -1;

        $subcategory = UserSubcategory::create([
            'category_id' => $categoryId,
            'name' => $request->name,
            'display_name' => $request->display_name,
            'description' => $request->description,
            'is_active' => true,
            'sort_order' => $maxOrder + 1,
        ]);

        return $this->sendResponse(['subcategory' => $subcategory], 'Subcategory created successfully');
    }

    /**
     * Update a subcategory.
     */
    public function updateSubcategory(Request $request, int $id): JsonResponse
    {
        $userId = Auth::id();

        $subcategory = UserSubcategory::whereHas('category', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->where('id', $id)->first();

        if (!$subcategory) {
            return $this->sendError('Subcategory not found', [], 404);
        }

        $validator = Validator::make($request->all(), [
            'display_name' => 'string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $subcategory->update($request->only(['display_name', 'description', 'is_active']));

        return $this->sendResponse(['subcategory' => $subcategory], 'Subcategory updated successfully');
    }

    /**
     * Delete a subcategory.
     */
    public function deleteSubcategory(int $id): JsonResponse
    {
        $userId = Auth::id();

        $subcategory = UserSubcategory::whereHas('category', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->where('id', $id)->first();

        if (!$subcategory) {
            return $this->sendError('Subcategory not found', [], 404);
        }

        $subcategory->delete();

        return $this->sendResponse([], 'Subcategory deleted successfully');
    }

    // ==================== AI SERVICES ====================

    /**
     * Get AI services settings for the authenticated user.
     */
    public function getAiServices(): JsonResponse
    {
        $userId = Auth::id();

        $services = UserAiService::getOrCreateForUser($userId);

        return $this->sendResponse(['services' => $services], 'AI services retrieved successfully');
    }

    /**
     * Update AI services settings.
     */
    public function updateAiServices(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'gmail_active' => 'boolean',
            'viber_active' => 'boolean',
            'whatsapp_active' => 'boolean',
            'telegram_active' => 'boolean',
            'social_active' => 'boolean',
            'slack_active' => 'boolean',
            'gmail_settings' => 'nullable|array',
            'viber_settings' => 'nullable|array',
            'whatsapp_settings' => 'nullable|array',
            'telegram_settings' => 'nullable|array',
            'social_settings' => 'nullable|array',
            'slack_settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $userId = Auth::id();
        $services = UserAiService::getOrCreateForUser($userId);

        $services->update($request->only([
            'gmail_active',
            'viber_active',
            'whatsapp_active',
            'telegram_active',
            'social_active',
            'slack_active',
            'gmail_settings',
            'viber_settings',
            'whatsapp_settings',
            'telegram_settings',
            'social_settings',
            'slack_settings',
        ]));

        return $this->sendResponse(['services' => $services->fresh()], 'AI services updated successfully');
    }

    // ==================== API KEYS ====================

    /**
     * Get API keys for the authenticated user (masked).
     */
    public function getApiKeys(): JsonResponse
    {
        $userId = Auth::id();

        $keys = UserApiKey::where('user_id', $userId)->get();

        $maskedKeys = $keys->map(function ($key) {
            return [
                'id' => $key->id,
                'service' => $key->service,
                'masked_key' => $key->getMaskedKey(),
                'is_active' => $key->is_active,
                'is_valid' => $key->isValid(),
                'last_used_at' => $key->last_used_at,
                'expires_at' => $key->expires_at,
                'created_at' => $key->created_at,
            ];
        });

        return $this->sendResponse(['api_keys' => $maskedKeys], 'API keys retrieved successfully');
    }

    /**
     * Create or update an API key.
     */
    public function upsertApiKey(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'service' => 'required|string|in:grok,openai,anthropic',
            'key' => 'required|string|min:10',
            'expires_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $userId = Auth::id();

        $apiKey = UserApiKey::updateOrCreate(
            [
                'user_id' => $userId,
                'service' => $request->service,
            ],
            [
                'encrypted_key' => Crypt::encryptString($request->key),
                'is_active' => true,
                'expires_at' => $request->expires_at,
            ]
        );

        return $this->sendResponse([
            'api_key' => [
                'id' => $apiKey->id,
                'service' => $apiKey->service,
                'masked_key' => $apiKey->getMaskedKey(),
                'is_active' => $apiKey->is_active,
                'expires_at' => $apiKey->expires_at,
            ],
        ], 'API key saved successfully');
    }

    /**
     * Delete an API key.
     */
    public function deleteApiKey(int $id): JsonResponse
    {
        $userId = Auth::id();

        $apiKey = UserApiKey::where('user_id', $userId)
            ->where('id', $id)
            ->first();

        if (!$apiKey) {
            return $this->sendError('API key not found', [], 404);
        }

        $apiKey->delete();

        return $this->sendResponse([], 'API key deleted successfully');
    }

    // ==================== APPS SCRIPT ====================

    /**
     * Get Gmail Apps Script settings.
     */
    public function getGmailAppScriptSettings(): JsonResponse
    {
        $userId = Auth::id();
        $services = UserAiService::getOrCreateForUser($userId);
        $settings = $services->gmail_settings ?? [];

        return $this->sendResponse([
            'app_script_url' => $settings['app_script_url'] ?? '',
            'api_key' => $settings['api_key'] ?? '',
        ], 'Gmail Apps Script settings retrieved successfully');
    }

    /**
     * Save Gmail Apps Script settings.
     */
    public function saveGmailAppScriptSettings(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'app_script_url' => 'required|string|url',
            'api_key' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $userId = Auth::id();
        $services = UserAiService::getOrCreateForUser($userId);

        $settings = $services->gmail_settings ?? [];
        $settings['app_script_url'] = $request->app_script_url;
        $settings['api_key'] = $request->api_key;

        $services->update(['gmail_settings' => $settings]);

        return $this->sendResponse([
            'app_script_url' => $settings['app_script_url'],
            'api_key' => $settings['api_key'],
        ], 'Gmail Apps Script settings saved successfully');
    }

    /**
     * Generate Gmail Apps Script with user's settings.
     */
    public function generateAppsScript(): StreamedResponse
    {
        $userId = Auth::id();

        // Get Gmail Apps Script settings
        $services = UserAiService::getOrCreateForUser($userId);
        $gmailSettings = $services->gmail_settings ?? [];

        $gmailApiKey = $gmailSettings['api_key'] ?? 'YOUR_GMAIL_API_KEY_HERE';

        // Load code_complete.gs template
        $template = file_get_contents(base_path('code_complete.gs'));

        // Replace only the hardcoded API key
        $script = str_replace(
            "const apiKey = 'KDd4mUiWT1mXSsTrOFF6mjcjhxiNgA7236apVgYcdayGycZhB91BOQfY51LjbazZifHrJ3Ln0zw1S7eMGKHAqj8rkEJTKAs4ZruKUoQkqC5E4sOsFhztvdob14019lbI';",
            "const apiKey = '{$gmailApiKey}';",
            $template
        );

        return response()->streamDownload(function () use ($script) {
            echo $script;
        }, 'gmail_sync_script.gs', [
            'Content-Type' => 'application/javascript',
        ]);
    }

    // ==================== PROCESSING LOGS ====================

    /**
     * Get AI processing logs (skipped emails due to token limit, etc.)
     */
    public function getProcessingLogs(Request $request): JsonResponse
    {
        $userId = Auth::id();

        $query = AiProcessingLog::where('user_id', $userId)
            ->with('message:id,message_id,thread_id')
            ->orderByDesc('created_at');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $logs = $query->paginate($request->get('per_page', 25));

        return $this->sendResponse([
            'logs' => $logs->items(),
            'meta' => [
                'page' => $logs->currentPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
                'total_pages' => $logs->lastPage(),
            ],
        ], 'Processing logs retrieved successfully');
    }
}
