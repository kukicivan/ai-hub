<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserType;

class UserTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Uses updateOrCreate to be idempotent - safe to run multiple times.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'super_admin',
                'description' => 'Super Administrator with full system access',
            ],
            [
                'name' => 'admin',
                'description' => 'Administrator with limited system access',
            ],
            [
                'name' => 'trial',
                'description' => 'Trial account with limited features',
            ],
            [
                'name' => 'pro',
                'description' => 'Professional account with standard features',
            ],
            [
                'name' => 'max',
                'description' => 'Max account with advanced features',
            ],
            [
                'name' => 'enterprise',
                'description' => 'Enterprise account with full features and priority support',
            ],
        ];

        foreach ($types as $type) {
            UserType::updateOrCreate(
                ['name' => $type['name']], // Find by name
                ['description' => $type['description']] // Update description
            );
        }
    }
}
