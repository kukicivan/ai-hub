<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Keyword Mapping Model
 * 
 * Maps keywords to categories with priority and weight
 * for better email classification
 * 
 * @property int $id
 * @property string $keyword
 * @property int $category_id
 * @property string $priority (low, medium, high)
 * @property float $weight
 * @property int|null $user_id
 * @property string $language
 * @property bool $is_active
 * @property int $usage_count
 */
class KeywordMapping extends Model
{
    protected $fillable = [
        'keyword',
        'category_id',
        'priority',
        'weight',
        'user_id',
        'language',
        'is_active',
        'usage_count',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
        'is_active' => 'boolean',
        'usage_count' => 'integer',
    ];

    /**
     * Get the category that owns the keyword
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(EmailCategory::class, 'category_id');
    }

    /**
     * Get the user that owns the keyword (if user-specific)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for default keywords
     */
    public function scopeDefault($query)
    {
        return $query->whereNull('user_id');
    }

    /**
     * Scope for user-specific keywords
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for active keywords
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope by priority
     */
    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope by language
     */
    public function scopeByLanguage($query, string $language)
    {
        return $query->where('language', $language);
    }

    /**
     * Get all keywords for a user grouped by priority
     */
    public static function getAllForUserGrouped(?int $userId = null): array
    {
        $query = self::active()
            ->where(function ($query) use ($userId) {
                $query->whereNull('user_id');
                if ($userId) {
                    $query->orWhere('user_id', $userId);
                }
            })
            ->with('category')
            ->orderByDesc('weight');

        $keywords = $query->get();

        return [
            'high' => $keywords->where('priority', 'high')->pluck('keyword')->toArray(),
            'medium' => $keywords->where('priority', 'medium')->pluck('keyword')->toArray(),
            'low' => $keywords->where('priority', 'low')->pluck('keyword')->toArray(),
        ];
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }

    /**
     * Get most used keywords (for analytics)
     */
    public static function getMostUsed(int $limit = 10)
    {
        return self::active()
            ->orderByDesc('usage_count')
            ->limit($limit)
            ->get();
    }
}
