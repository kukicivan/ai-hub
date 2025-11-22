<?php

namespace Tests\Feature;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoControllerTest extends TestCase
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

    public function test_can_list_todos(): void
    {
        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Test Todo 1',
            'priority' => 'normal',
        ]);

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Test Todo 2',
            'priority' => 'high',
        ]);

        $response = $this->getJson('/api/v1/todos', $this->authHeaders());

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'message',
            ])
            ->assertJson(['success' => true]);
    }

    public function test_can_create_todo(): void
    {
        $response = $this->postJson('/api/v1/todos', [
            'title' => 'New Todo',
            'description' => 'Description here',
            'priority' => 'high',
        ], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Todo created successfully',
            ]);

        $this->assertDatabaseHas('todos', [
            'user_id' => $this->user->id,
            'title' => 'New Todo',
            'priority' => 'high',
        ]);
    }

    public function test_create_todo_requires_title(): void
    {
        $response = $this->postJson('/api/v1/todos', [
            'priority' => 'normal',
        ], $this->authHeaders());

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_can_get_single_todo(): void
    {
        $todo = Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Single Todo',
            'priority' => 'normal',
        ]);

        $response = $this->getJson('/api/v1/todos/' . $todo->id, $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_cannot_get_other_users_todo(): void
    {
        $otherUser = User::factory()->create();
        $todo = Todo::create([
            'user_id' => $otherUser->id,
            'title' => 'Other User Todo',
            'priority' => 'normal',
        ]);

        $response = $this->getJson('/api/v1/todos/' . $todo->id, $this->authHeaders());

        $response->assertStatus(404)
            ->assertJson(['success' => false]);
    }

    public function test_can_update_todo(): void
    {
        $todo = Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Original Title',
            'priority' => 'normal',
        ]);

        $response = $this->putJson('/api/v1/todos/' . $todo->id, [
            'title' => 'Updated Title',
            'priority' => 'high',
        ], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Todo updated successfully',
            ]);

        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'title' => 'Updated Title',
            'priority' => 'high',
        ]);
    }

    public function test_can_toggle_todo(): void
    {
        $todo = Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Toggle Todo',
            'priority' => 'normal',
            'completed' => false,
        ]);

        $response = $this->patchJson('/api/v1/todos/' . $todo->id . '/toggle', [], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Todo toggled successfully',
            ]);

        $this->assertTrue($todo->fresh()->completed);
    }

    public function test_can_delete_todo(): void
    {
        $todo = Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Delete Todo',
            'priority' => 'normal',
        ]);

        $response = $this->deleteJson('/api/v1/todos/' . $todo->id, [], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Todo deleted successfully',
            ]);

        $this->assertSoftDeleted('todos', ['id' => $todo->id]);
    }

    public function test_can_get_summary(): void
    {
        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Completed',
            'priority' => 'normal',
            'completed' => true,
        ]);

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Incomplete',
            'priority' => 'high',
            'completed' => false,
        ]);

        $response = $this->getJson('/api/v1/todos/summary', $this->authHeaders());

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    'total',
                    'completed',
                    'incomplete',
                    'overdue',
                    'due_today',
                    'high_priority',
                ],
            ]);
    }

    public function test_can_filter_by_completed(): void
    {
        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Completed',
            'priority' => 'normal',
            'completed' => true,
        ]);

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Incomplete',
            'priority' => 'normal',
            'completed' => false,
        ]);

        $response = $this->getJson('/api/v1/todos?completed=true', $this->authHeaders());

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_filter_by_priority(): void
    {
        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'High Priority',
            'priority' => 'high',
        ]);

        Todo::create([
            'user_id' => $this->user->id,
            'title' => 'Low Priority',
            'priority' => 'low',
        ]);

        $response = $this->getJson('/api/v1/todos?priority=high', $this->authHeaders());

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $response = $this->getJson('/api/v1/todos');

        $response->assertStatus(401);
    }
}
