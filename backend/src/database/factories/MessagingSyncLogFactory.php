<?php

namespace Database\Factories;

use App\Models\MessagingSyncLog;
use App\Models\MessagingChannel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MessagingSyncLog>
 */
class MessagingSyncLogFactory extends Factory
{
    protected $model = MessagingSyncLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startedAt = now()->subHours($this->faker->numberBetween(1, 24));

        return [
            'channel_id' => MessagingChannel::factory(),
            'started_at' => $startedAt,
            'completed_at' => null,
            'messages_fetched' => 0,
            'messages_processed' => 0,
            'messages_failed' => 0,
            'status' => 'running',
            'summary' => null,
            'errors' => null,
        ];
    }

    /**
     * Indicate that the sync completed successfully.
     */
    public function completed(): static
    {
        return $this->state(function (array $attributes) {
            $messagesFetched = $this->faker->numberBetween(1, 100);
            $messagesFailed = $this->faker->numberBetween(0, 5);
            $messagesProcessed = $messagesFetched - $messagesFailed;
            $duration = $this->faker->randomFloat(2, 0.5, 30);

            return [
                'completed_at' => $attributes['started_at']->addSeconds((int)$duration),
                'messages_fetched' => $messagesFetched,
                'messages_processed' => $messagesProcessed,
                'messages_failed' => $messagesFailed,
                'status' => 'completed',
                'summary' => [
                    'duration' => $duration,
                    'sync_method' => $this->faker->randomElement(['timestamp', 'history']),
                    'avg_processing_time' => round($duration / max($messagesFetched, 1), 3),
                ],
            ];
        });
    }

    /**
     * Indicate that the sync failed.
     */
    public function failed(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'completed_at' => $attributes['started_at']->addSeconds($this->faker->numberBetween(1, 60)),
                'status' => 'failed',
                'errors' => $this->faker->randomElement([
                    'Connection timeout',
                    'API rate limit exceeded',
                    'Authentication failed',
                    'Invalid channel configuration',
                    'Database connection lost',
                ]),
            ];
        });
    }

    /**
     * Indicate that the sync is currently running.
     */
    public function running(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'running',
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the sync processed many messages.
     */
    public function withManyMessages(int $count = 500): static
    {
        return $this->state(function (array $attributes) use ($count) {
            $messagesFailed = $this->faker->numberBetween(0, (int)($count * 0.05)); // Max 5% failure
            $messagesProcessed = $count - $messagesFailed;
            $duration = $this->faker->randomFloat(2, 10, 120);

            return [
                'completed_at' => $attributes['started_at']->addSeconds((int)$duration),
                'messages_fetched' => $count,
                'messages_processed' => $messagesProcessed,
                'messages_failed' => $messagesFailed,
                'status' => 'completed',
                'summary' => [
                    'duration' => $duration,
                    'sync_method' => 'timestamp',
                    'avg_processing_time' => round($duration / $count, 3),
                ],
            ];
        });
    }

    /**
     * Indicate that the sync used history API.
     */
    public function viaHistory(): static
    {
        return $this->state(fn(array $attributes) => [
            'summary' => array_merge($attributes['summary'] ?? [], [
                'sync_method' => 'history',
            ]),
        ]);
    }

    /**
     * Indicate that the sync used timestamp method.
     */
    public function viaTimestamp(): static
    {
        return $this->state(fn(array $attributes) => [
            'summary' => array_merge($attributes['summary'] ?? [], [
                'sync_method' => 'timestamp',
            ]),
        ]);
    }

    /**
     * Indicate no messages were fetched (empty sync).
     */
    public function empty(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'completed_at' => $attributes['started_at']->addSeconds($this->faker->numberBetween(1, 5)),
                'messages_fetched' => 0,
                'messages_processed' => 0,
                'messages_failed' => 0,
                'status' => 'completed',
                'summary' => [
                    'duration' => $this->faker->randomFloat(2, 0.5, 5),
                    'sync_method' => 'timestamp',
                ],
            ];
        });
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
     * Set specific time range.
     */
    public function startedAt(\DateTimeInterface $datetime): static
    {
        return $this->state(fn(array $attributes) => [
            'started_at' => $datetime,
        ]);
    }
}
