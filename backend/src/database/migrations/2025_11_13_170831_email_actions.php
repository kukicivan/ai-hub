<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('email_actions', function (Blueprint $table) {
            $table->id();

            // Povezivanje sa messaging_messages
            $table->foreignId('message_id')
                ->constrained('messaging_messages')
                ->onDelete('cascade');

            // Action Type
            $table->enum('action_type', [
                'RESPOND',
                'SCHEDULE',
                'TODO',
                'POSTPONE',
                'RESEARCH',
                'FOLLOW_UP',
                'ARCHIVE'
            ]);

            // Action Details
            $table->text('description');
            $table->enum('timeline', [
                'hitno',
                'ova_nedelja',
                'ovaj_mesec',
                'dugorocno',
                'nema_deadline'
            ]);
            $table->timestamp('deadline')->nullable();

            // Status Tracking
            $table->enum('status', [
                'PENDING',
                'IN_PROGRESS',
                'COMPLETED',
                'OVERDUE',
                'SNOOZED'
            ])->default('PENDING');

            // Completion Info
            $table->timestamp('completed_at')->nullable();
            $table->string('completed_by')->nullable();
            $table->text('completion_notes')->nullable();

            // Additional Data
            $table->json('metadata')->nullable(); // Za template_suggestion, platform, itd.
            $table->integer('estimated_time_minutes')->nullable();

            // Priorities & Scoring
            $table->integer('priority_score')->default(5); // 1-10
            $table->boolean('is_escalated')->default(false);

            $table->timestamps();

            // Indexes
            $table->index(['status', 'deadline']);
            $table->index(['action_type', 'status']);
            $table->index('is_escalated');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_actions');
    }
};
