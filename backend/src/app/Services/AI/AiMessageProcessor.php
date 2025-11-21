<?php

namespace App\Services\AI;

use App\Models\MessagingMessage;
use App\Services\DTOs\AI\AiMessageRequest;
use App\Services\DTOs\AI\AiMessageResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * AI message processor - handles ONLY Groq AI processing
 * No Gmail sync, no queue management
 */
class AiMessageProcessor
{
    public function __construct(
        protected EmailAnalyzerService $analyzer
    ) {}

    /**
     * Process a single message
     */
    public function processSingleMessage(MessagingMessage $message, bool $forceReprocess = false): array
    {
        if (!$forceReprocess && $message->ai_status === 'completed' && !empty($message->ai_analysis)) {
            return [
                'success' => true,
                'skipped' => true,
                'reason' => 'Already processed'
            ];
        }

        $message->update(['ai_status' => 'processing']);

        try {
            $requestDto = AiMessageRequest::fromModel($message);
            $aiResult = $this->analyzer->analyzeEmails([$requestDto->toArray()]);

            if (!$aiResult['success']) {
                throw new \Exception($aiResult['error'] ?? 'AI analysis failed');
            }

            $aiData = is_array($aiResult['data']) && isset($aiResult['data'][0])
                ? $aiResult['data'][0]
                : $aiResult['data'];

            $responseDto = AiMessageResponse::fromArray($aiData);

            $this->updateMessageWithAiResult($message, $responseDto, $aiResult['meta'] ?? []);

            return [
                'success' => true,
                'data' => $responseDto->toArray(),
                'meta' => $aiResult['meta'] ?? []
            ];

        } catch (\Exception $e) {
            $this->markMessageAsFailed($message, $e->getMessage());

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Process a batch of messages
     */
    public function processBatch($messages, bool $forceReprocess = false): array
    {
        $messages = $messages instanceof Collection ? $messages : collect($messages);

        $toProcess = $messages->filter(function ($message) use ($forceReprocess) {
            return $forceReprocess ||
                $message->ai_status === 'pending' ||
                $message->ai_status === 'failed' ||
                empty($message->ai_analysis);
        });

        if ($toProcess->isEmpty()) {
            return [
                'success' => true,
                'processed' => 0,
                'skipped' => $messages->count(),
                'failed' => 0
            ];
        }

        $toProcess->each(fn($msg) => $msg->update(['ai_status' => 'processing']));

        try {
            $requestDtos = AiMessageRequest::fromCollection($toProcess);
            $aiResult = $this->analyzer->analyzeEmails($requestDtos);

            if (!$aiResult['success']) {
                throw new \Exception($aiResult['error'] ?? 'Batch AI analysis failed');
            }

            $processed = 0;
            $failed = 0;

            $dataArray = $aiResult['data'];

            if (!is_array($dataArray)) {
                throw new \Exception('AI response data is not an array');
            }


            // TODO: Test to see if this normalize option is included in unit test for batch processing
            if (isset($dataArray['id'])) {
                $dataArray = [$dataArray];
            }

            foreach ($dataArray as $aiData) {
                try {
                    if (!is_array($aiData)) {
                        throw new \Exception('AI response item is not an array');
                    }

                    $responseDto = AiMessageResponse::fromArray($aiData);
                    $message = $messages->firstWhere('message_id', $responseDto->id);

                    if ($message) {
                        $this->updateMessageWithAiResult($message, $responseDto, $aiResult['meta'] ?? []);
                        $processed++;
                    }
                } catch (\Exception $e) {
                    $failed++;
                    $messageId = $aiData['id'] ?? 'unknown';

                    Log::error('AI batch item failed', [
                        'message_id' => $messageId,
                        'error' => $e->getMessage()
                    ]);

                    $failedMessage = $messages->firstWhere('message_id', $messageId);
                    if ($failedMessage) {
                        $this->markMessageAsFailed($failedMessage, $e->getMessage());
                    }
                }
            }

            return [
                'success' => true,
                'processed' => $processed,
                'skipped' => $messages->count() - $toProcess->count(),
                'failed' => $failed,
                'meta' => $aiResult['meta'] ?? []
            ];

        } catch (\Exception $e) {
            Log::error('AI batch processing failed', [
                'error' => $e->getMessage()
            ]);

            $toProcess->each(fn($msg) => $this->markMessageAsFailed($msg, $e->getMessage()));

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'processed' => 0,
                'failed' => $toProcess->count()
            ];
        }
    }

    /**
     * Update the message with a successful AI result
     */
    private function updateMessageWithAiResult(
        MessagingMessage $message,
        AiMessageResponse $responseDto,
        array $meta
    ): void {
        DB::transaction(function () use ($message, $responseDto, $meta) {
            $message->update([
                'ai_analysis' => $responseDto->toArray(),
                'ai_status' => 'completed',
                'ai_processed_at' => now(),
                'ai_prompt_tokens' => $meta['prompt_tokens'] ?? 0,
                'ai_completion_tokens' => $meta['completion_tokens'] ?? 0,
                'ai_cost_usd' => 0.0,
            ]);
        });
    }

    /**
     * Mark the message as failed with error
     */
    private function markMessageAsFailed(MessagingMessage $message, string $error): void
    {
        Log::error('AI processing failed', [
            'message_id' => $message->message_id,
            'error' => $error
        ]);

        $message->update([
            'ai_status' => 'failed',
            'ai_error_message' => $error,
        ]);
    }
}
