<?php

namespace Tests\Feature;

use App\Http\Controllers\API\v1\TodoController;
use Tests\TestCase;

class TodoControllerTest extends TestCase
{
    public function test_todo_controller_exists(): void
    {
        $this->assertTrue(class_exists(TodoController::class));
    }

    public function test_todo_controller_has_crud_methods(): void
    {
        $this->assertTrue(method_exists(TodoController::class, 'index'));
        $this->assertTrue(method_exists(TodoController::class, 'store'));
        $this->assertTrue(method_exists(TodoController::class, 'show'));
        $this->assertTrue(method_exists(TodoController::class, 'update'));
        $this->assertTrue(method_exists(TodoController::class, 'destroy'));
    }

    public function test_todo_controller_has_toggle_method(): void
    {
        $this->assertTrue(method_exists(TodoController::class, 'toggle'));
    }

    public function test_todo_controller_has_summary_method(): void
    {
        $this->assertTrue(method_exists(TodoController::class, 'summary'));
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $response = $this->getJson('/api/v1/todos');

        $response->assertStatus(401);
    }
}
