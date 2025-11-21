<?php

namespace Database\Factories;

use App\Models\MessagingChannel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MessagingChannel>
 */
class MessagingChannelFactory extends Factory
{
    protected $model = MessagingChannel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'channel_type' => 'gmail',
            'channel_id' => 'gmail-' . $this->faker->unique()->userName(),
            'name' => $this->faker->company() . ' Gmail',
            'configuration' => [
                'app_script_url' => 'https://script.google.com/macros/s/' . $this->faker->uuid(),
                'api_key' => $this->faker->optional()->uuid(),
                'timeout' => 30,
            ],
            'is_active' => true,
            'last_sync_at' => null,
            'history_id' => null,
            'last_history_sync_at' => null,
            'health_status' => [
                'status' => 'healthy',
                'last_check' => now()->toIso8601String(),
                'connected' => true,
            ],
        ];
    }

    /**
     * Indicate that the channel is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the channel has been synced recently.
     */
    public function recentlySynced(): static
    {
        return $this->state(fn(array $attributes) => [
            'last_sync_at' => now()->subMinutes($this->faker->numberBetween(5, 60)),
        ]);
    }

    /**
     * Indicate that the channel has a valid history_id.
     */
    public function withHistory(): static
    {
        return $this->state(fn(array $attributes) => [
            'history_id' => 'history_' . $this->faker->numerify('######'),
            'last_history_sync_at' => now()->subHours($this->faker->numberBetween(1, 5)),
        ]);
    }

    /**
     * Indicate that the channel has an expired history_id.
     */
    public function withExpiredHistory(): static
    {
        return $this->state(fn(array $attributes) => [
            'history_id' => 'expired_history_' . $this->faker->numerify('######'),
            'last_history_sync_at' => now()->subDays($this->faker->numberBetween(8, 30)),
        ]);
    }

    /**
     * Indicate that the channel is unhealthy.
     */
    public function unhealthy(): static
    {
        return $this->state(fn(array $attributes) => [
            'health_status' => [
                'status' => 'unhealthy',
                'last_check' => now()->toIso8601String(),
                'connected' => false,
                'error' => 'Connection timeout',
            ],
        ]);
    }

    /**
     * Slack channel type.
     */
    public function slack(): static
    {
        return $this->state(fn(array $attributes) => [
            'channel_type' => 'slack',
            'channel_id' => 'slack-' . $this->faker->unique()->userName(),
            'name' => $this->faker->company() . ' Slack',
            'configuration' => [
                'bot_token' => 'xoxb-' . $this->faker->numerify('####################'),
                'team_id' => 'T' . $this->faker->numerify('#########'),
            ],
        ]);
    }

    /**
     * Microsoft Teams channel type.
     */
    public function teams(): static
    {
        return $this->state(fn(array $attributes) => [
            'channel_type' => 'teams',
            'channel_id' => 'teams-' . $this->faker->unique()->userName(),
            'name' => $this->faker->company() . ' Teams',
            'configuration' => [
                'tenant_id' => $this->faker->uuid(),
                'client_id' => $this->faker->uuid(),
            ],
        ]);
    }
}
