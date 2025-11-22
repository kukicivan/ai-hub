<?php

namespace Tests\Feature;

use App\Http\Controllers\API\v1\SettingsController;
use Tests\TestCase;

class SettingsControllerTest extends TestCase
{
    public function test_settings_controller_exists(): void
    {
        $this->assertTrue(class_exists(SettingsController::class));
    }

    public function test_settings_controller_has_goals_methods(): void
    {
        $this->assertTrue(method_exists(SettingsController::class, 'getGoals'));
        $this->assertTrue(method_exists(SettingsController::class, 'updateGoals'));
    }

    public function test_settings_controller_has_categories_methods(): void
    {
        $this->assertTrue(method_exists(SettingsController::class, 'getCategories'));
        $this->assertTrue(method_exists(SettingsController::class, 'createCategory'));
        $this->assertTrue(method_exists(SettingsController::class, 'updateCategory'));
        $this->assertTrue(method_exists(SettingsController::class, 'deleteCategory'));
    }

    public function test_settings_controller_has_ai_services_methods(): void
    {
        $this->assertTrue(method_exists(SettingsController::class, 'getAiServices'));
        $this->assertTrue(method_exists(SettingsController::class, 'updateAiServices'));
    }

    public function test_settings_controller_has_api_keys_methods(): void
    {
        $this->assertTrue(method_exists(SettingsController::class, 'getApiKeys'));
        $this->assertTrue(method_exists(SettingsController::class, 'upsertApiKey'));
        $this->assertTrue(method_exists(SettingsController::class, 'deleteApiKey'));
    }

    public function test_settings_controller_has_initialize_method(): void
    {
        $this->assertTrue(method_exists(SettingsController::class, 'initializeDefaults'));
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $response = $this->getJson('/api/v1/settings/goals');

        $response->assertStatus(401);
    }
}
