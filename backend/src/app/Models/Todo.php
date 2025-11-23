<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Todo extends Model
{
    use HasFactory, SoftDeletes;

    // Priority constants
    const PRIORITY_LOW = 'low';
    const PRIORITY_NORMAL = 'normal';
    const PRIORITY_HIGH = 'high';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'completed',
        'priority',
        'due_date',
        'email_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'completed' => 'boolean',
        'due_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the todo.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the email associated with the todo.
     */
    public function email(): BelongsTo
    {
        return $this->belongsTo(MessagingMessage::class, 'email_id');
    }

    // ==================== SCOPES ====================

    /**
     * Scope to filter by user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter completed todos.
     */
    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    /**
     * Scope to filter incomplete todos.
     */
    public function scopeIncomplete($query)
    {
        return $query->where('completed', false);
    }

    /**
     * Scope to filter by priority.
     */
    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope to filter overdue todos.
     */
    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now()->toDateString())
            ->where('completed', false);
    }

    /**
     * Scope to filter todos due today.
     */
    public function scopeDueToday($query)
    {
        return $query->whereDate('due_date', now()->toDateString())
            ->where('completed', false);
    }

    // ==================== METHODS ====================

    /**
     * Toggle the completion status.
     */
    public function toggle(): self
    {
        $this->completed = !$this->completed;
        $this->save();
        return $this;
    }

    /**
     * Create a todo from an email message.
     */
    public static function createFromEmail(int $userId, int $emailId, string $title, string $priority = self::PRIORITY_NORMAL): self
    {
        return self::create([
            'user_id' => $userId,
            'email_id' => $emailId,
            'title' => $title,
            'priority' => $priority,
            'completed' => false,
        ]);
    }
}
