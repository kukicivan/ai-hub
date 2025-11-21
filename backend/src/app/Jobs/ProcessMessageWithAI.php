<?php

namespace App\Jobs;

use App\Models\MessagingMessage;
use App\Services\AI\AiMessageProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessMessageWithAI implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 120;

    public function __construct(public int $messageId) {}

    public function handle(AiMessageProcessor $processor): void
    {
        $message = MessagingMessage::findOrFail($this->messageId);

        if ($message->ai_status === 'completed') {
            return;
        }

        try {
            $result = $processor->processSingleMessage($message, forceReprocess: false);

            if (!$result['success']) {
                throw new \Exception($result['error']);
            }

        } catch (\Exception $e) {
            Log::error('ProcessMessageWithAI job failed', [
                'message_id' => $this->messageId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
