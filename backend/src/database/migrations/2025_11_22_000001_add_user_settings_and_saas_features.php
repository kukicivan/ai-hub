<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration adds:
     * - User roles and soft delete to users table
     * - User goals table (primary/secondary goals)
     * - User categories and subcategories tables
     * - User AI services table (active services per user)
     * - User API keys table (encrypted storage)
     * - user_id foreign keys to existing messaging tables
     */
    public function up(): void
    {
        // 1. Modify users table - add role, status, soft delete
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'super_admin',
                'admin',
                'trial',
                'pro',
                'max',
                'enterprise'
            ])->default('trial')->after('email');

            $table->enum('status', [
                'active',
                'inactive',
                'deleted'
            ])->default('active')->after('role');

            $table->softDeletes(); // adds deleted_at column

            $table->index('role');
            $table->index('status');
        });

        // 2. Create user_goals table
        Schema::create('user_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->enum('type', ['primary', 'secondary'])->default('primary');
            $table->string('key'); // main_focus, key_goal, strategy, etc.
            $table->text('value');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'is_active']);
            $table->unique(['user_id', 'key']); // One value per key per user
        });

        // 3. Create user_categories table
        Schema::create('user_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('name'); // automation_opportunity, business_inquiry, etc.
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false); // Seeded defaults
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['user_id', 'is_active']);
            $table->unique(['user_id', 'name']);
        });

        // 4. Create user_subcategories table
        Schema::create('user_subcategories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('user_categories')->onDelete('cascade');

            $table->string('name'); // workflow_automation, ai_ml_project, etc.
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index('category_id');
            $table->unique(['category_id', 'name']);
        });

        // 5. Create user_ai_services table
        Schema::create('user_ai_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Service activation flags
            $table->boolean('gmail_active')->default(false);
            $table->boolean('viber_active')->default(false);
            $table->boolean('whatsapp_active')->default(false);
            $table->boolean('telegram_active')->default(false);
            $table->boolean('social_active')->default(false);
            $table->boolean('slack_active')->default(false);

            // Service-specific settings (JSON)
            $table->json('gmail_settings')->nullable();
            $table->json('viber_settings')->nullable();
            $table->json('whatsapp_settings')->nullable();
            $table->json('telegram_settings')->nullable();
            $table->json('social_settings')->nullable();
            $table->json('slack_settings')->nullable();

            $table->timestamps();

            $table->unique('user_id'); // One record per user
        });

        // 6. Create user_api_keys table
        Schema::create('user_api_keys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('service'); // grok, openai, github, etc.
            $table->text('encrypted_key'); // Encrypted API key
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            $table->timestamps();

            $table->unique(['user_id', 'service']);
            $table->index(['user_id', 'is_active']);
        });

        // 7. Add user_id to messaging_channels
        Schema::table('messaging_channels', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->index('user_id');
        });

        // 8. Add user_id to message_threads
        Schema::table('message_threads', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->index('user_id');
        });

        // 9. Add user_id to messaging_messages
        Schema::table('messaging_messages', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('id')
                ->constrained('users')
                ->onDelete('cascade');

            // Add primary_action field for smart action button
            $table->string('primary_action_type')->nullable()->after('ai_error_message');
            $table->string('primary_action_color')->nullable()->after('primary_action_type');

            $table->index('user_id');
        });

        // 10. Add user_id to email_actions
        Schema::table('email_actions', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('id')
                ->constrained('users')
                ->onDelete('cascade');

            // Add flag for primary action
            $table->boolean('is_primary')->default(false)->after('is_escalated');

            $table->index('user_id');
            $table->index(['message_id', 'is_primary']);
        });

        // 11. Add user_id to messaging_sync_logs
        Schema::table('messaging_sync_logs', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->index('user_id');
        });

        // 12. Create ai_processing_logs for token limit tracking
        Schema::create('ai_processing_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('message_id')->nullable()->constrained('messaging_messages')->onDelete('cascade');

            $table->enum('status', ['success', 'skipped', 'failed'])->default('success');
            $table->string('skip_reason')->nullable(); // 'token_limit_exceeded', etc.
            $table->integer('estimated_tokens')->nullable();
            $table->integer('token_limit')->nullable();
            $table->text('error_message')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['message_id', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop new tables in reverse order
        Schema::dropIfExists('ai_processing_logs');
        Schema::dropIfExists('user_api_keys');
        Schema::dropIfExists('user_ai_services');
        Schema::dropIfExists('user_subcategories');
        Schema::dropIfExists('user_categories');
        Schema::dropIfExists('user_goals');

        // Remove columns from existing tables
        Schema::table('messaging_sync_logs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('email_actions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'is_primary']);
        });

        Schema::table('messaging_messages', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'primary_action_type', 'primary_action_color']);
        });

        Schema::table('message_threads', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('messaging_channels', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'status', 'deleted_at']);
        });
    }
};
