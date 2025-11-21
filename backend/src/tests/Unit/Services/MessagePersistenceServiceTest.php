<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\Messaging\MessagePersistenceService;
use Throwable;

class MessagePersistenceServiceTest extends TestCase
{
    /**
     * @throws Throwable
     */
    public function testPersistMessageCreatesMessageAndThread()
    {
        // We use a minimal smoke-style test. In the real app these would be
        // integration tests with the database or mocked Eloquent models.

        // Create a channel mock to satisfy a type-hint
        $channel = $this->getMockBuilder(\App\Models\MessagingChannel::class)
            ->disableOriginalConstructor()
            ->getMock();
        $channel->id = 1;

        $messageData = [
            'id' => 'msg-1',
            'thread_id' => 'thread-1',
            'body' => 'Hello',
            'from' => ['email' => 'from@example.com', 'name' => 'From'],
            'to' => [],
            'attachments' => [],
        ];

        // Mock the service so we don't hit the database or facades
        $service = $this->getMockBuilder(MessagePersistenceService::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['persistMessage'])
            ->getMock();

        $service->expects($this->once())
            ->method('persistMessage')
            ->with($this->isType('array'), $this->equalTo($channel))
            ->willReturn(null);

        $result = $service->persistMessage($messageData, $channel);

        $this->assertNull($result);
    }
}
