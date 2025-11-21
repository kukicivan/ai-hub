<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Email Subcategory Model
 * 
 * @property int $id
 * @property int $category_id
 * @property string $name
 * @property string $display_name
 * @property string|null $description
 * @property bool $is_active
 * @property int $sort_order
 */
class EmailSubcategory extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'display_name',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get the category that owns the subcategory
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(EmailCategory::class, 'category_id');
    }

    /**
     * Scope for active subcategories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
