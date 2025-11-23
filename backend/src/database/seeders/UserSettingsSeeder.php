<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSettingsSeeder extends Seeder
{
    protected array $defaults;

    public function __construct()
    {
        $this->defaults = json_decode(
            file_get_contents(config_path('user_settings_defaults.json')),
            true
        );
    }

    /**
     * Seed default categories and subcategories for a user.
     * This can be called when a new user is created.
     */
    public function run(): void
    {
        // Seed settings for users without categories
        $usersWithoutSettings = DB::table('users')
            ->whereNotIn('id', function ($query) {
                $query->select('user_id')->from('user_categories');
            })
            ->get();

        foreach ($usersWithoutSettings as $user) {
            $this->seedUserDefaults($user->id);
        }

        // Seed messaging channels for users without them
        $usersWithoutChannels = DB::table('users')
            ->whereNotIn('id', function ($query) {
                $query->select('user_id')->from('messaging_channels');
            })
            ->get();

        foreach ($usersWithoutChannels as $user) {
            $this->seedDefaultMessagingChannel($user->id);
        }
    }

    /**
     * Seed default settings for a specific user.
     */
    public function seedUserDefaults(int $userId): void
    {
        $this->seedDefaultGoals($userId);
        $this->seedDefaultCategories($userId);
        $this->seedDefaultAiServices($userId);
        $this->seedDefaultMessagingChannel($userId);
    }

    protected function seedDefaultGoals(int $userId): void
    {
        $sortOrder = 0;

        // Primary goals
        foreach ($this->defaults['goals']['primary'] as $goal) {
            DB::table('user_goals')->insert([
                'user_id' => $userId,
                'type' => 'primary',
                'key' => $goal['key'],
                'value' => '',
                'is_active' => true,
                'sort_order' => $sortOrder++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Secondary goals
        foreach ($this->defaults['goals']['secondary'] as $goal) {
            DB::table('user_goals')->insert([
                'user_id' => $userId,
                'type' => 'secondary',
                'key' => $goal['key'],
                'value' => '',
                'is_active' => true,
                'sort_order' => $sortOrder++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    protected function seedDefaultCategories(int $userId): void
    {
        foreach ($this->defaults['categories'] as $catIndex => $category) {
            $categoryId = DB::table('user_categories')->insertGetId([
                'user_id' => $userId,
                'name' => $category['name'],
                'display_name' => $category['display_name'],
                'description' => $category['description'],
                'priority' => $category['priority'],
                'is_active' => true,
                'is_default' => true,
                'sort_order' => $catIndex,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($category['subcategories'] as $subIndex => $subcategory) {
                DB::table('user_subcategories')->insert([
                    'category_id' => $categoryId,
                    'name' => $subcategory['name'],
                    'display_name' => $subcategory['display_name'],
                    'is_active' => true,
                    'sort_order' => $subIndex,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    protected function seedDefaultAiServices(int $userId): void
    {
        DB::table('user_ai_services')->insert([
            'user_id' => $userId,
            'gmail_active' => false,
            'viber_active' => false,
            'whatsapp_active' => false,
            'telegram_active' => false,
            'social_active' => false,
            'slack_active' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    protected function seedDefaultMessagingChannel(int $userId): void
    {
        // Check if channel already exists for this user
        $exists = DB::table('messaging_channels')
            ->where('user_id', $userId)
            ->where('channel_id', 'gmail-primary')
            ->exists();

        if ($exists) {
            return;
        }

        DB::table('messaging_channels')->insert([
            'user_id' => $userId,
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
    }
}
