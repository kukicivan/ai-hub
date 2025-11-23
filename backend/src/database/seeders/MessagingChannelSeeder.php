<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * One-time seeder to add messaging channels for existing users.
 * Run: php artisan db:seed --class=MessagingChannelSeeder
 * Delete this file after running.
 */
class MessagingChannelSeeder extends Seeder
{
    public function run(): void
    {
        // Get all users who don't have a messaging channel
        $usersWithoutChannels = DB::table('users')
            ->whereNotIn('id', function ($query) {
                $query->select('user_id')->from('messaging_channels');
            })
            ->get();

        $count = 0;
        foreach ($usersWithoutChannels as $user) {
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

        $this->command->info("Created {$count} messaging channels for existing users.");
    }
}
