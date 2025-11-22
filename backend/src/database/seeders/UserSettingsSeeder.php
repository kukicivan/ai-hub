<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSettingsSeeder extends Seeder
{
    /**
     * Seed default categories and subcategories for a user.
     * This can be called when a new user is created.
     */
    public function run(): void
    {
        // Get all users that don't have categories yet
        $users = DB::table('users')
            ->whereNotIn('id', function ($query) {
                $query->select('user_id')->from('user_categories');
            })
            ->get();

        foreach ($users as $user) {
            $this->seedUserDefaults($user->id);
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
    }

    /**
     * Seed default goals for a user.
     */
    protected function seedDefaultGoals(int $userId): void
    {
        $goals = [
            ['key' => 'main_focus', 'value' => 'Automatizacija poslovnih procesa i pronalaženje B2B partnera', 'type' => 'primary'],
            ['key' => 'key_goal', 'value' => 'Pronalaženje 3-5 projekata automatizacije', 'type' => 'primary'],
            ['key' => 'strategy', 'value' => 'Pozicioniranje kao ekspert za workflow automatizaciju i AI integracije', 'type' => 'primary'],
            ['key' => 'target_clients', 'value' => 'B2B kompanije, startups', 'type' => 'primary'],
            ['key' => 'expertise', 'value' => 'Laravel, AI integracije, workflow automatizacija, email processing', 'type' => 'secondary'],
            ['key' => 'secondary_project', 'value' => '', 'type' => 'secondary'],
            ['key' => 'situation', 'value' => '', 'type' => 'secondary'],
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
     * Seed default categories and subcategories for a user.
     */
    protected function seedDefaultCategories(int $userId): void
    {
        $categories = [
            [
                'name' => 'automation_opportunity',
                'display_name' => 'Automation Opportunity',
                'description' => 'B2B automation prilike, consulting zahtevi',
                'priority' => 'high',
                'subcategories' => [
                    ['name' => 'workflow_automation', 'display_name' => 'Workflow Automation'],
                    ['name' => 'ai_ml_project', 'display_name' => 'AI/ML Project'],
                    ['name' => 'digital_transformation', 'display_name' => 'Digital Transformation'],
                ],
            ],
            [
                'name' => 'business_inquiry',
                'display_name' => 'Business Inquiry',
                'description' => 'Direktni zahtevi, projekti, partnerships',
                'priority' => 'high',
                'subcategories' => [
                    ['name' => 'project_proposal', 'display_name' => 'Project Proposal'],
                    ['name' => 'partnership', 'display_name' => 'Partnership'],
                    ['name' => 'consulting_request', 'display_name' => 'Consulting Request'],
                ],
            ],
            [
                'name' => 'networking',
                'display_name' => 'Networking',
                'description' => 'Events, community, collaboration',
                'priority' => 'medium',
                'subcategories' => [
                    ['name' => 'event', 'display_name' => 'Event'],
                    ['name' => 'community', 'display_name' => 'Community'],
                    ['name' => 'collaboration', 'display_name' => 'Collaboration'],
                ],
            ],
            [
                'name' => 'financial',
                'display_name' => 'Financial',
                'description' => 'Računi, invoices, payments',
                'priority' => 'medium',
                'subcategories' => [
                    ['name' => 'invoice', 'display_name' => 'Invoice'],
                    ['name' => 'payment', 'display_name' => 'Payment'],
                    ['name' => 'billing', 'display_name' => 'Billing'],
                ],
            ],
            [
                'name' => 'marketing',
                'display_name' => 'Marketing',
                'description' => 'Newsletters, promo, bulk emails',
                'priority' => 'low',
                'subcategories' => [
                    ['name' => 'newsletter', 'display_name' => 'Newsletter'],
                    ['name' => 'promotion', 'display_name' => 'Promotion'],
                    ['name' => 'announcement', 'display_name' => 'Announcement'],
                ],
            ],
        ];

        foreach ($categories as $catIndex => $category) {
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

    /**
     * Seed default AI services for a user.
     */
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
}
