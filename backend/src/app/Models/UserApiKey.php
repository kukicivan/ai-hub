<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class UserApiKey extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service',
        'encrypted_key',
        'is_active',
        'last_used_at',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    protected $hidden = [
        'encrypted_key',
    ];

    /**
     * Service names.
     */
    public const SERVICE_GROK = 'grok';
    public const SERVICE_OPENAI = 'openai';
    public const SERVICE_GITHUB = 'github';
    public const SERVICE_SLACK = 'slack';

    /**
     * Get the user that owns the API key.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Set the API key (encrypts automatically).
     */
    public function setKeyAttribute(string $value): void
    {
        $this->attributes['encrypted_key'] = Crypt::encryptString($value);
    }

    /**
     * Get the decrypted API key.
     */
    public function getDecryptedKey(): ?string
    {
        if (empty($this->encrypted_key)) {
            return null;
        }

        try {
            return Crypt::decryptString($this->encrypted_key);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Check if the key is expired.
     */
    public function isExpired(): bool
    {
        if (!$this->expires_at) {
            return false;
        }

        return $this->expires_at->isPast();
    }

    /**
     * Check if the key is valid (active and not expired).
     */
    public function isValid(): bool
    {
        return $this->is_active && !$this->isExpired();
    }

    /**
     * Mark the key as used.
     */
    public function markAsUsed(): void
    {
        $this->update(['last_used_at' => now()]);
    }

    /**
     * Scope to get active keys.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the masked key for display (shows last 4 characters).
     */
    public function getMaskedKey(): string
    {
        $key = $this->getDecryptedKey();
        if (!$key || strlen($key) < 8) {
            return '••••••••';
        }

        return '••••••••' . substr($key, -4);
    }

    /**
     * Get API key for a user and service.
     */
    public static function getForService(int $userId, string $service): ?self
    {
        return self::where('user_id', $userId)
            ->where('service', $service)
            ->active()
            ->first();
    }
}
