<?php

namespace App\Services\Messaging;

use App\Models\MessagingChannel;
use App\Models\MessagingSyncLog;
use App\Services\AI\AiMessageProcessor;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class MessageSyncService
{
    public function __construct(
        protected MessageService            $messageService,
        protected MessagePersistenceService $persistenceService,
        protected AiMessageProcessor        $aiProcessor
    )
    {
    }

    /**
     * Sync messages for specific channel
     *
     * @return array{success: bool, messages_processed: int, error?: string}
     */
    public function syncChannelMessages(int $channelId): array
    {
        $startTime = microtime(true);

        try {
            $channel = MessagingChannel::findOrFail($channelId);

            // Start sync log early to track all failures
            $syncLog = $this->startSyncLog($channel);

            // Get adapter
            $adapter = $this->messageService->getAdapter($channel->channel_id);

            if (!$adapter) {
                throw new \Exception("Adapter not found: {$channel->channel_id}");
            }

            // Try history sync first (if valid), otherwise fallback to timestamp
            if ($this->canUseHistorySync($channel)) {
                $result = $this->syncViaHistory($channel, $adapter, $syncLog, $startTime);
            } else {
                $result = $this->syncViaTimestamp($channel, $adapter, $syncLog, $startTime);
            }

            // Nakon persist-a u syncViaTimestamp() i syncViaHistory():
            // if (config('messaging.ai.enabled', false)) {
            //     $this->queueAIProcessing($result['messages'] ?? []);;
            // }

            return $result;

        } catch (\Exception $e) {
            if (isset($syncLog)) {
                $this->failSyncLog($syncLog, $e->getMessage());
            }

            Log::error('Sync failed', [
                'syncChannelMessages' => true,
                'channel_id' => $channelId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'duration' => round(microtime(true) - $startTime, 2)
            ];
        }
    }

    /**
     * Check if history sync is valid
     */
    protected function canUseHistorySync(MessagingChannel $channel): bool
    {
        // History ID is valid only if:
        // 1. We have a history_id
        // 2. Last history sync was less than 7 days ago
        if (empty($channel->history_id) || !$channel->last_history_sync_at) {
            return false;
        }

        $sevenDaysAgo = now()->subDays(7);

        if (!Carbon::parse($channel->last_history_sync_at)->gt($sevenDaysAgo)) {
            return false;
        }

        // Additionally ensure that last_sync_at is not older than 7 days
        if (!$channel->last_sync_at || Carbon::parse($channel->last_sync_at)->lt($sevenDaysAgo)) {
            return false;
        }

        return true;
    }

    /**
     * Sync using Gmail History API
     */
    protected function syncViaHistory(
        MessagingChannel $channel,
                         $adapter,
        MessagingSyncLog $syncLog,
        float            $startTime
    ): array
    {
        try {
            // Get timestamp BEFORE fetching
            $syncStartTime = now();

            // Fetch messages using history ID
            $response = $adapter->receiveMessagesViaHistory($channel->history_id);

            if (!is_array($response) || !($response['success'] ?? false)) {
                throw new \Exception($response['error'] ?? 'History sync failed');
            }

            $messages = $response['messages'] ?? [];
            $newHistoryId = $response['historyId'] ?? null;

            // Persist to database
            $stats = $this->persistenceService->bulkPersistMessages($messages, $channel);

            // Update channel with new history ID
            $channel->update([
                'last_sync_at' => $syncStartTime,           // ← Use start time
                'history_id' => $newHistoryId,
                'last_history_sync_at' => $syncStartTime    // ← Use start time
            ]);

            // Complete sync log
            $this->completeSyncLog($syncLog, [
                'messages_fetched' => count($messages),
                'messages_processed' => $stats['processed'],
                'messages_failed' => $stats['failed'],
                'duration' => round(microtime(true) - $startTime, 2),
                'sync_method' => 'history'
            ]);

            $result = [
                'success' => true,
                'channel_id' => $channel->id,
                'sync_method' => 'history',
                'messages_fetched' => count($messages),
                'messages_processed' => $stats['processed'],
                'messages_failed' => $stats['failed'],
                'duration' => round(microtime(true) - $startTime, 2),
                'messages' => $messages
            ];

            Log::info('History sync completed', collect($result)->except('messages')->all());

            return $result;

        } catch (\Exception $e) {
            Log::warning('History sync failed, falling back to timestamp', [
                'channel_id' => $channel->id,
                'error' => $e->getMessage()
            ]);

            // Fallback to timestamp sync
            return $this->syncViaTimestamp($channel, $adapter, $syncLog, $startTime);
        }
    }

    /**
     * Sync using timestamp (after: query)
     */
    protected function syncViaTimestamp(
        MessagingChannel $channel,
                         $adapter,
        MessagingSyncLog $syncLog,
        float            $startTime
    ): array
    {
        // Get timestamp BEFORE fetching
        $syncStartTime = now();

        // Get since timestamp
        $since = $this->getLastSyncTime($channel);

        // Fetch messages
        $response = $adapter->receiveMessages($since);

        if (!is_array($response) || !($response['success'] ?? false)) {
            throw new \Exception($response['error'] ?? 'Failed to fetch messages');
        }

        $messages = $response['messages'] ?? [];
        $newHistoryId = $response['historyId'] ?? null;

        // Persist to database
        $stats = $this->persistenceService->bulkPersistMessages($messages, $channel);

        // Save the START time, not completion time
        $updateData = [
            'last_sync_at' => $syncStartTime  // ← Use start time
        ];

        // Update channel (and save historyId if available for future syncs)
        if ($newHistoryId) {
            $updateData['history_id'] = $newHistoryId;
            $updateData['last_history_sync_at'] = $syncStartTime;
        }

        $channel->update($updateData);

        // Complete sync log
        $this->completeSyncLog($syncLog, [
            'messages_fetched' => count($messages),
            'messages_processed' => $stats['processed'],
            'messages_failed' => $stats['failed'],
            'duration' => round(microtime(true) - $startTime, 2),
            'sync_method' => 'timestamp'
        ]);

        $result = [
            'success' => true,
            'channel_id' => $channel->id,
            'sync_method' => 'timestamp',
            'messages_fetched' => count($messages),
            'messages_processed' => $stats['processed'],
            'messages_failed' => $stats['failed'],
            'duration' => round(microtime(true) - $startTime, 2),
            'messages' => $messages
        ];

        Log::info('Timestamp sync completed', collect($result)->except('messages')->all());

        return $result;
    }

    /**
     * Sync all active channels
     */
    public function syncAllChannels(): array
    {
        $channels = MessagingChannel::where('is_active', true)->get();
        $results = [];

        foreach ($channels as $channel) {
            $results[$channel->channel_id] = $this->syncChannelMessages($channel->id);
        }

        return [
            'total' => $channels->count(),
            'successful' => collect($results)->where('success', true)->count(),
            'failed' => collect($results)->where('success', false)->count(),
            'results' => $results
        ];
    }

    /**
     * Get last sync time for channel
     */
    protected function getLastSyncTime(MessagingChannel $channel): ?Carbon
    {
        if ($channel->last_sync_at) {
            return Carbon::parse($channel->last_sync_at);
        }

        // Fallback: check sync logs
        $lastLog = MessagingSyncLog::where('channel_id', $channel->id)
            ->where('status', 'completed')
            ->latest('started_at')
            ->first();

        if ($lastLog) {
            return Carbon::parse($lastLog->started_at);
        }

        // Default: last 30 days
        return now()->subDays(30);
    }

    /**
     * Start sync log
     */
    protected function startSyncLog(MessagingChannel $channel): MessagingSyncLog
    {
        return MessagingSyncLog::create([
            'channel_id' => $channel->id,
            'status' => 'running',
            'started_at' => now()
        ]);
    }

    /**
     * Complete sync log
     */
    protected function completeSyncLog(MessagingSyncLog $syncLog, array $stats): void
    {
        $syncLog->update([
            'status' => 'completed',
            'completed_at' => now(),
            'messages_fetched' => $stats['messages_fetched'],
            'messages_processed' => $stats['messages_processed'],
            'messages_failed' => $stats['messages_failed'],
            'summary' => [
                'duration' => $stats['duration'],
                'sync_method' => $stats['sync_method'] ?? 'unknown'
            ]
        ]);
    }

    /**
     * Fail sync log
     */
    protected function failSyncLog(MessagingSyncLog $syncLog, string $error): void
    {
        $syncLog->update([
            'status' => 'failed',
            'completed_at' => now(),
            'errors' => $error
        ]);
    }

    // Nova metoda na kraju klase:
    // private function queueAIProcessing(array $messages): void
    // {
    //     $total = count($messages);
    //     foreach ($messages as $idx => $messageData) {
    //         $message = MessagingMessage::where('message_id', $messageData['id'])->first();

    //         if ($message && $message->ai_status === 'pending') {
    //             try {
    //                 $result = $this->aiProcessor->processSingleMessage($message, forceReprocess: false);

    //                 if (!$result['success']) {
    //                     throw new \Exception($result['error']);
    //                 }

    //             } catch (\Exception $e) {
    //                 Log::error('ProcessMessageWithAI job failed', [
    //                     'message_id' => $message->id,
    //                     'error' => $e->getMessage()
    //                 ]);

    //                 throw $e;
    //             }

    //             // add a small delay to avoid bursts between AI calls (except after last message)
    //             if ($idx !== $total - 1) {
    //                 sleep(5);
    //             }
    //         }
    //     }
    // }
}
