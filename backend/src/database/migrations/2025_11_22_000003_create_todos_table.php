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
        Schema::create('todos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('completed')->default(false);
            $table->enum('priority', ['low', 'normal', 'high'])->default('normal');
            $table->date('due_date')->nullable();
            $table->unsignedBigInteger('email_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Index for faster queries
            $table->index(['user_id', 'completed']);
            $table->index(['user_id', 'priority']);
            $table->index(['user_id', 'due_date']);

            // Foreign key for email reference (optional - emails might be in messaging_messages)
            $table->foreign('email_id')
                ->references('id')
                ->on('messaging_messages')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todos');
    }
};
