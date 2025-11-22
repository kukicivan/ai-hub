<?php

namespace Tests\Unit\Models;

use App\Models\UserCategory;
use Tests\TestCase;

class UserCategoryTest extends TestCase
{
    public function test_category_has_correct_fillable_attributes(): void
    {
        $category = new UserCategory();

        $this->assertContains('user_id', $category->getFillable());
        $this->assertContains('name', $category->getFillable());
        $this->assertContains('display_name', $category->getFillable());
        $this->assertContains('description', $category->getFillable());
        $this->assertContains('priority', $category->getFillable());
        $this->assertContains('is_active', $category->getFillable());
        $this->assertContains('is_default', $category->getFillable());
    }

    public function test_category_has_priority_constants(): void
    {
        $this->assertEquals('high', UserCategory::PRIORITY_HIGH);
        $this->assertEquals('medium', UserCategory::PRIORITY_MEDIUM);
        $this->assertEquals('low', UserCategory::PRIORITY_LOW);
    }

    public function test_category_has_correct_casts(): void
    {
        $category = new UserCategory();
        $casts = $category->getCasts();

        $this->assertArrayHasKey('is_active', $casts);
        $this->assertArrayHasKey('is_default', $casts);
    }

    public function test_category_has_required_relationships(): void
    {
        $category = new UserCategory();

        $this->assertTrue(method_exists($category, 'user'));
        $this->assertTrue(method_exists($category, 'subcategories'));
    }

    public function test_category_has_required_scopes(): void
    {
        $this->assertTrue(method_exists(UserCategory::class, 'scopeActive'));
    }

    public function test_category_has_get_for_prompt_method(): void
    {
        $this->assertTrue(method_exists(UserCategory::class, 'getForPrompt'));
    }
}
