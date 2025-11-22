<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAiService extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'gmail_active',
        'viber_active',
        'whatsapp_active',
        'telegram_active',
        'social_active',
        'slack_active',
        'gmail_settings',
        'viber_settings',
        'whatsapp_settings',
        'telegram_settings',
        'social_settings',
        'slack_settings',
    ];

    protected $casts = [
        'gmail_active' => 'boolean',
        'viber_active' => 'boolean',
        'whatsapp_active' => 'boolean',
        'telegram_active' => 'boolean',
        'social_active' => 'boolean',
        'slack_active' => 'boolean',
        'gmail_settings' => 'array',
        'viber_settings' => 'array',
        'whatsapp_settings' => 'array',
        'telegram_settings' => 'array',
        'social_settings' => 'array',
        'slack_settings' => 'array',
    ];

    /**
     * Service names.
     */
    public const SERVICE_GMAIL = 'gmail';
    public const SERVICE_VIBER = 'viber';
    public const SERVICE_WHATSAPP = 'whatsapp';
    public const SERVICE_TELEGRAM = 'telegram';
    public const SERVICE_SOCIAL = 'social';
    public const SERVICE_SLACK = 'slack';

    /**
     * Get the user that owns the AI service settings.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if a specific service is active.
     */
    public function isServiceActive(string $service): bool
    {
        $field = "{$service}_active";
        return $this->$field ?? false;
    }

    /**
     * Get settings for a specific service.
     */
    public function getServiceSettings(string $service): ?array
    {
        $field = "{$service}_settings";
        return $this->$field;
    }

    /**
     * Get all active services.
     */
    public function getActiveServices(): array
    {
        $services = [];

        if ($this->gmail_active) $services[] = self::SERVICE_GMAIL;
        if ($this->viber_active) $services[] = self::SERVICE_VIBER;
        if ($this->whatsapp_active) $services[] = self::SERVICE_WHATSAPP;
        if ($this->telegram_active) $services[] = self::SERVICE_TELEGRAM;
        if ($this->social_active) $services[] = self::SERVICE_SOCIAL;
        if ($this->slack_active) $services[] = self::SERVICE_SLACK;

        return $services;
    }

    /**
     * Get or create AI service settings for a user.
     */
    public static function getOrCreateForUser(int $userId): self
    {
        return self::firstOrCreate(
            ['user_id' => $userId],
            [
                'gmail_active' => false,
                'viber_active' => false,
                'whatsapp_active' => false,
                'telegram_active' => false,
                'social_active' => false,
                'slack_active' => false,
            ]
        );
    }
}
