<?php

namespace Tests\Unit;

use App\Services\DTOs\Messaging\Message;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class MessageTest extends TestCase
{
    public function test_create_toArray_and_json_roundtrip()
    {
        $timestamp = Carbon::now()->toIso8601String();

        $data = [
            'id' => 'm1',
            'timestamp' => $timestamp,
            'channel' => 'gmail-primary',
            'sender' => ['id' => 'u1', 'name' => 'Alice', 'email' => 'alice@example.com'],
            'recipients' => [ ['id' => 'u2', 'name' => 'Bob', 'email' => 'bob@example.com'] ],
            'content' => [ 'text' => 'This is the email body', 'attachments' => [ ['id' => 'a1','name'=>'f.pdf','type'=>'application/pdf','size'=>123] ] ],
            'metadata' => [ 'subject' => 'Hello', 'read' => true, 'starred' => true, 'priority' => 'urgent', 'labels' => ['inbox'] ],
            'threadId' => 't1',
            'parentMessageId' => 'pm1',
        ];

        $msg = Message::create($data);

        $this->assertEquals('m1', $msg->id);
        $this->assertEquals('gmail-primary', $msg->channel);
        $this->assertTrue($msg->hasSubject());
        $this->assertEquals('Hello', $msg->getSubject());
        $this->assertTrue($msg->isRead());
        $this->assertTrue($msg->isStarred());
        $this->assertEquals('urgent', $msg->getPriority());
        $this->assertTrue($msg->isUrgent());
        $this->assertEquals(['inbox'], $msg->getLabels());
        $this->assertTrue($msg->hasAttachments());
        $this->assertEquals(1, $msg->getAttachmentCount());
        $this->assertTrue($msg->isThreaded());
        $this->assertTrue($msg->isReply());

        $arr = $msg->toArray();
        $this->assertEquals('m1', $arr['id']);
        $this->assertArrayHasKey('content', $arr);

        $json = $msg->toJson();
        $this->assertIsString($json);

        $msg2 = Message::fromJson($json);
        $this->assertEquals($msg->id, $msg2->id);
        $this->assertEquals($msg->sender->email, $msg2->sender->email);
    }

    public function test_preview_and_string_without_subject()
    {
        $longText = str_repeat('x', 300);

        $data = [
            'id' => 'm2',
            'timestamp' => Carbon::now(),
            'channel' => 'slack-general',
            'sender' => ['id' => 'u3', 'name' => 'Charlie'],
            'content' => ['text' => $longText],
        ];

        $msg = Message::create($data);

        $preview = $msg->getPreview(50);
        $this->assertStringEndsWith('...', $preview);

        $str = (string)$msg;
        $this->assertStringContainsString('Charlie', $str);
    }
}
