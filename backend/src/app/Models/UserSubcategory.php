<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSubcategory extends Model
{
    use HasFactory;

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
     * Get the category that owns the subcategory.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(UserCategory::class, 'category_id');
    }

    /**
     * Scope to get active subcategories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
