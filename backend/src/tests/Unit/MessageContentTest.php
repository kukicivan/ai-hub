<?php

namespace Tests\Unit;

use App\Services\DTOs\Messaging\MessageContent;
use PHPUnit\Framework\TestCase;

class MessageContentTest extends TestCase
{
    public function test_create_and_basic_properties()
    {
        $data = [
            'text' => 'Hello world',
            'html' => '<p>Hello</p>',
            'attachments' => [
                ['id' => 'a1', 'name' => 'image.png', 'type' => 'image/png', 'size' => 1024],
            ],
            'reactions' => [ ['count' => 2], ['count' => 3] ],
            'formatting' => ['mentions' => ['bob'], 'links' => ['https://example.com']],
        ];

        $mc = MessageContent::create($data);

        $this->assertEquals('Hello world', $mc->text);
        $this->assertTrue($mc->hasHtml());
        $this->assertTrue($mc->hasAttachments());
        $this->assertEquals(1, $mc->getAttachmentCount());
        $this->assertEquals(5, $mc->getTotalReactionCount());
        $this->assertTrue($mc->hasMentions());
        $this->assertEquals(['bob'], $mc->getMentions());
        $this->assertTrue($mc->hasLinks());
        $this->assertEquals(['https://example.com'], $mc->getLinks());
        $this->assertFalse($mc->isEmpty());
        $this->assertEquals(2, $mc->getWordCount());
        $this->assertEquals(11, $mc->getCharacterCount());
        $this->assertStringContainsString('Hello', (string)$mc);
    }

    public function test_preview_and_attachments_by_type()
    {
        $data = [
            'text' => str_repeat('a', 150),
            'attachments' => [
                ['id' => 'i1', 'name' => 'pic.jpg', 'type' => 'image/jpeg', 'size' => 1024],
                ['id' => 'd1', 'name' => 'doc.pdf', 'type' => 'application/pdf', 'size' => 2048],
            ],
        ];

        $mc = MessageContent::create($data);

        $this->assertEquals(2, $mc->getAttachmentCount());
        $this->assertCount(1, $mc->getImages());
        $this->assertCount(1, $mc->getDocuments());
        $this->assertEquals(3072, $mc->getTotalAttachmentSize());
        $preview = $mc->getPreview(50);
        $this->assertStringEndsWith('...', $preview);
    }
}
