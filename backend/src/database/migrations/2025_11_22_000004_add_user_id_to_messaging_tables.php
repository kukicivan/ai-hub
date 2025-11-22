<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add user_id to messaging tables for multi-tenant isolation
     */
    public function up(): void
    {
        // Add user_id to messaging_channels (root table - others cascade from here)
        if (!Schema::hasColumn('messaging_channels', 'user_id')) {
            Schema::table('messaging_channels', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Add user_id to messaging_labels
        if (!Schema::hasColumn('messaging_labels', 'user_id')) {
            Schema::table('messaging_labels', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Add user_id to messaging_attachments
        if (!Schema::hasColumn('messaging_attachments', 'user_id')) {
            Schema::table('messaging_attachments', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Add user_id to messaging_headers
        if (!Schema::hasColumn('messaging_headers', 'user_id')) {
            Schema::table('messaging_headers', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Add user_id to messaging_processing_jobs
        if (!Schema::hasColumn('messaging_processing_jobs', 'user_id')) {
            Schema::table('messaging_processing_jobs', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Add user_id to message_label (pivot table)
        if (!Schema::hasColumn('message_label', 'user_id')) {
            Schema::table('message_label', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Add user_id to message_threads
        if (!Schema::hasColumn('message_threads', 'user_id')) {
            Schema::table('message_threads', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Add user_id to messaging_messages
        if (!Schema::hasColumn('messaging_messages', 'user_id')) {
            Schema::table('messaging_messages', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Add user_id to thread_label (pivot table)
        if (!Schema::hasColumn('thread_label', 'user_id')) {
            Schema::table('thread_label', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
                $table->index('user_id');
            });
        }

        // Bind existing data to default user (user_id = 3)
        $defaultUserId = 3;

        // Check if user exists
        $userExists = DB::table('users')->where('id', $defaultUserId)->exists();

        if ($userExists) {
            DB::table('messaging_channels')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
            DB::table('messaging_labels')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
            DB::table('messaging_attachments')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
            DB::table('messaging_headers')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
            DB::table('messaging_processing_jobs')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
            DB::table('message_label')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
            DB::table('message_threads')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
            DB::table('messaging_messages')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
            DB::table('thread_label')->whereNull('user_id')->update(['user_id' => $defaultUserId]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messaging_channels', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('messaging_labels', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('messaging_attachments', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('messaging_headers', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('messaging_processing_jobs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('message_label', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('message_threads', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('messaging_messages', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('thread_label', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
