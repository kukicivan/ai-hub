<?php

namespace Database\Factories;


use App\Models\MessagingMessage;
use App\Models\MessagingChannel;
use App\Models\MessageThread;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MessagingMessage>
 */
class MessagingMessageFactory extends Factory
{
    protected $model = MessagingMessage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $senderEmail = $this->faker->safeEmail();
        $senderName = $this->faker->name();
        $recipientEmail = $this->faker->safeEmail();
        $recipientName = $this->faker->name();

        return [
            'message_id' => $this->faker->unique()->uuid(),
            'channel_id' => MessagingChannel::factory(),
            'thread_id' => 'thread_' . $this->faker->numerify('################'),
            'message_number' => 1,
            'parent_message_id' => null,
            'message_timestamp' => now()->subHours($this->faker->numberBetween(1, 48)),
            'received_date' => now()->subHours($this->faker->numberBetween(1, 48)),

            // Sender
            'sender' => [
                'email' => $senderEmail,
                'name' => $senderName,
                'raw' => "{$senderName} <{$senderEmail}>",
                'id' => $senderEmail,
            ],

            // Recipients
            'recipients' => [
                'to' => [
                    [
                        'email' => $recipientEmail,
                        'name' => $recipientName,
                        'raw' => "{$recipientName} <{$recipientEmail}>",
                    ]
                ],
                'cc' => [],
                'bcc' => [],
                'replyTo' => null,
            ],

            // Content
            'content_text' => $this->faker->paragraphs(3, true),
            'content_html' => '<p>' . implode('</p><p>', $this->faker->paragraphs(3)) . '</p>',
            'content_snippet' => $this->faker->sentence(20),
            'content_raw' => null,

            // Attachments
            'attachment_count' => 0,
            'reactions' => [],

            // Metadata
            'metadata' => [
                'subject' => $this->faker->sentence(6),
                'priority' => 'normal',
                'labels' => [],
                'headers' => [],
            ],

            // Gmail flags
            'is_draft' => false,
            'is_unread' => $this->faker->boolean(30), // 30% unread
            'is_starred' => $this->faker->boolean(10), // 10% starred
            'is_in_trash' => false,
            'is_in_inbox' => true,
            'is_in_chats' => false,
            'is_spam' => false,

            // Priority
            'priority' => 'normal',

            // Status
            'status' => 'new',

            // AI
            'ai_analysis' => null,
            'ai_status' => 'pending',
            'ai_processed_at' => null,

            // Timestamps
            'synced_at' => now(),
        ];
    }

    /**
     * Indicate that the message is unread.
     */
    public function unread(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_unread' => true,
        ]);
    }

    /**
     * Indicate that the message is starred.
     */
    public function starred(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_starred' => true,
        ]);
    }

    /**
     * Indicate that the message is in trash.
     */
    public function trashed(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_in_trash' => true,
            'is_in_inbox' => false,
        ]);
    }

    /**
     * Indicate that the message is spam.
     */
    public function spam(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_spam' => true,
            'is_in_inbox' => false,
        ]);
    }

    /**
     * Indicate that the message is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_draft' => true,
        ]);
    }

    /**
     * Indicate that the message has high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn(array $attributes) => [
            'priority' => 'high',
            'metadata' => array_merge($attributes['metadata'] ?? [], [
                'priority' => 'high',
            ]),
        ]);
    }

    /**
     * Indicate that the message has attachments.
     */
    public function withAttachments(int $count = 1): static
    {
        return $this->state(fn(array $attributes) => [
            'attachment_count' => $count,
        ]);
    }

    /**
     * Indicate that the message is a reply (has parent).
     */
    public function reply(string $parentMessageId = null): static
    {
        return $this->state(fn(array $attributes) => [
            'parent_message_id' => $parentMessageId ?? 'parent_' . $this->faker->uuid(),
            'message_number' => $this->faker->numberBetween(2, 10),
        ]);
    }

    /**
     * Indicate that the message has been processed by AI.
     */
    public function aiProcessed(): static
    {
        return $this->state(fn(array $attributes) => [
            'ai_status' => 'completed',
            'ai_processed_at' => now()->subMinutes($this->faker->numberBetween(5, 60)),
            'ai_analysis' => [
                'classification' => [
                    'primary_category' => $this->faker->randomElement(['WORK', 'PERSONAL', 'FINANCE', 'MARKETING']),
                    'confidence' => $this->faker->numberBetween(80, 99),
                ],
                'sentiment' => [
                    'type' => $this->faker->randomElement(['positive', 'neutral', 'negative']),
                    'score' => $this->faker->randomFloat(2, 0, 1),
                    'urgency' => $this->faker->randomElement(['low', 'medium', 'high']),
                ],
                'summary' => $this->faker->sentence(12),
                'key_points' => $this->faker->sentences(3),
                'action_items' => $this->faker->sentences(2),
            ],
        ]);
    }

    /**
     * Indicate that AI processing failed.
     */
    public function aiFailed(): static
    {
        return $this->state(fn(array $attributes) => [
            'ai_status' => 'failed',
            'ai_analysis' => [
                'error' => 'AI processing failed: Rate limit exceeded',
                'failed_at' => now()->subMinutes(5)->toIso8601String(),
            ],
        ]);
    }

    /**
     * Indicate that the message is currently being processed by AI.
     */
    public function aiProcessing(): static
    {
        return $this->state(fn(array $attributes) => [
            'ai_status' => 'processing',
        ]);
    }

    /**
     * Set specific thread_id.
     */
    public function forThread(string $threadId): static
    {
        return $this->state(fn(array $attributes) => [
            'thread_id' => $threadId,
        ]);
    }

    /**
     * Set specific channel.
     */
    public function forChannel(MessagingChannel $channel): static
    {
        return $this->state(fn(array $attributes) => [
            'channel_id' => $channel->id,
        ]);
    }

    /**
     * Create with multiple recipients (cc, bcc).
     */
    public function withMultipleRecipients(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'recipients' => [
                    'to' => [
                        [
                            'email' => $this->faker->safeEmail(),
                            'name' => $this->faker->name(),
                            'raw' => $this->faker->name() . ' <' . $this->faker->safeEmail() . '>',
                        ]
                    ],
                    'cc' => [
                        [
                            'email' => $this->faker->safeEmail(),
                            'name' => $this->faker->name(),
                            'raw' => $this->faker->name() . ' <' . $this->faker->safeEmail() . '>',
                        ]
                    ],
                    'bcc' => [
                        [
                            'email' => $this->faker->safeEmail(),
                            'name' => $this->faker->name(),
                            'raw' => $this->faker->name() . ' <' . $this->faker->safeEmail() . '>',
                        ]
                    ],
                    'replyTo' => null,
                ],
            ];
        });
    }
}
