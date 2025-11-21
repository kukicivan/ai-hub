<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * User Goals Model
 * 
 * Stores personalized goals and context for AI email analysis
 * 
 * @property int $id
 * @property int $user_id
 * @property string $main_focus
 * @property string $key_goal
 * @property string|null $secondary_project
 * @property string|null $strategy
 * @property string|null $situation
 * @property string|null $target_clients
 * @property string|null $expertise
 * @property bool $is_active
 */
class UserGoal extends Model
{
    protected $fillable = [
        'user_id',
        'main_focus',
        'key_goal',
        'secondary_project',
        'strategy',
        'situation',
        'target_clients',
        'expertise',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the goal
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get active goals only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get active goal for user
     */
    public static function getActiveForUser(int $userId): ?self
    {
        return self::where('user_id', $userId)
            ->where('is_active', true)
            ->latest()
            ->first();
    }

    /**
     * Convert to array format for prompt builder
     */
    public function toPromptArray(): array
    {
        return [
            'main_focus' => $this->main_focus,
            'key_goal' => $this->key_goal,
            'secondary_project' => $this->secondary_project,
            'strategy' => $this->strategy,
            'situation' => $this->situation,
            'target_clients' => $this->target_clients,
            'expertise' => $this->expertise,
        ];
    }
}
