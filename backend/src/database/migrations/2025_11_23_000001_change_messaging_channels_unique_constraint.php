<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Change unique constraint from channel_id to user_id
     * One user = one channel
     */
    public function up(): void
    {
        Schema::table('messaging_channels', function (Blueprint $table) {
            // Drop the unique constraint on channel_id
            $table->dropUnique(['channel_id']);

            // Add unique constraint on user_id (one user = one channel)
            $table->unique('user_id', 'messaging_channels_user_id_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messaging_channels', function (Blueprint $table) {
            // Remove unique constraint from user_id
            $table->dropUnique('messaging_channels_user_id_unique');

            // Restore unique constraint on channel_id
            $table->unique('channel_id');
        });
    }
};
