<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserType;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * This seeder can be run safely to assign permissions to existing superadmin users.
 * It uses firstOrCreate and syncPermissions, so it's idempotent.
 *
 * Run: php artisan db:seed --class=AssignSuperAdminPermissionsSeeder
 */
class AssignSuperAdminPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create all required permissions with 'api' guard
        $permissions = [
            // User permissions
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Profile permissions
            'view profile',
            'edit profile',

            // Content management permissions
            'manage content',
            'approve content',

            // System permissions
            'manage system',
            'view logs',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'api']);
        }

        $this->command->info('Created ' . count($permissions) . ' permissions with api guard.');

        // Create super_admin role with 'api' guard
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'api']);
        $superAdminRole->syncPermissions(Permission::where('guard_name', 'api')->get());

        $this->command->info('Created super_admin role and assigned all permissions.');

        // Create admin role with 'api' guard
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'api']);
        $adminRole->syncPermissions([
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view profile',
            'edit profile',
            'manage content',
            'approve content',
            'view logs',
        ]);

        $this->command->info('Created admin role with permissions.');

        // Find superadmin user type
        $superAdminType = UserType::where('name', 'super_admin')->first();

        if ($superAdminType) {
            // Find all users with superadmin type and assign role
            $superAdminUsers = User::where('user_type_id', $superAdminType->id)->get();

            foreach ($superAdminUsers as $user) {
                $user->syncRoles(['super_admin']);
                $this->command->info("Assigned super_admin role to: {$user->email}");
            }

            $this->command->info("Assigned super_admin role to {$superAdminUsers->count()} users.");
        } else {
            $this->command->warn('UserType "super_admin" not found. Trying to find admin users by email...');

            // Fallback: assign to known admin emails
            $adminEmails = ['admin@example.com'];
            foreach ($adminEmails as $email) {
                $user = User::where('email', $email)->first();
                if ($user) {
                    $user->syncRoles(['super_admin']);
                    $this->command->info("Assigned super_admin role to: {$user->email}");
                }
            }
        }

        // Clear cache again to ensure changes take effect
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $this->command->info('Permission cache cleared. Super admin setup complete!');
    }
}
