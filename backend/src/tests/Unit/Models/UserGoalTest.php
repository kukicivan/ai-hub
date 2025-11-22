<?php

namespace Tests\Unit\Models;

use App\Models\UserGoal;
use Tests\TestCase;

class UserGoalTest extends TestCase
{
    public function test_goal_has_correct_fillable_attributes(): void
    {
        $goal = new UserGoal();

        $this->assertContains('user_id', $goal->getFillable());
        $this->assertContains('type', $goal->getFillable());
        $this->assertContains('key', $goal->getFillable());
        $this->assertContains('value', $goal->getFillable());
        $this->assertContains('is_active', $goal->getFillable());
        $this->assertContains('sort_order', $goal->getFillable());
    }

    public function test_goal_has_type_constants(): void
    {
        $this->assertEquals('primary', UserGoal::TYPE_PRIMARY);
        $this->assertEquals('secondary', UserGoal::TYPE_SECONDARY);
    }

    public function test_goal_has_correct_casts(): void
    {
        $goal = new UserGoal();
        $casts = $goal->getCasts();

        $this->assertArrayHasKey('is_active', $casts);
        $this->assertArrayHasKey('sort_order', $casts);
    }

    public function test_goal_has_required_relationships(): void
    {
        $goal = new UserGoal();

        $this->assertTrue(method_exists($goal, 'user'));
    }

    public function test_goal_has_required_scopes(): void
    {
        $this->assertTrue(method_exists(UserGoal::class, 'scopeActive'));
        $this->assertTrue(method_exists(UserGoal::class, 'scopePrimary'));
    }

    public function test_goal_has_get_for_prompt_method(): void
    {
        $this->assertTrue(method_exists(UserGoal::class, 'getForPrompt'));
    }
}
