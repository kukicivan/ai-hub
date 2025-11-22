<?php

namespace Tests\Unit\Models;

use App\Models\Todo;
use Tests\TestCase;

class TodoTest extends TestCase
{
    public function test_todo_has_correct_fillable_attributes(): void
    {
        $todo = new Todo();

        $this->assertContains('user_id', $todo->getFillable());
        $this->assertContains('title', $todo->getFillable());
        $this->assertContains('description', $todo->getFillable());
        $this->assertContains('priority', $todo->getFillable());
        $this->assertContains('completed', $todo->getFillable());
        $this->assertContains('due_date', $todo->getFillable());
    }

    public function test_todo_has_priority_constants(): void
    {
        $this->assertEquals('low', Todo::PRIORITY_LOW);
        $this->assertEquals('normal', Todo::PRIORITY_NORMAL);
        $this->assertEquals('high', Todo::PRIORITY_HIGH);
    }

    public function test_todo_has_correct_casts(): void
    {
        $todo = new Todo();
        $casts = $todo->getCasts();

        $this->assertArrayHasKey('completed', $casts);
        $this->assertArrayHasKey('due_date', $casts);
    }

    public function test_todo_uses_soft_deletes(): void
    {
        $todo = new Todo();

        $this->assertTrue(method_exists($todo, 'trashed'));
        $this->assertTrue(method_exists($todo, 'restore'));
    }

    public function test_todo_has_required_relationships(): void
    {
        $todo = new Todo();

        $this->assertTrue(method_exists($todo, 'user'));
    }

    public function test_todo_has_required_scopes(): void
    {
        $this->assertTrue(method_exists(Todo::class, 'scopeForUser'));
        $this->assertTrue(method_exists(Todo::class, 'scopeCompleted'));
        $this->assertTrue(method_exists(Todo::class, 'scopeIncomplete'));
        $this->assertTrue(method_exists(Todo::class, 'scopeByPriority'));
        $this->assertTrue(method_exists(Todo::class, 'scopeOverdue'));
        $this->assertTrue(method_exists(Todo::class, 'scopeDueToday'));
    }

    public function test_todo_has_toggle_method(): void
    {
        $this->assertTrue(method_exists(Todo::class, 'toggle'));
    }
}
