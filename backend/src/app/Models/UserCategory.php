<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'display_name',
        'description',
        'priority',
        'is_active',
        'is_default',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Priority levels.
     */
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_LOW = 'low';

    /**
     * Get the user that owns the category.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subcategories for this category.
     */
    public function subcategories(): HasMany
    {
        return $this->hasMany(UserSubcategory::class, 'category_id');
    }

    /**
     * Scope to get active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get all categories for a user formatted for prompt building.
     */
    public static function getForPrompt(int $userId): array
    {
        $categories = self::where('user_id', $userId)
            ->active()
            ->with(['subcategories' => function ($query) {
                $query->where('is_active', true)->orderBy('sort_order');
            }])
            ->orderBy('sort_order')
            ->get();

        $result = [];
        foreach ($categories as $category) {
            $subcategoryNames = $category->subcategories->pluck('name')->toArray();
            $result[$category->name] = [
                'description' => $category->description,
                'subcategories' => $subcategoryNames,
                'priority' => $category->priority,
            ];
        }

        return $result;
    }
}
