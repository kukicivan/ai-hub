<?php

namespace App\Services\Orchestration;

use App\Services\AI;
use App\Services\Messaging\MessageSyncService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Central orchestrator for all sync operations
 * Handles locking, message sync, and AI processing
 */
class SyncOrchestratorService
{
    const LOCK_MESSAGES = 'sync_lock_messages';
    const LOCK_AI = 'sync_lock_ai';
    const LOCK_TTL = 900; // 15 minutes

    public function __construct(
        protected MessageSyncService $messageSyncService,
        protected AI\AiMessageProcessor $aiProcessor
    ) {}

    /**
     * Sync messages only
     */
    public function syncMessagesOnly(): array
    {
        if ($this->isSyncInProgress(self::LOCK_MESSAGES)) {
            return [
                'success' => false,
                'error' => 'Message sync already in progress',
                'status' => 'locked'
            ];
        }

        $this->createLock(self::LOCK_MESSAGES);

        try {
            $result = $this->messageSyncService->syncAllChannels();

            Log::info('Message sync completed', [
                'total' => $result['total'],
                'successful' => $result['successful'],
                'failed' => $result['failed']
            ]);

            return array_merge(['success' => true], $result);

        } catch (\Exception $e) {
            Log::error('Message sync failed', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        } finally {
            $this->releaseLock(self::LOCK_MESSAGES);
        }
    }

    /**
     * Process AI only
     */
    public function processAiOnly(int $limit = 50): array
    {
        if ($this->isSyncInProgress(self::LOCK_AI)) {
            return [
                'success' => false,
                'error' => 'AI processing already in progress',
                'status' => 'locked'
            ];
        }

        $this->createLock(self::LOCK_AI);

        try {
            // Get pending messages
            $messages = \App\Models\MessagingMessage::where('ai_status', 'pending')
                ->orderBy('message_timestamp', 'desc')
                ->limit($limit)
                ->get();

            if ($messages->isEmpty()) {
                return [
                    'success' => true,
                    'processed' => 0,
                    'message' => 'No pending messages'
                ];
            }

            $result = $this->aiProcessor->processBatch($messages);

            Log::info('AI processing completed', [
                'processed' => $result['processed'],
                'failed' => $result['failed']
            ]);

            return array_merge(['success' => true], $result);

        } catch (\Exception $e) {
            Log::error('AI processing failed', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        } finally {
            $this->releaseLock(self::LOCK_AI);
        }
    }

    /**
     * Process single message by ID
     */
    public function processSingleMessageById(int $messageId, bool $forceReprocess = false): array
    {
        try {
            $message = \App\Models\MessagingMessage::find($messageId);

            if (!$message) {
                return [
                    'success' => false,
                    'error' => 'Message not found',
                    'message_id' => $messageId
                ];
            }

            $result = $this->aiProcessor->processSingleMessage($message, $forceReprocess);

            Log::info('Single message AI processing completed', [
                'message_id' => $messageId,
                'success' => $result['success']
            ]);

            return $result;

        } catch (\Exception $e) {
            Log::error('Single message AI processing failed', [
                'message_id' => $messageId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'message_id' => $messageId
            ];
        }
    }

    /**
     * Check if sync is in progress
     */
    public function isSyncInProgress(string $lockKey): bool
    {
        return Cache::has($lockKey);
    }

    /**
     * Create lock
     */
    protected function createLock(string $lockKey): void
    {
        Cache::put($lockKey, now()->timestamp, self::LOCK_TTL);

        Log::debug('Lock created', ['key' => $lockKey]);
    }

    /**
     * Release lock
     */
    protected function releaseLock(string $lockKey): void
    {
        Cache::forget($lockKey);

        Log::debug('Lock released', ['key' => $lockKey]);
    }

    /**
     * Force release lock (emergency)
     */
    public function forceReleaseLock(string $lockKey): void
    {
        Cache::forget($lockKey);

        Log::warning('Lock force released', ['key' => $lockKey]);
    }

    /**
     * Get sync status
     */
    public function getSyncStatus(string $lockKey): array
    {
        $isLocked = $this->isSyncInProgress($lockKey);
        $lockedAt = $isLocked ? Cache::get($lockKey) : null;

        return [
            'is_locked' => $isLocked,
            'locked_at' => $lockedAt ? date('Y-m-d H:i:s', $lockedAt) : null,
            'locked_for_seconds' => $lockedAt ? (now()->timestamp - $lockedAt) : null,
        ];
    }
}
