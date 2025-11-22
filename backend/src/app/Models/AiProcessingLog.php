<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiProcessingLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'message_id',
        'status',
        'skip_reason',
        'estimated_tokens',
        'token_limit',
        'error_message',
    ];

    protected $casts = [
        'estimated_tokens' => 'integer',
        'token_limit' => 'integer',
    ];

    /**
     * Status constants.
     */
    public const STATUS_SUCCESS = 'success';
    public const STATUS_SKIPPED = 'skipped';
    public const STATUS_FAILED = 'failed';

    /**
     * Skip reason constants.
     */
    public const SKIP_REASON_TOKEN_LIMIT = 'token_limit_exceeded';
    public const SKIP_REASON_INVALID_CONTENT = 'invalid_content';
    public const SKIP_REASON_RATE_LIMIT = 'rate_limit';

    /**
     * Default token limit.
     */
    public const DEFAULT_TOKEN_LIMIT = 12000;

    /**
     * Get the user that owns the log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the message this log is for.
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(MessagingMessage::class, 'message_id');
    }

    /**
     * Log a successful processing.
     */
    public static function logSuccess(int $userId, int $messageId, int $tokens): self
    {
        return self::create([
            'user_id' => $userId,
            'message_id' => $messageId,
            'status' => self::STATUS_SUCCESS,
            'estimated_tokens' => $tokens,
        ]);
    }

    /**
     * Log a skipped message due to token limit.
     */
    public static function logTokenLimitSkip(int $userId, int $messageId, int $estimatedTokens, int $tokenLimit = self::DEFAULT_TOKEN_LIMIT): self
    {
        return self::create([
            'user_id' => $userId,
            'message_id' => $messageId,
            'status' => self::STATUS_SKIPPED,
            'skip_reason' => self::SKIP_REASON_TOKEN_LIMIT,
            'estimated_tokens' => $estimatedTokens,
            'token_limit' => $tokenLimit,
            'error_message' => "Message skipped: estimated tokens ({$estimatedTokens}) exceeds limit ({$tokenLimit})",
        ]);
    }

    /**
     * Log a failed processing.
     */
    public static function logFailure(int $userId, int $messageId, string $errorMessage, ?int $tokens = null): self
    {
        return self::create([
            'user_id' => $userId,
            'message_id' => $messageId,
            'status' => self::STATUS_FAILED,
            'estimated_tokens' => $tokens,
            'error_message' => $errorMessage,
        ]);
    }

    /**
     * Scope to get skipped logs.
     */
    public function scopeSkipped($query)
    {
        return $query->where('status', self::STATUS_SKIPPED);
    }

    /**
     * Scope to get logs for token limit exceeded.
     */
    public function scopeTokenLimitExceeded($query)
    {
        return $query->where('skip_reason', self::SKIP_REASON_TOKEN_LIMIT);
    }
}
