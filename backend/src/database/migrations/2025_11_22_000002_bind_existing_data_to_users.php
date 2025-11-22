<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration:
     * 1. Updates user roles from old types to new enum values
     * 2. Binds all existing messaging data to user_id: 3 (ivan.kukic@gmail.com)
     * 3. Seeds default settings for all users except user_id: 3
     * 4. Seeds special goals for user_id: 3 based on the original prompt
     */
    public function up(): void
    {
        // 1. Update user roles based on existing user_type_id or user_type
        // Map old types to new role enum
        $roleMapping = [
            'super_admin' => 'super_admin',
            'admin' => 'admin',
            'tourism_organization' => 'trial',
            'travel_agency' => 'trial',
            // Any other unrecognized types default to 'trial'
        ];

        $users = DB::table('users')->get();

        foreach ($users as $user) {
            // Determine the new role
            $oldType = null;

            // Check if user has user_type_id
            if ($user->user_type_id) {
                $userType = DB::table('user_types')->where('id', $user->user_type_id)->first();
                if ($userType) {
                    $oldType = $userType->name ?? $userType->slug ?? null;
                }
            }

            // Map to new role
            $newRole = $roleMapping[$oldType] ?? 'trial';

            // Super admin check - if user has super_admin role in permissions
            $hasSuperAdminRole = DB::table('model_has_roles')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('model_has_roles.model_id', $user->id)
                ->where('model_has_roles.model_type', 'App\\Models\\User')
                ->where('roles.name', 'super_admin')
                ->exists();

            if ($hasSuperAdminRole) {
                $newRole = 'super_admin';
            }

            DB::table('users')->where('id', $user->id)->update([
                'role' => $newRole,
                'status' => 'active',
            ]);
        }

        // 2. Bind all existing messaging data to user_id: 3
        $targetUserId = 3;

        // Update messaging_channels
        DB::table('messaging_channels')
            ->whereNull('user_id')
            ->update(['user_id' => $targetUserId]);

        // Update message_threads
        DB::table('message_threads')
            ->whereNull('user_id')
            ->update(['user_id' => $targetUserId]);

        // Update messaging_messages
        DB::table('messaging_messages')
            ->whereNull('user_id')
            ->update(['user_id' => $targetUserId]);

        // Update email_actions
        DB::table('email_actions')
            ->whereNull('user_id')
            ->update(['user_id' => $targetUserId]);

        // Update messaging_sync_logs
        DB::table('messaging_sync_logs')
            ->whereNull('user_id')
            ->update(['user_id' => $targetUserId]);

        // 3. Seed default settings for all users
        $this->seedAllUserSettings($targetUserId);
    }

    /**
     * Seed settings for all users.
     * User 3 gets special goals from the original prompt.
     * Other users get default goals.
     */
    protected function seedAllUserSettings(int $specialUserId): void
    {
        $users = DB::table('users')->get();

        // Load defaults from JSON config
        $configPath = config_path('user_settings_defaults.json');
        $defaults = file_exists($configPath)
            ? json_decode(file_get_contents($configPath), true)
            : $this->getDefaultConfig();

        foreach ($users as $user) {
            // Skip if user already has settings
            $hasGoals = DB::table('user_goals')->where('user_id', $user->id)->exists();
            if ($hasGoals) {
                continue;
            }

            if ($user->id === $specialUserId) {
                // User 3 gets the original prompt goals
                $this->seedSpecialUserGoals($user->id);
            } else {
                // Other users get default goals
                $this->seedDefaultGoals($user->id, $defaults);
            }

            // All users get default categories
            $this->seedDefaultCategories($user->id, $defaults);

            // All users get default AI services (all disabled)
            $this->seedDefaultAiServices($user->id);
        }
    }

    /**
     * Seed special goals for user_id: 3 (original prompt goals).
     */
    protected function seedSpecialUserGoals(int $userId): void
    {
        $goals = [
            // Primary goals
            ['type' => 'primary', 'key' => 'main_focus', 'value' => 'Automatizacija poslovnih procesa i pronalaženje B2B partnera'],
            ['type' => 'primary', 'key' => 'key_goal', 'value' => 'Pronalaženje 3-5 projekata automatizacije u Q4 2025'],
            ['type' => 'primary', 'key' => 'strategy', 'value' => 'Pozicioniranje kao ekspert za workflow automatizaciju i AI integracije'],
            ['type' => 'primary', 'key' => 'target_clients', 'value' => 'B2B kompanije, startups sa $5K+ budgetom'],
            // Secondary goals
            ['type' => 'secondary', 'key' => 'expertise', 'value' => 'Laravel, AI integracije, workflow automatizacija, email processing'],
            ['type' => 'secondary', 'key' => 'secondary_project', 'value' => 'Razvoj nacionalne turističke platforme'],
            ['type' => 'secondary', 'key' => 'situation', 'value' => 'Hitna potreba za dodatnim prihodom kroz automatizaciju i konsalting'],
        ];

        foreach ($goals as $index => $goal) {
            DB::table('user_goals')->insert([
                'user_id' => $userId,
                'type' => $goal['type'],
                'key' => $goal['key'],
                'value' => $goal['value'],
                'is_active' => true,
                'sort_order' => $index,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Seed default goals for a user.
     */
    protected function seedDefaultGoals(int $userId, array $defaults): void
    {
        $index = 0;

        // Primary goals
        foreach ($defaults['goals']['primary'] ?? [] as $goal) {
            DB::table('user_goals')->insert([
                'user_id' => $userId,
                'type' => 'primary',
                'key' => $goal['key'],
                'value' => '', // Empty for users to fill
                'is_active' => true,
                'sort_order' => $index++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Secondary goals
        foreach ($defaults['goals']['secondary'] ?? [] as $goal) {
            DB::table('user_goals')->insert([
                'user_id' => $userId,
                'type' => 'secondary',
                'key' => $goal['key'],
                'value' => '', // Empty for users to fill
                'is_active' => true,
                'sort_order' => $index++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Seed default categories and subcategories for a user.
     */
    protected function seedDefaultCategories(int $userId, array $defaults): void
    {
        foreach ($defaults['categories'] ?? [] as $catIndex => $category) {
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

            foreach ($category['subcategories'] ?? [] as $subIndex => $subcategory) {
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

    /**
     * Seed default AI services for a user (all disabled).
     */
    protected function seedDefaultAiServices(int $userId): void
    {
        $exists = DB::table('user_ai_services')->where('user_id', $userId)->exists();
        if ($exists) {
            return;
        }

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

    /**
     * Get default config if JSON file doesn't exist.
     */
    protected function getDefaultConfig(): array
    {
        return [
            'goals' => [
                'primary' => [
                    ['key' => 'main_focus', 'value' => ''],
                    ['key' => 'key_goal', 'value' => ''],
                    ['key' => 'strategy', 'value' => ''],
                    ['key' => 'target_clients', 'value' => ''],
                ],
                'secondary' => [
                    ['key' => 'expertise', 'value' => ''],
                    ['key' => 'secondary_project', 'value' => ''],
                    ['key' => 'situation', 'value' => ''],
                ],
            ],
            'categories' => [
                [
                    'name' => 'automation_opportunity',
                    'display_name' => 'Automation Opportunity',
                    'description' => 'B2B automation prilike',
                    'priority' => 'high',
                    'subcategories' => [
                        ['name' => 'workflow_automation', 'display_name' => 'Workflow Automation'],
                        ['name' => 'ai_ml_project', 'display_name' => 'AI/ML Project'],
                    ],
                ],
                [
                    'name' => 'business_inquiry',
                    'display_name' => 'Business Inquiry',
                    'description' => 'Poslovni upiti',
                    'priority' => 'high',
                    'subcategories' => [
                        ['name' => 'project_proposal', 'display_name' => 'Project Proposal'],
                        ['name' => 'partnership', 'display_name' => 'Partnership'],
                    ],
                ],
                [
                    'name' => 'marketing',
                    'display_name' => 'Marketing',
                    'description' => 'Marketing materijali',
                    'priority' => 'low',
                    'subcategories' => [
                        ['name' => 'newsletter', 'display_name' => 'Newsletter'],
                        ['name' => 'promotion', 'display_name' => 'Promotion'],
                    ],
                ],
            ],
        ];
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove user_id bindings
        DB::table('messaging_channels')->update(['user_id' => null]);
        DB::table('message_threads')->update(['user_id' => null]);
        DB::table('messaging_messages')->update(['user_id' => null]);
        DB::table('email_actions')->update(['user_id' => null]);
        DB::table('messaging_sync_logs')->update(['user_id' => null]);

        // Remove seeded data
        DB::table('user_goals')->truncate();
        DB::table('user_subcategories')->truncate();
        DB::table('user_categories')->truncate();
        DB::table('user_ai_services')->truncate();

        // Reset roles
        DB::table('users')->update(['role' => 'trial', 'status' => 'active']);
    }
};
