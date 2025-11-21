<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Email Category Model
 * 
 * Defines email categories for classification
 * Supports both default categories and user-specific overrides
 * 
 * @property int $id
 * @property string $name
 * @property string $display_name
 * @property string|null $description
 * @property string $priority (low, medium, high)
 * @property int|null $user_id
 * @property bool $is_active
 * @property int $sort_order
 */
class EmailCategory extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'priority',
        'user_id',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get the user that owns the category (if user-specific)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get subcategories
     */
    public function subcategories(): HasMany
    {
        return $this->hasMany(EmailSubcategory::class, 'category_id');
    }

    /**
     * Get keyword mappings
     */
    public function keywords(): HasMany
    {
        return $this->hasMany(KeywordMapping::class, 'category_id');
    }

    /**
     * Scope for default categories (available to all users)
     */
    public function scopeDefault($query)
    {
        return $query->whereNull('user_id');
    }

    /**
     * Scope for user-specific categories
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get all categories for a user (including defaults)
     */
    public static function getAllForUser(?int $userId = null): \Illuminate\Database\Eloquent\Collection
    {
        return self::active()
            ->where(function ($query) use ($userId) {
                $query->whereNull('user_id');
                if ($userId) {
                    $query->orWhere('user_id', $userId);
                }
            })
            ->with('subcategories')
            ->orderByDesc('priority')
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Convert to array format for prompt builder
     */
    public function toPromptArray(): array
    {
        return [
            'description' => $this->description,
            'subcategories' => $this->subcategories->pluck('name')->toArray(),
            'priority' => $this->priority,
        ];
    }

    /**
     * Get all categories formatted for prompt
     */
    public static function getAllFormattedForPrompt(?int $userId = null): array
    {
        $categories = self::getAllForUser($userId);
        
        $formatted = [];
        foreach ($categories as $category) {
            $formatted[$category->name] = $category->toPromptArray();
        }
        
        return $formatted;
    }
}
