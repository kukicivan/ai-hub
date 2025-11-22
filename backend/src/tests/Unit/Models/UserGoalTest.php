<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\UserGoal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserGoalTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_create_user_goal(): void
    {
        $goal = UserGoal::create([
            'user_id' => $this->user->id,
            'type' => UserGoal::TYPE_PRIMARY,
            'key' => 'main_focus',
            'value' => 'Test focus value',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        $this->assertDatabaseHas('user_goals', [
            'id' => $goal->id,
            'user_id' => $this->user->id,
            'key' => 'main_focus',
        ]);
    }

    public function test_goal_belongs_to_user(): void
    {
        $goal = UserGoal::create([
            'user_id' => $this->user->id,
            'type' => UserGoal::TYPE_PRIMARY,
            'key' => 'key_goal',
            'value' => 'Test goal',
            'is_active' => true,
        ]);

        $this->assertEquals($this->user->id, $goal->user->id);
    }

    public function test_active_scope_filters_inactive_goals(): void
    {
        UserGoal::create([
            'user_id' => $this->user->id,
            'type' => UserGoal::TYPE_PRIMARY,
            'key' => 'active_goal',
            'value' => 'Active',
            'is_active' => true,
        ]);

        UserGoal::create([
            'user_id' => $this->user->id,
            'type' => UserGoal::TYPE_PRIMARY,
            'key' => 'inactive_goal',
            'value' => 'Inactive',
            'is_active' => false,
        ]);

        $activeGoals = UserGoal::where('user_id', $this->user->id)->active()->get();

        $this->assertCount(1, $activeGoals);
        $this->assertEquals('active_goal', $activeGoals->first()->key);
    }

    public function test_primary_scope_filters_secondary_goals(): void
    {
        UserGoal::create([
            'user_id' => $this->user->id,
            'type' => UserGoal::TYPE_PRIMARY,
            'key' => 'primary_goal',
            'value' => 'Primary',
            'is_active' => true,
        ]);

        UserGoal::create([
            'user_id' => $this->user->id,
            'type' => UserGoal::TYPE_SECONDARY,
            'key' => 'secondary_goal',
            'value' => 'Secondary',
            'is_active' => true,
        ]);

        $primaryGoals = UserGoal::where('user_id', $this->user->id)->primary()->get();

        $this->assertCount(1, $primaryGoals);
        $this->assertEquals('primary_goal', $primaryGoals->first()->key);
    }

    public function test_get_for_prompt_returns_formatted_array(): void
    {
        UserGoal::create([
            'user_id' => $this->user->id,
            'type' => UserGoal::TYPE_PRIMARY,
            'key' => 'main_focus',
            'value' => 'Test Focus',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        UserGoal::create([
            'user_id' => $this->user->id,
            'type' => UserGoal::TYPE_PRIMARY,
            'key' => 'key_goal',
            'value' => 'Test Key Goal',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $result = UserGoal::getForPrompt($this->user->id);

        $this->assertArrayHasKey('main_focus', $result);
        $this->assertArrayHasKey('key_goal', $result);
        $this->assertEquals('Test Focus', $result['main_focus']);
        $this->assertEquals('Test Key Goal', $result['key_goal']);
    }
}
