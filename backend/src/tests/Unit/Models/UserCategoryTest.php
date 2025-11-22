<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\UserCategory;
use App\Models\UserSubcategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserCategoryTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_create_category(): void
    {
        $category = UserCategory::create([
            'user_id' => $this->user->id,
            'name' => 'test_category',
            'display_name' => 'Test Category',
            'description' => 'A test category',
            'priority' => UserCategory::PRIORITY_HIGH,
            'is_active' => true,
            'is_default' => false,
        ]);

        $this->assertDatabaseHas('user_categories', [
            'id' => $category->id,
            'name' => 'test_category',
            'priority' => 'high',
        ]);
    }

    public function test_category_has_subcategories(): void
    {
        $category = UserCategory::create([
            'user_id' => $this->user->id,
            'name' => 'parent_category',
            'display_name' => 'Parent Category',
            'priority' => UserCategory::PRIORITY_MEDIUM,
            'is_active' => true,
        ]);

        UserSubcategory::create([
            'category_id' => $category->id,
            'name' => 'sub1',
            'display_name' => 'Subcategory 1',
            'is_active' => true,
        ]);

        UserSubcategory::create([
            'category_id' => $category->id,
            'name' => 'sub2',
            'display_name' => 'Subcategory 2',
            'is_active' => true,
        ]);

        $this->assertCount(2, $category->subcategories);
    }

    public function test_active_scope_filters_inactive_categories(): void
    {
        UserCategory::create([
            'user_id' => $this->user->id,
            'name' => 'active_cat',
            'display_name' => 'Active',
            'priority' => 'medium',
            'is_active' => true,
        ]);

        UserCategory::create([
            'user_id' => $this->user->id,
            'name' => 'inactive_cat',
            'display_name' => 'Inactive',
            'priority' => 'medium',
            'is_active' => false,
        ]);

        $activeCategories = UserCategory::where('user_id', $this->user->id)->active()->get();

        $this->assertCount(1, $activeCategories);
        $this->assertEquals('active_cat', $activeCategories->first()->name);
    }

    public function test_get_for_prompt_returns_formatted_array(): void
    {
        $category = UserCategory::create([
            'user_id' => $this->user->id,
            'name' => 'automation',
            'display_name' => 'Automation',
            'description' => 'Automation opportunities',
            'priority' => 'high',
            'is_active' => true,
        ]);

        UserSubcategory::create([
            'category_id' => $category->id,
            'name' => 'workflow',
            'display_name' => 'Workflow',
            'is_active' => true,
        ]);

        UserSubcategory::create([
            'category_id' => $category->id,
            'name' => 'ai_project',
            'display_name' => 'AI Project',
            'is_active' => true,
        ]);

        $result = UserCategory::getForPrompt($this->user->id);

        $this->assertArrayHasKey('automation', $result);
        $this->assertEquals('Automation opportunities', $result['automation']['description']);
        $this->assertEquals('high', $result['automation']['priority']);
        $this->assertContains('workflow', $result['automation']['subcategories']);
        $this->assertContains('ai_project', $result['automation']['subcategories']);
    }
}
