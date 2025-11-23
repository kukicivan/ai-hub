<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * One-time seeder to add messaging channels for existing users.
 *
 * BEFORE RUNNING: Change unique constraint in database:
 * ALTER TABLE messaging_channels DROP INDEX messaging_channels_channel_id_unique;
 * ALTER TABLE messaging_channels ADD UNIQUE INDEX messaging_channels_user_channel_unique (user_id, channel_id);
 *
 * Run: php artisan db:seed --class=MessagingChannelSeeder
 * Delete this file after running.
 */
class MessagingChannelSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('users')->get();
        $count = 0;

        foreach ($users as $user) {
            // Check if this user already has a gmail-primary channel
            $exists = DB::table('messaging_channels')
                ->where('user_id', $user->id)
                ->where('channel_id', 'gmail-primary')
                ->exists();

            if ($exists) {
                continue;
            }

            DB::table('messaging_channels')->insert([
                'user_id' => $user->id,
                'channel_type' => 'email',
                'channel_id' => 'gmail-primary',
                'name' => 'Gmail Primary Channel',
                'configuration' => json_encode(['description' => 'Automatically created default channel for Gmail primary inbox']),
                'is_active' => true,
                'last_sync_at' => null,
                'history_id' => null,
                'last_history_sync_at' => null,
                'health_status' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $count++;
        }

        $this->command->info("Created {$count} messaging channels for users.");
    }
}
