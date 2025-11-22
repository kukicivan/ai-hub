<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add user_id to thread_label table for multi-tenant isolation
     */
    public function up(): void
    {
        // Add user_id to thread_label (pivot table)
        if (!Schema::hasColumn('thread_label', 'user_id')) {
            Schema::table('thread_label', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Bind existing data to default user (user_id = 3)
        $defaultUserId = 3;
        $userExists = DB::table('users')->where('id', $defaultUserId)->exists();

        if ($userExists) {
            DB::table('thread_label')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('thread_label', 'user_id')) {
            Schema::table('thread_label', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
                $table->dropIndex(['user_id']);
                $table->dropColumn('user_id');
            });
        }
    }
};
