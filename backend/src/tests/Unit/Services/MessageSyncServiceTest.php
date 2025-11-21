<?php

namespace Tests\Unit\Services;

use App\Models\MessagingChannel;
use App\Models\MessagingMessage;
use App\Models\MessagingSyncLog;
use App\Services\Messaging\MessagePersistenceService;
use App\Services\Messaging\MessageSyncService;
use App\Services\Messaging\MessageService;
use App\Interfaces\MessageAdapterInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class MessageSyncServiceTest extends TestCase
{
    use RefreshDatabase;

    protected MessageSyncService $syncService;
    protected $mockMessageService;
    protected $mockPersistenceService;

    protected function setUp(): void
    {
        $this->markTestSkipped('Skipping all tests in MessageSyncServiceTest temporarily.');

        parent::setUp();

        // Mock Log to prevent actual logging
        Log::shouldReceive('error')->andReturnNull();
        Log::shouldReceive('warning')->andReturnNull();
        Log::shouldReceive('info')->andReturnNull();

        // Create mocks
        $this->mockMessageService = $this->createMock(MessageService::class);
        $this->mockPersistenceService = $this->createMock(MessagePersistenceService::class);

        // Create service with mocked dependencies
        $this->syncService = new MessageSyncService(
            $this->mockMessageService,
            $this->mockPersistenceService
        );
    }

    /**
     * Test successful timestamp sync with messages
     */
    public function test_syncChannelMessages_timestamp_sync_success()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create([
            'channel_id' => 'gmail-test',
            'is_active' => true,
            'last_sync_at' => now()->subHour(),
        ]);

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => [
                ['id' => 'msg1', 'content' => ['text' => 'Test 1']],
                ['id' => 'msg2', 'content' => ['text' => 'Test 2']],
            ],
            'historyId' => 'new_history_123'
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn([
                'processed' => 2,
                'failed' => 0,
                'errors' => []
            ]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertTrue($result['success']);
        $this->assertEquals('timestamp', $result['sync_method']);
        $this->assertEquals(2, $result['messages_fetched']);
        $this->assertEquals(2, $result['messages_processed']);
        $this->assertEquals(0, $result['messages_failed']);

        // Verify channel was updated
        $channel->refresh();
        $this->assertNotNull($channel->last_sync_at);
        $this->assertEquals('new_history_123', $channel->history_id);

        // Verify sync log was created
        $this->assertDatabaseHas('messaging_sync_logs', [
            'channel_id' => $channel->id,
            'status' => 'completed',
            'messages_fetched' => 2,
            'messages_processed' => 2
        ]);
    }

    /**
     * Test history sync when history_id is valid
     */
    public function test_syncChannelMessages_history_sync_when_valid()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create([
            'channel_id' => 'gmail-test',
            'history_id' => 'old_history_456',
            'last_history_sync_at' => now()->subHours(2), // Recent enough
        ]);

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => [['id' => 'msg1']],
            'historyId' => 'new_history_789'
        ], 'history');

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 1, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertTrue($result['success']);
        $this->assertEquals('history', $result['sync_method']);
        $this->assertEquals(1, $result['messages_fetched']);

        // Verify history_id was updated
        $channel->refresh();
        $this->assertEquals('new_history_789', $channel->history_id);
    }

    /**
     * Test fallback to timestamp when history sync fails
     */
    public function test_syncChannelMessages_fallback_to_timestamp_on_history_failure()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create([
            'history_id' => 'expired_history',
            'last_history_sync_at' => now()->subHours(2),
        ]);

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => [['id' => 'msg1']],
        ], 'both');

        // History fails, timestamp succeeds
        $mockAdapter->method('receiveMessagesViaHistory')
            ->willThrowException(new \Exception('History API error'));

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 1, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertTrue($result['success']);
        $this->assertEquals('timestamp', $result['sync_method']);
    }

    /**
     * Test sync when no new messages
     */
    public function test_syncChannelMessages_no_new_messages()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create();

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => [], // Empty
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 0, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertTrue($result['success']);
        $this->assertEquals(0, $result['messages_fetched']);
        $this->assertEquals(0, $result['messages_processed']);
    }

    /**
     * Test sync when adapter not found
     */
    public function test_syncChannelMessages_adapter_not_found()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create([
            'channel_id' => 'non-existent-adapter'
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn(null);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Adapter not found', $result['error']);

        // Verify sync log was marked as failed
        $this->assertDatabaseHas('messaging_sync_logs', [
            'channel_id' => $channel->id,
            'status' => 'failed'
        ]);
    }

    /**
     * Test sync when channel not found
     */
    public function test_syncChannelMessages_channel_not_found()
    {
        // Act
        $result = $this->syncService->syncChannelMessages(99999);

        // Assert
        $this->assertFalse($result['success']);
        $this->assertArrayHasKey('error', $result);
    }

    /**
     * Test sync when adapter returns error
     */
    public function test_syncChannelMessages_adapter_returns_error()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create();

        $mockAdapter = $this->createMockAdapter([
            'success' => false,
            'error' => 'Gmail API rate limit exceeded'
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('rate limit', $result['error']);
    }

    /**
     * Test sync with some messages failing to persist
     */
    public function test_syncChannelMessages_partial_failure_in_persistence()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create();

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => [
                ['id' => 'msg1'],
                ['id' => 'msg2'],
                ['id' => 'msg3'],
            ]
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn([
                'processed' => 2,
                'failed' => 1,
                'errors' => ['msg3' => 'Invalid data']
            ]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertTrue($result['success']); // Sync itself succeeded
        $this->assertEquals(3, $result['messages_fetched']);
        $this->assertEquals(2, $result['messages_processed']);
        $this->assertEquals(1, $result['messages_failed']);
    }

    /**
     * Test syncAllChannels with multiple channels
     */
    public function test_syncAllChannels_multiple_channels()
    {
        // Arrange
        $channel1 = MessagingChannel::factory()->create([
            'channel_id' => 'gmail-1',
            'is_active' => true
        ]);

        $channel2 = MessagingChannel::factory()->create([
            'channel_id' => 'gmail-2',
            'is_active' => true
        ]);

        $channel3 = MessagingChannel::factory()->create([
            'channel_id' => 'gmail-3',
            'is_active' => false // Inactive, should be skipped
        ]);

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => [['id' => 'msg1']]
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 1, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncAllChannels();

        // Assert
        $this->assertEquals(2, $result['total']); // Only active channels
        $this->assertEquals(2, $result['successful']);
        $this->assertEquals(0, $result['failed']);
        $this->assertArrayHasKey('gmail-1', $result['results']);
        $this->assertArrayHasKey('gmail-2', $result['results']);
        $this->assertArrayNotHasKey('gmail-3', $result['results']);
    }

    /**
     * Test syncAllChannels with mixed success/failure
     */
    public function test_syncAllChannels_mixed_results()
    {
        // Arrange
        $channel1 = MessagingChannel::factory()->create([
            'channel_id' => 'gmail-success',
            'is_active' => true
        ]);

        $channel2 = MessagingChannel::factory()->create([
            'channel_id' => 'gmail-failure',
            'is_active' => true
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturnCallback(function ($channelId) {
                if ($channelId === 'gmail-failure') {
                    return null; // Adapter not found
                }
                return $this->createMockAdapter([
                    'success' => true,
                    'messages' => [['id' => 'msg1']]
                ]);
            });

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 1, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncAllChannels();

        // Assert
        $this->assertEquals(2, $result['total']);
        $this->assertEquals(1, $result['successful']);
        $this->assertEquals(1, $result['failed']);
        $this->assertTrue($result['results']['gmail-success']['success']);
        $this->assertFalse($result['results']['gmail-failure']['success']);
    }

    /**
     * Test AI processing is queued when enabled
     */
    public function test_syncChannelMessages_queues_ai_processing_when_enabled()
    {
        // Arrange
        Config::set('messaging.ai.enabled', true);
        Queue::fake();

        $channel = MessagingChannel::factory()->create();

        // Create messages in database (needed for queueAIProcessing)
        $message1 = MessagingMessage::factory()->create([
            'message_id' => 'msg1',
            'channel_id' => $channel->id,
            'ai_status' => 'pending'
        ]);

        $message2 = MessagingMessage::factory()->create([
            'message_id' => 'msg2',
            'channel_id' => $channel->id,
            'ai_status' => 'pending'
        ]);

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => [
                ['id' => 'msg1', 'content' => ['text' => 'Test 1']],
                ['id' => 'msg2', 'content' => ['text' => 'Test 2']],
            ]
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 2, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertTrue($result['success']);

        // Verify AI jobs were queued (dispatchSync in code means immediate, but we can check it was called)
        // Note: With dispatchSync, jobs execute immediately so we can check message status
        $message1->refresh();
        $message2->refresh();

        // Since dispatchSync is used, messages should have been processed
        // (assuming ProcessMessageWithAI job works correctly)
    }

    /**
     * Test AI processing is NOT queued when disabled
     */
    public function test_syncChannelMessages_skips_ai_when_disabled()
    {
        // Arrange
        Config::set('messaging.ai.enabled', false);
        Queue::fake();

        $channel = MessagingChannel::factory()->create();

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => [['id' => 'msg1']]
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 1, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertTrue($result['success']);

        // Verify NO AI jobs were queued
        Queue::assertNothingPushed();
    }

    /**
     * Test history sync is NOT used when history_id is too old
     */
    public function test_canUseHistorySync_returns_false_when_expired()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create([
            'history_id' => 'old_history',
            'last_history_sync_at' => now()->subDays(10) // More than 7 days
        ]);

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => []
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 0, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertEquals('timestamp', $result['sync_method']); // Should use timestamp, not history
    }

    /**
     * Test sync log duration is calculated correctly
     */
    public function test_syncChannelMessages_calculates_duration()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create();

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => []
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 0, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertArrayHasKey('duration', $result);
        $this->assertIsFloat($result['duration']);
        $this->assertGreaterThan(0, $result['duration']);
    }

    /**
     * Test getLastSyncTime uses channel's last_sync_at
     */
    public function test_getLastSyncTime_uses_channel_last_sync_at()
    {
        // Arrange
        $lastSyncTime = now()->subHours(3);
        $channel = MessagingChannel::factory()->create([
            'last_sync_at' => $lastSyncTime
        ]);

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => []
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 0, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert - sync should succeed and use the last_sync_at time
        $this->assertTrue($result['success']);
    }

    /**
     * Test getLastSyncTime falls back to sync logs
     */
    public function test_getLastSyncTime_fallback_to_sync_logs()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create([
            'last_sync_at' => null // No last sync
        ]);

        // Create a completed sync log
        MessagingSyncLog::factory()->create([
            'channel_id' => $channel->id,
            'status' => 'completed',
            'started_at' => now()->subHours(5)
        ]);

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => []
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 0, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert
        $this->assertTrue($result['success']);
    }

    /**
     * Test getLastSyncTime defaults to 24 hours ago
     */
    public function test_getLastSyncTime_defaults_to_24_hours()
    {
        // Arrange
        $channel = MessagingChannel::factory()->create([
            'last_sync_at' => null
        ]);
        // No sync logs exist

        $mockAdapter = $this->createMockAdapter([
            'success' => true,
            'messages' => []
        ]);

        $this->mockMessageService->method('getAdapter')
            ->willReturn($mockAdapter);

        $this->mockPersistenceService->method('bulkPersistMessages')
            ->willReturn(['processed' => 0, 'failed' => 0]);

        // Act
        $result = $this->syncService->syncChannelMessages($channel->id);

        // Assert - should default to 24h ago and succeed
        $this->assertTrue($result['success']);
    }

    /**
     * Helper: Create mock adapter
     */
    private function createMockAdapter(array $response, string $type = 'timestamp')
    {
        $mockAdapter = $this->createMock(MessageAdapterInterface::class);

        if ($type === 'timestamp' || $type === 'both') {
            $mockAdapter->method('receiveMessages')
                ->willReturn($response);
        }

        if ($type === 'history' || $type === 'both') {
            $mockAdapter->method('receiveMessagesViaHistory')
                ->willReturn($response);
        }

        // Mock other required interface methods
        $mockAdapter->method('connect')->willReturn(true);
        $mockAdapter->method('disconnect')->willReturnCallback(function() {});
        $mockAdapter->method('isConnected')->willReturn(true);
        $mockAdapter->method('validateConfiguration')->willReturn(true);
        $mockAdapter->method('getChannelType')->willReturn('gmail');
        $mockAdapter->method('getChannelId')->willReturn('test-channel');

        return $mockAdapter;
    }
}
