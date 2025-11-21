<?php

namespace Tests\Unit\Services\AI;

use App\Services\AI\AiResponseNormalizer;
use PHPUnit\Framework\TestCase;

class AiResponseNormalizerTest extends TestCase
{
    private AiResponseNormalizer $normalizer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->normalizer = new AiResponseNormalizer();
    }

    public function test_normalizes_single_object_with_id()
    {
        $json = json_encode([
            'id' => 'msg_123',
            'sender' => 'test@example.com',
            'subject' => 'Test Subject',
            'html_analysis' => [],
            'classification' => [],
            'sentiment' => [],
            'recommendation' => [],
            'action_steps' => [],
            'summary' => 'Test summary',
            'gmail_link' => 'https://mail.google.com/...'
        ]);

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('msg_123', $result[0]['id']);
        $this->assertEquals('test@example.com', $result[0]['sender']);
    }

    public function test_normalizes_emails_wrapper()
    {
        $json = json_encode([
            'emails' => [
                ['id' => 'e1', 'sender' => 'a@example.com', 'subject' => 'Subject A'],
                ['id' => 'e2', 'sender' => 'b@example.com', 'subject' => 'Subject B'],
                ['id' => 'e3', 'sender' => 'c@example.com', 'subject' => 'Subject C'],
            ]
        ]);

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertCount(3, $result);
        $this->assertEquals('e1', $result[0]['id']);
        $this->assertEquals('e2', $result[1]['id']);
        $this->assertEquals('e3', $result[2]['id']);
    }

    public function test_normalizes_data_wrapper()
    {
        $json = json_encode([
            'data' => [
                ['id' => 'd1', 'sender' => 'x@example.com'],
                ['id' => 'd2', 'sender' => 'y@example.com'],
            ]
        ]);

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertCount(2, $result);
        $this->assertEquals('d1', $result[0]['id']);
        $this->assertEquals('d2', $result[1]['id']);
    }

    public function test_normalizes_results_wrapper()
    {
        $json = json_encode([
            'results' => [
                ['id' => 'r1', 'sender' => 'test1@example.com'],
            ]
        ]);

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('r1', $result[0]['id']);
    }

    public function test_normalizes_items_wrapper()
    {
        $json = json_encode([
            'items' => [
                ['id' => 'i1', 'subject' => 'Item 1'],
                ['id' => 'i2', 'subject' => 'Item 2'],
            ]
        ]);

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertCount(2, $result);
        $this->assertEquals('i1', $result[0]['id']);
    }

    public function test_normalizes_indexed_array()
    {
        $json = json_encode([
            ['id' => 'l1', 'sender' => 'list1@example.com', 'subject' => 'List 1'],
            ['id' => 'l2', 'sender' => 'list2@example.com', 'subject' => 'List 2'],
        ]);

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertCount(2, $result);
        $this->assertEquals('l1', $result[0]['id']);
        $this->assertEquals('l2', $result[1]['id']);
    }

    public function test_normalizes_response_with_markdown_code_blocks()
    {
        $json = "```json\n" . json_encode([
            'id' => 'markdown_test',
            'sender' => 'md@example.com'
        ]) . "\n```";

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('markdown_test', $result[0]['id']);
    }

    public function test_normalizes_fallback_single_array_value()
    {
        $json = json_encode([
            'status' => 'success',
            'message' => 'Processed',
            'analyzed_emails' => [
                ['id' => 'f1', 'subject' => 'Fallback 1'],
                ['id' => 'f2', 'subject' => 'Fallback 2'],
            ]
        ]);

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertCount(2, $result);
        $this->assertEquals('f1', $result[0]['id']);
        $this->assertEquals('f2', $result[1]['id']);
    }

    public function test_throws_exception_on_invalid_json()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Invalid JSON from AI');

        $this->normalizer->normalize('{ invalid json');
    }

    public function test_returns_empty_array_for_non_array_data()
    {
        $json = json_encode('just a string');

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function test_returns_empty_array_for_array_without_recognizable_structure()
    {
        $json = json_encode([
            'random_key' => 'value',
            'another_key' => 123,
            'no_emails_here' => true
        ]);

        $result = $this->normalizer->normalize($json);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function test_handles_mixed_wrapper_keys_extracts_all()
    {
        $json = json_encode([
            'emails' => [
                ['id' => 'e1', 'sender' => 'email1@example.com'],
            ],
            'data' => [
                ['id' => 'd1', 'sender' => 'data1@example.com'],
            ]
        ]);

        $result = $this->normalizer->normalize($json);

        // Should extract from all matching wrapper keys
        $this->assertIsArray($result);
        $this->assertCount(2, $result);
        $this->assertEquals('e1', $result[0]['id']);
        $this->assertEquals('d1', $result[1]['id']);
    }

    public function test_extracts_json_from_text_with_prefix()
    {
        $textWithJson = "Here is the analysis:\n\n" . json_encode([
            ['id' => 'p1', 'sender' => 'prefix@example.com', 'subject' => 'Test'],
        ]);

        $result = $this->normalizer->normalize($textWithJson);

        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('p1', $result[0]['id']);
    }

    public function test_extracts_json_from_text_with_suffix()
    {
        $textWithJson = json_encode([
            ['id' => 's1', 'sender' => 'suffix@example.com'],
        ]) . "\n\nThis was the result.";

        $result = $this->normalizer->normalize($textWithJson);

        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('s1', $result[0]['id']);
    }

    public function test_extracts_json_from_text_with_prefix_and_suffix()
    {
        $textWithJson = "**Final analysis**\n\nBelow is the result:\n" .
            json_encode([
                ['id' => 'ps1', 'sender' => 'both@example.com'],
            ]) .
            "\n\n**Reasoning recap**";

        $result = $this->normalizer->normalize($textWithJson);

        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('ps1', $result[0]['id']);
    }
}
