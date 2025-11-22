<?php

namespace Tests\Unit\Models;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_create_todo(): void
    {
        $todo = Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Test Todo',
            'description' => 'Test description',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => false,
        ]);

        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'user_id' => $this->user->id,
            'title' => 'Test Todo',
        ]);
    }

    public function test_todo_belongs_to_user(): void
    {
        $todo = Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Test Todo',
            'priority' => Todo::PRIORITY_NORMAL,
        ]);

        $this->assertEquals($this->user->id, $todo->user->id);
    }

    public function test_for_user_scope_filters_by_user(): void
    {
        $otherUser = User::factory()->create();

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'My Todo',
            'priority' => Todo::PRIORITY_NORMAL,
        ]);

        Todo::create([
            'user_id' => $otherUser->id,
            'title' => 'Other Todo',
            'priority' => Todo::PRIORITY_NORMAL,
        ]);

        $todos = Todo::forUser($this->user->id)->get();

        $this->assertCount(1, $todos);
        $this->assertEquals('My Todo', $todos->first()->title);
    }

    public function test_completed_scope_filters_completed_todos(): void
    {
        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Completed Todo',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => true,
        ]);

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Incomplete Todo',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => false,
        ]);

        $completedTodos = Todo::forUser($this->user->id)->completed()->get();

        $this->assertCount(1, $completedTodos);
        $this->assertEquals('Completed Todo', $completedTodos->first()->title);
    }

    public function test_incomplete_scope_filters_incomplete_todos(): void
    {
        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Completed Todo',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => true,
        ]);

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Incomplete Todo',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => false,
        ]);

        $incompleteTodos = Todo::forUser($this->user->id)->incomplete()->get();

        $this->assertCount(1, $incompleteTodos);
        $this->assertEquals('Incomplete Todo', $incompleteTodos->first()->title);
    }

    public function test_by_priority_scope_filters_by_priority(): void
    {
        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'High Priority',
            'priority' => Todo::PRIORITY_HIGH,
        ]);

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Low Priority',
            'priority' => Todo::PRIORITY_LOW,
        ]);

        $highPriorityTodos = Todo::forUser($this->user->id)->byPriority(Todo::PRIORITY_HIGH)->get();

        $this->assertCount(1, $highPriorityTodos);
        $this->assertEquals('High Priority', $highPriorityTodos->first()->title);
    }

    public function test_toggle_method_changes_completion_status(): void
    {
        $todo = Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Toggle Test',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => false,
        ]);

        $this->assertFalse($todo->completed);

        $todo->toggle();

        $this->assertTrue($todo->fresh()->completed);

        $todo->toggle();

        $this->assertFalse($todo->fresh()->completed);
    }

    public function test_overdue_scope_finds_overdue_todos(): void
    {
        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Overdue Todo',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => false,
            'due_date' => now()->subDays(1),
        ]);

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Future Todo',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => false,
            'due_date' => now()->addDays(1),
        ]);

        $overdueTodos = Todo::forUser($this->user->id)->overdue()->get();

        $this->assertCount(1, $overdueTodos);
        $this->assertEquals('Overdue Todo', $overdueTodos->first()->title);
    }

    public function test_due_today_scope_finds_todos_due_today(): void
    {
        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Due Today',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => false,
            'due_date' => now(),
        ]);

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Due Tomorrow',
            'priority' => Todo::PRIORITY_NORMAL,
            'completed' => false,
            'due_date' => now()->addDay(),
        ]);

        $dueTodayTodos = Todo::forUser($this->user->id)->dueToday()->get();

        $this->assertCount(1, $dueTodayTodos);
        $this->assertEquals('Due Today', $dueTodayTodos->first()->title);
    }

    public function test_soft_delete_works(): void
    {
        $todo = Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Deletable Todo',
            'priority' => Todo::PRIORITY_NORMAL,
        ]);

        $todoId = $todo->id;
        $todo->delete();

        $this->assertSoftDeleted('todos', ['id' => $todoId]);
        $this->assertNull(Todo::find($todoId));
        $this->assertNotNull(Todo::withTrashed()->find($todoId));
    }
}
