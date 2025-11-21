<?php

namespace Database\Factories;

use App\Models\MessageThread;
use App\Models\MessagingChannel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MessageThread>
 */
class MessageThreadFactory extends Factory
{
    protected $model = MessageThread::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'channel_id' => MessagingChannel::factory(),
            'thread_id' => 'thread_' . $this->faker->unique()->numerify('################'),
            'subject' => $this->faker->sentence(6),
            'participants' => [
                [
                    'email' => $this->faker->safeEmail(),
                    'name' => $this->faker->name(),
                    'role' => 'sender',
                ],
                [
                    'email' => $this->faker->safeEmail(),
                    'name' => $this->faker->name(),
                    'role' => 'to',
                ],
            ],
            'last_message_at' => now()->subHours($this->faker->numberBetween(1, 48)),
            'message_count' => $this->faker->numberBetween(1, 10),
            'is_unread' => $this->faker->boolean(30),
            'has_starred_messages' => $this->faker->boolean(10),
            'is_important' => $this->faker->boolean(15),
            'is_in_inbox' => true,
            'is_in_chats' => false,
            'is_in_spam' => false,
            'is_in_trash' => false,
            'is_in_priority_inbox' => $this->faker->boolean(20),
            'permalink' => 'https://mail.google.com/mail/u/0/#inbox/' . $this->faker->numerify('################'),
            'labels' => [],
            'ai_analysis' => null,
            'ai_status' => 'pending',
            'ai_processed_at' => null,
        ];
    }

    /**
     * Indicate that the thread is unread.
     */
    public function unread(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_unread' => true,
        ]);
    }

    /**
     * Indicate that the thread is important.
     */
    public function important(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_important' => true,
        ]);
    }

    /**
     * Indicate that the thread has many messages.
     */
    public function withManyMessages(int $count = 20): static
    {
        return $this->state(fn(array $attributes) => [
            'message_count' => $count,
        ]);
    }
}
