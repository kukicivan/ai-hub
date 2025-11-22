<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserGoal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'key',
        'value',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Goal types.
     */
    public const TYPE_PRIMARY = 'primary';
    public const TYPE_SECONDARY = 'secondary';

    /**
     * Standard goal keys.
     */
    public const KEY_MAIN_FOCUS = 'main_focus';
    public const KEY_KEY_GOAL = 'key_goal';
    public const KEY_SECONDARY_PROJECT = 'secondary_project';
    public const KEY_STRATEGY = 'strategy';
    public const KEY_SITUATION = 'situation';
    public const KEY_TARGET_CLIENTS = 'target_clients';
    public const KEY_EXPERTISE = 'expertise';

    /**
     * Get the user that owns the goal.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get active goals.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get primary goals.
     */
    public function scopePrimary($query)
    {
        return $query->where('type', self::TYPE_PRIMARY);
    }

    /**
     * Scope to get secondary goals.
     */
    public function scopeSecondary($query)
    {
        return $query->where('type', self::TYPE_SECONDARY);
    }

    /**
     * Get all goals for a user formatted for prompt building.
     */
    public static function getForPrompt(int $userId): array
    {
        $goals = self::where('user_id', $userId)
            ->active()
            ->orderBy('sort_order')
            ->get();

        $result = [];
        foreach ($goals as $goal) {
            $result[$goal->key] = $goal->value;
        }

        return $result;
    }
}
