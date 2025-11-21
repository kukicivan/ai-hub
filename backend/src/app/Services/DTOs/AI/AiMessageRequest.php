<?php

namespace App\Services\DTOs\AI;

use App\Models\MessagingMessage;

/**
 * Data Transfer Object for AI message analysis request
 * Standardized structure for preparing messages for AI processing
 */
class AiMessageRequest
{
    public function __construct(
        public readonly string $id,
        public readonly string $sender,
        public readonly string $senderName,
        public readonly string $subject,
        public readonly string $content,
        public readonly string $timestamp,
        public readonly bool $hasAttachments,
        public readonly int $attachmentCount,
        public readonly array $labels,
        public readonly bool $isUnread,
        public readonly string $priority,
    ) {}

    /**
     * Create from MessagingMessage model
     */
    public static function fromModel(MessagingMessage $message): self
    {
        return new self(
            id: $message->message_id,
            sender: $message->sender['email'] ?? 'unknown',
            senderName: $message->sender['name'] ?? 'Unknown',
            subject: $message->metadata['subject'] ?? '(No Subject)',
            content: $message->content_text ?? '',
            timestamp: $message->message_timestamp->toIso8601String(),
            hasAttachments: $message->attachment_count > 0,
            attachmentCount: $message->attachment_count,
            labels: $message->metadata['labels'] ?? [],
            isUnread: $message->is_unread,
            priority: $message->priority,
        );
    }

    /**
     * Convert to array format expected by AI service
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'sender' => $this->sender,
            'sender_name' => $this->senderName,
            'subject' => $this->subject,
            'content' => $this->content,
            'timestamp' => $this->timestamp,
            'has_attachments' => $this->hasAttachments,
            'attachment_count' => $this->attachmentCount,
            'labels' => $this->labels,
            'is_unread' => $this->isUnread,
            'priority' => $this->priority,
        ];
    }

    /**
     * Convert collection of messages to DTO array
     */
    public static function fromCollection($messages): array
    {
        return $messages->map(fn($message) => self::fromModel($message)->toArray())->toArray();
    }
}
