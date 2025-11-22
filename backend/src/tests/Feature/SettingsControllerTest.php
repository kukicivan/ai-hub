<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserGoal;
use App\Models\UserCategory;
use App\Models\UserAiService;
use App\Models\UserApiKey;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Tests\TestCase;

class SettingsControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = auth()->login($this->user);
    }

    protected function authHeaders(): array
    {
        return ['Authorization' => 'Bearer ' . $this->token];
    }

    // ==================== GOALS TESTS ====================

    public function test_can_get_goals(): void
    {
        UserGoal::create([
            'user_id' => $this->user->id,
            'type' => 'primary',
            'key' => 'main_focus',
            'value' => 'Test Focus',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/settings/goals', $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Goals retrieved successfully',
            ])
            ->assertJsonStructure([
                'data' => ['goals'],
            ]);
    }

    public function test_can_update_goals(): void
    {
        $response = $this->putJson('/api/v1/settings/goals', [
            'goals' => [
                [
                    'key' => 'main_focus',
                    'value' => 'Updated Focus',
                    'type' => 'primary',
                    'is_active' => true,
                ],
            ],
        ], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Goals updated successfully',
            ]);

        $this->assertDatabaseHas('user_goals', [
            'user_id' => $this->user->id,
            'key' => 'main_focus',
            'value' => 'Updated Focus',
        ]);
    }

    public function test_update_goals_validates_required_fields(): void
    {
        $response = $this->putJson('/api/v1/settings/goals', [
            'goals' => [
                [
                    'key' => 'main_focus',
                    // Missing 'value' and 'type'
                ],
            ],
        ], $this->authHeaders());

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    // ==================== CATEGORIES TESTS ====================

    public function test_can_get_categories(): void
    {
        $category = UserCategory::create([
            'user_id' => $this->user->id,
            'name' => 'test_category',
            'display_name' => 'Test Category',
            'priority' => 'high',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/settings/categories', $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Categories retrieved successfully',
            ]);
    }

    public function test_can_create_category(): void
    {
        $response = $this->postJson('/api/v1/settings/categories', [
            'name' => 'new_category',
            'display_name' => 'New Category',
            'description' => 'Description',
            'priority' => 'medium',
        ], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Category created successfully',
            ]);

        $this->assertDatabaseHas('user_categories', [
            'user_id' => $this->user->id,
            'name' => 'new_category',
        ]);
    }

    public function test_cannot_create_duplicate_category(): void
    {
        UserCategory::create([
            'user_id' => $this->user->id,
            'name' => 'existing',
            'display_name' => 'Existing',
            'priority' => 'medium',
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/v1/settings/categories', [
            'name' => 'existing',
            'display_name' => 'Duplicate',
            'priority' => 'medium',
        ], $this->authHeaders());

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Category with this name already exists',
            ]);
    }

    public function test_can_update_category(): void
    {
        $category = UserCategory::create([
            'user_id' => $this->user->id,
            'name' => 'update_test',
            'display_name' => 'Original',
            'priority' => 'low',
            'is_active' => true,
        ]);

        $response = $this->putJson('/api/v1/settings/categories/' . $category->id, [
            'display_name' => 'Updated Name',
            'priority' => 'high',
        ], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Category updated successfully',
            ]);

        $this->assertDatabaseHas('user_categories', [
            'id' => $category->id,
            'display_name' => 'Updated Name',
            'priority' => 'high',
        ]);
    }

    public function test_can_delete_category(): void
    {
        $category = UserCategory::create([
            'user_id' => $this->user->id,
            'name' => 'delete_test',
            'display_name' => 'Delete Me',
            'priority' => 'low',
            'is_active' => true,
        ]);

        $response = $this->deleteJson('/api/v1/settings/categories/' . $category->id, [], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Category deleted successfully',
            ]);

        $this->assertDatabaseMissing('user_categories', [
            'id' => $category->id,
        ]);
    }

    public function test_cannot_access_other_users_category(): void
    {
        $otherUser = User::factory()->create();
        $category = UserCategory::create([
            'user_id' => $otherUser->id,
            'name' => 'other_user',
            'display_name' => 'Other User Category',
            'priority' => 'low',
            'is_active' => true,
        ]);

        $response = $this->putJson('/api/v1/settings/categories/' . $category->id, [
            'display_name' => 'Hacked',
        ], $this->authHeaders());

        $response->assertStatus(404);
    }

    // ==================== AI SERVICES TESTS ====================

    public function test_can_get_ai_services(): void
    {
        $response = $this->getJson('/api/v1/settings/ai-services', $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'AI services retrieved successfully',
            ]);
    }

    public function test_can_update_ai_services(): void
    {
        UserAiService::create([
            'user_id' => $this->user->id,
            'gmail_active' => false,
        ]);

        $response = $this->putJson('/api/v1/settings/ai-services', [
            'gmail_active' => true,
            'slack_active' => true,
        ], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'AI services updated successfully',
            ]);
    }

    // ==================== API KEYS TESTS ====================

    public function test_can_get_api_keys_masked(): void
    {
        UserApiKey::create([
            'user_id' => $this->user->id,
            'service' => 'grok',
            'encrypted_key' => Crypt::encryptString('xai-test-key-12345'),
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/settings/api-keys', $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'API keys retrieved successfully',
            ]);

        // Verify key is masked
        $data = $response->json('data.api_keys');
        $this->assertNotEmpty($data);
        $this->assertStringContainsString('••••', $data[0]['masked_key']);
    }

    public function test_can_upsert_api_key(): void
    {
        $response = $this->postJson('/api/v1/settings/api-keys', [
            'service' => 'grok',
            'key' => 'xai-new-key-12345678',
        ], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'API key saved successfully',
            ]);

        $this->assertDatabaseHas('user_api_keys', [
            'user_id' => $this->user->id,
            'service' => 'grok',
        ]);
    }

    public function test_api_key_requires_minimum_length(): void
    {
        $response = $this->postJson('/api/v1/settings/api-keys', [
            'service' => 'grok',
            'key' => 'short',
        ], $this->authHeaders());

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_can_delete_api_key(): void
    {
        $apiKey = UserApiKey::create([
            'user_id' => $this->user->id,
            'service' => 'openai',
            'encrypted_key' => Crypt::encryptString('sk-test-key'),
            'is_active' => true,
        ]);

        $response = $this->deleteJson('/api/v1/settings/api-keys/' . $apiKey->id, [], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'API key deleted successfully',
            ]);
    }

    // ==================== INITIALIZATION TESTS ====================

    public function test_can_initialize_defaults(): void
    {
        $response = $this->postJson('/api/v1/settings/initialize', [], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    // ==================== AUTHENTICATION TESTS ====================

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $response = $this->getJson('/api/v1/settings/goals');

        $response->assertStatus(401);
    }
}
