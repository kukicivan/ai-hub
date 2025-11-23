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
            file_get_contents(__DIR__ . '/user_settings_defaults.json'),
            true
        );
    }

    /**
     * Seed default categories and subcategories for a user.
     * This can be called when a new user is created.
     */
    public function run(): void
    {
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

    protected function seedDefaultGoals(int $userId): void
    {
        foreach ($this->defaults['goals'] as $index => $goal) {
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
        $services = $this->defaults['ai_services'];
        $services['user_id'] = $userId;
        $services['created_at'] = now();
        $services['updated_at'] = now();

        DB::table('user_ai_services')->insert($services);
    }
}
