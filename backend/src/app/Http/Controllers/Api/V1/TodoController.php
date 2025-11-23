<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TodoController extends BaseController
{
    /**
     * Get all todos for the authenticated user.
     *
     * GET /api/v1/todos
     */
    public function index(Request $request): JsonResponse
    {
        $userId = Auth::id();

        $query = Todo::forUser($userId)
            ->orderByRaw("FIELD(priority, 'high', 'normal', 'low')")
            ->orderBy('completed')
            ->orderByDesc('created_at');

        // Optional filters
        if ($request->has('completed')) {
            $query->where('completed', filter_var($request->completed, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('priority')) {
            $query->byPriority($request->priority);
        }

        $todos = $query->get();

        return $this->sendResponse($todos, 'Todos retrieved successfully');
    }

    /**
     * Get a single todo.
     *
     * GET /api/v1/todos/{id}
     */
    public function show(int $id): JsonResponse
    {
        $userId = Auth::id();

        $todo = Todo::forUser($userId)->find($id);

        if (!$todo) {
            return $this->sendError('Todo not found', [], 404);
        }

        return $this->sendResponse($todo, 'Todo retrieved successfully');
    }

    /**
     * Create a new todo.
     *
     * POST /api/v1/todos
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,normal,high',
            'due_date' => 'nullable|date',
            'email_id' => 'nullable|integer|exists:messaging_messages,id',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $userId = Auth::id();

        $todo = Todo::create([
            'user_id' => $userId,
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority ?? Todo::PRIORITY_NORMAL,
            'due_date' => $request->due_date,
            'email_id' => $request->email_id,
            'completed' => false,
        ]);

        return $this->sendResponse($todo, 'Todo created successfully');
    }

    /**
     * Update a todo.
     *
     * PUT /api/v1/todos/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $userId = Auth::id();

        $todo = Todo::forUser($userId)->find($id);

        if (!$todo) {
            return $this->sendError('Todo not found', [], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'sometimes|boolean',
            'priority' => 'sometimes|in:low,normal,high',
            'due_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $todo->update($request->only([
            'title',
            'description',
            'completed',
            'priority',
            'due_date',
        ]));

        return $this->sendResponse($todo->fresh(), 'Todo updated successfully');
    }

    /**
     * Toggle todo completion status.
     *
     * PATCH /api/v1/todos/{id}/toggle
     */
    public function toggle(int $id): JsonResponse
    {
        $userId = Auth::id();

        $todo = Todo::forUser($userId)->find($id);

        if (!$todo) {
            return $this->sendError('Todo not found', [], 404);
        }

        $todo->toggle();

        return $this->sendResponse($todo, 'Todo toggled successfully');
    }

    /**
     * Delete a todo.
     *
     * DELETE /api/v1/todos/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $userId = Auth::id();

        $todo = Todo::forUser($userId)->find($id);

        if (!$todo) {
            return $this->sendError('Todo not found', [], 404);
        }

        $todo->delete();

        return $this->sendResponse([], 'Todo deleted successfully');
    }

    /**
     * Create a todo from an email.
     *
     * POST /api/v1/todos/from-email
     */
    public function createFromEmail(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email_id' => 'nullable|integer|exists:messaging_messages,id',
            'title' => 'required|string|max:255',
            'priority' => 'nullable|in:low,normal,high',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation failed', $validator->errors(), 422);
        }

        $userId = Auth::id();

        // Check if todo already exists for this email (only if email_id provided)
        if ($request->email_id) {
            $existingTodo = Todo::forUser($userId)
                ->where('email_id', $request->email_id)
                ->first();

            if ($existingTodo) {
                return $this->sendResponse($existingTodo, 'Todo already exists for this email');
            }
        }

        $todo = Todo::createFromEmail(
            $userId,
            $request->email_id,
            $request->title,
            $request->priority ?? Todo::PRIORITY_NORMAL
        );

        return $this->sendResponse($todo, 'Todo created successfully');
    }

    /**
     * Get todos summary (counts by status).
     *
     * GET /api/v1/todos/summary
     */
    public function summary(): JsonResponse
    {
        $userId = Auth::id();

        $summary = [
            'total' => Todo::forUser($userId)->count(),
            'completed' => Todo::forUser($userId)->completed()->count(),
            'incomplete' => Todo::forUser($userId)->incomplete()->count(),
            'overdue' => Todo::forUser($userId)->overdue()->count(),
            'due_today' => Todo::forUser($userId)->dueToday()->count(),
            'high_priority' => Todo::forUser($userId)->byPriority(Todo::PRIORITY_HIGH)->incomplete()->count(),
        ];

        return $this->sendResponse($summary, 'Todo summary retrieved successfully');
    }
}
