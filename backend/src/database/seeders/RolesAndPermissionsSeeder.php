<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
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

        // Create roles and assign permissions

        // Super Admin
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'api']);
        $superAdminRole->syncPermissions(Permission::where('guard_name', 'api')->get());

        // Admin
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

        // Trial
        $trialRole = Role::firstOrCreate(['name' => 'trial', 'guard_name' => 'api']);
        $trialRole->syncPermissions([
            'view profile',
            'edit profile',
        ]);

        // Pro
        $proRole = Role::firstOrCreate(['name' => 'pro', 'guard_name' => 'api']);
        $proRole->syncPermissions([
            'view profile',
            'edit profile',
            'manage content',
        ]);

        // Max
        $maxRole = Role::firstOrCreate(['name' => 'max', 'guard_name' => 'api']);
        $maxRole->syncPermissions([
            'view profile',
            'edit profile',
            'manage content',
            'approve content',
        ]);

        // Enterprise
        $enterpriseRole = Role::firstOrCreate(['name' => 'enterprise', 'guard_name' => 'api']);
        $enterpriseRole->syncPermissions([
            'view profile',
            'edit profile',
            'manage content',
            'approve content',
            'view logs',
        ]);
    }
}
