<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles, SoftDeletes;

    /**
     * Guard name for Spatie permissions.
     *
     * @var string
     */
    protected string $guard_name = 'api';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address_line_1',
        'address_line_2',
        'address_line_3',
        'city',
        'state',
        'postal_code',
        'country',
        'bio',
        'avatar',
        'user_type_id',
        'role',
        'status',
    ];

    /**
     * Role constants.
     */
    public const ROLE_SUPER_ADMIN = 'super_admin';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_TRIAL = 'trial';
    public const ROLE_PRO = 'pro';
    public const ROLE_MAX = 'max';
    public const ROLE_ENTERPRISE = 'enterprise';

    /**
     * Status constants.
     */
    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_DELETED = 'deleted';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['avatar_url'];

    /**
     * Get the avatar URL attribute.
     *
     * @return string|null
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar) {
            return null;
        }

        return Storage::disk('public')->url($this->avatar);
    }

    /**
     * Get the user type for the user.
     */
    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }

    /**
     * Check if user is of a specific type.
     */
    public function isType(string $typeName): bool
    {
        return $this->userType && $this->userType->name === $typeName;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey(); // Returns user ID
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Get the user's goals.
     */
    public function goals(): HasMany
    {
        return $this->hasMany(UserGoal::class);
    }

    /**
     * Get the user's categories.
     */
    public function categories(): HasMany
    {
        return $this->hasMany(UserCategory::class);
    }

    /**
     * Get the user's AI service settings.
     */
    public function aiServices(): HasOne
    {
        return $this->hasOne(UserAiService::class);
    }

    /**
     * Get the user's API keys.
     */
    public function apiKeys(): HasMany
    {
        return $this->hasMany(UserApiKey::class);
    }

    /**
     * Get the user's messaging channels.
     */
    public function messagingChannels(): HasMany
    {
        return $this->hasMany(MessagingChannel::class);
    }

    /**
     * Get the user's messages.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(MessagingMessage::class);
    }

    /**
     * Get the user's message threads.
     */
    public function messageThreads(): HasMany
    {
        return $this->hasMany(MessageThread::class);
    }

    /**
     * Check if user has a specific role.
     */
    public function hasUserRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is admin or super admin.
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_SUPER_ADMIN, self::ROLE_ADMIN]);
    }

    /**
     * Check if user is super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    /**
     * Check if user has premium access (pro, max, or enterprise).
     */
    public function hasPremiumAccess(): bool
    {
        return in_array($this->role, [self::ROLE_PRO, self::ROLE_MAX, self::ROLE_ENTERPRISE]);
    }

    /**
     * Get the user's goals formatted for AI prompt.
     */
    public function getGoalsForPrompt(): array
    {
        return UserGoal::getForPrompt($this->id);
    }

    /**
     * Get the user's categories formatted for AI prompt.
     */
    public function getCategoriesForPrompt(): array
    {
        return UserCategory::getForPrompt($this->id);
    }

    /**
     * Get or create AI service settings.
     */
    public function getOrCreateAiServices(): UserAiService
    {
        return UserAiService::getOrCreateForUser($this->id);
    }
}
