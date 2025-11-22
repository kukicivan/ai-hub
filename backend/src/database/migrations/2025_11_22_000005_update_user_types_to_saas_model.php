<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Update user_types from tourism model to SaaS subscription model.
     *
     * Old types: super_admin, admin, tourism_organization, travel_agency, hotel
     * New types: super_admin, admin, trial, pro, max, enterprise
     *
     * Mapping:
     * - super_admin (1) -> super_admin (1) - unchanged
     * - admin (2) -> admin (2) - unchanged
     * - tourism_organization (3) -> trial (3)
     * - travel_agency (4) -> trial (3) - users reassigned
     * - hotel (5) -> trial (3) - users reassigned
     */
    public function up(): void
    {
        // Step 1: Get the IDs of old types that need to be consolidated to trial
        $tourismOrgId = DB::table('user_types')->where('name', 'tourism_organization')->value('id');
        $travelAgencyId = DB::table('user_types')->where('name', 'travel_agency')->value('id');
        $hotelId = DB::table('user_types')->where('name', 'hotel')->value('id');

        // Step 2: Update tourism_organization to become 'trial'
        if ($tourismOrgId) {
            DB::table('user_types')
                ->where('id', $tourismOrgId)
                ->update([
                    'name' => 'trial',
                    'description' => 'Trial account with limited features',
                    'updated_at' => now(),
                ]);

            // Reassign users from travel_agency and hotel to trial (tourism_org id)
            if ($travelAgencyId) {
                DB::table('users')
                    ->where('user_type_id', $travelAgencyId)
                    ->update(['user_type_id' => $tourismOrgId]);
            }

            if ($hotelId) {
                DB::table('users')
                    ->where('user_type_id', $hotelId)
                    ->update(['user_type_id' => $tourismOrgId]);
            }
        }

        // Step 3: Delete the old travel_agency and hotel types (users already reassigned)
        if ($travelAgencyId) {
            DB::table('user_types')->where('id', $travelAgencyId)->delete();
        }
        if ($hotelId) {
            DB::table('user_types')->where('id', $hotelId)->delete();
        }

        // Step 4: Add new SaaS types (pro, max, enterprise) if they don't exist
        $newTypes = [
            [
                'name' => 'pro',
                'description' => 'Professional account with standard features',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'max',
                'description' => 'Max account with advanced features',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'enterprise',
                'description' => 'Enterprise account with full features and priority support',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($newTypes as $type) {
            $exists = DB::table('user_types')->where('name', $type['name'])->exists();
            if (!$exists) {
                DB::table('user_types')->insert($type);
            }
        }

        // Step 5: Update users.role column to match new type names
        // Users with role 'tourism_organization', 'travel_agency', 'hotel' -> 'trial'
        DB::table('users')
            ->whereIn('role', ['tourism_organization', 'travel_agency', 'hotel'])
            ->update(['role' => 'trial']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Get trial type id
        $trialId = DB::table('user_types')->where('name', 'trial')->value('id');

        // Revert trial back to tourism_organization
        if ($trialId) {
            DB::table('user_types')
                ->where('id', $trialId)
                ->update([
                    'name' => 'tourism_organization',
                    'description' => 'Tourism Organization account',
                    'updated_at' => now(),
                ]);
        }

        // Re-add travel_agency and hotel
        DB::table('user_types')->insert([
            [
                'name' => 'travel_agency',
                'description' => 'Travel Agency account',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'hotel',
                'description' => 'Hotel account',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Remove new SaaS types
        DB::table('user_types')->whereIn('name', ['pro', 'max', 'enterprise'])->delete();

        // Revert user roles
        DB::table('users')
            ->where('role', 'trial')
            ->update(['role' => 'tourism_organization']);
    }
};
