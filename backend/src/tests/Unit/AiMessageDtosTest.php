<?php

namespace Tests\Unit;

use App\Services\DTOs\AI\AiMessageRequest;
use App\Services\DTOs\AI\AiMessageResponse;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class AiMessageDtosTest extends TestCase
{
    public function test_ai_message_request_toArray_fromModel()
    {
        // Construct DTO directly to avoid Eloquent model dependency in unit test
        $dto = new AiMessageRequest(
            id: 'm1',
            sender: 's@example.com',
            senderName: 'Sender',
            subject: 'Hi',
            content: 'Body',
            timestamp: Carbon::now()->toIso8601String(),
            hasAttachments: true,
            attachmentCount: 1,
            labels: ['a'],
            isUnread: true,
            priority: 'high'
        );

        $arr = $dto->toArray();

        $this->assertEquals('m1', $arr['id']);
        $this->assertEquals('s@example.com', $arr['sender']);
        $this->assertTrue($arr['has_attachments']);
        $this->assertEquals(1, $arr['attachment_count']);
        $this->assertEquals(['a'], $arr['labels']);
    }

    public function test_ai_message_response_fromArray_and_validation()
    {
        $data = [
            'id' => '19a495e57676efa9',
            'sender' => 'marketing@datappeal.io',
            'subject' => 'Download your free October insights and reports',
            'html_analysis' => [
                'cleaned_text' => 'All Italian Data 2025, outdoor travel, plus the success story of Visit Sacramento.',
                'is_newsletter' => true,
                'urgency_markers' => [],
                'structure_detected' => 'newsletter',
            ],
            'classification' => [
                'primary_category' => 'marketing',
                'subcategory' => 'newsletter',
                'confidence_score' => 0.95,
                'matched_keywords' => ['newsletter', 'report', 'data'],
            ],
            'sentiment' => [
                'urgency_score' => 2,
                'tone' => 'promotional',
                'business_potential' => 2,
            ],
            'recommendation' => [
                'priority_level' => 'low',
                'text' => 'Newsletter sa informacijama o turizmu i putovanjima.',
                'roi_estimate' => 'n/a',
                'reasoning' => 'Newsletter sadrži informacije o turizmu i putovanjima.',
            ],
            'action_steps' => [
                [
                    'type' => 'ARCHIVE',
                    'description' => 'Arhiviraj email kao newsletter',
                    'timeline' => 'nema_deadline',
                    'deadline' => null,
                    'template_suggestion' => null,
                    'estimated_time' => 0,
                ],
            ],
            'summary' => 'Newsletter sa informacijama o turizmu i putovanjima',
            'gmail_link' => 'https://mail.google.com/mail/u/0/#inbox/19a495e57676efa9',
        ];

        $dto = AiMessageResponse::fromArray($data);
        
        // Test basic properties
        $this->assertEquals('19a495e57676efa9', $dto->id);
        $this->assertEquals('marketing@datappeal.io', $dto->sender);
        $this->assertEquals('Download your free October insights and reports', $dto->subject);
        $this->assertEquals('Newsletter sa informacijama o turizmu i putovanjima', $dto->summary);
        
        // Test nested structures
        $this->assertIsArray($dto->htmlAnalysis);
        $this->assertTrue($dto->htmlAnalysis['is_newsletter']);
        $this->assertEquals('newsletter', $dto->htmlAnalysis['structure_detected']);
        
        $this->assertIsArray($dto->classification);
        $this->assertEquals('marketing', $dto->classification['primary_category']);
        $this->assertEquals(0.95, $dto->classification['confidence_score']);
        
        $this->assertIsArray($dto->sentiment);
        $this->assertEquals(2, $dto->sentiment['urgency_score']);
        $this->assertEquals('promotional', $dto->sentiment['tone']);
        
        $this->assertIsArray($dto->recommendation);
        $this->assertEquals('low', $dto->recommendation['priority_level']);
        
        $this->assertIsArray($dto->actionSteps);
        $this->assertCount(1, $dto->actionSteps);
        $this->assertEquals('ARCHIVE', $dto->actionSteps[0]['type']);
        $this->assertEquals('nema_deadline', $dto->actionSteps[0]['timeline']);
        
        // Test toArray method
        $array = $dto->toArray();
        $this->assertEquals($data['id'], $array['id']);
        $this->assertEquals($data['html_analysis'], $array['html_analysis']);
        $this->assertEquals($data['classification'], $array['classification']);
        $this->assertEquals($data['sentiment'], $array['sentiment']);
        $this->assertEquals($data['recommendation'], $array['recommendation']);
        $this->assertEquals($data['action_steps'], $array['action_steps']);
    }

    public function test_ai_message_response_validation_missing_required_field()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Missing or empty required field: id');
        
        AiMessageResponse::fromArray([
            'sender' => 'test@example.com',
            'subject' => 'Test',
        ]);
    }

    public function test_ai_message_response_validation_invalid_confidence_score()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('confidence_score must be between 0 and 1');
        
        AiMessageResponse::fromArray([
            'id' => 'm1',
            'sender' => 'test@example.com',
            'subject' => 'Test',
            'classification' => [
                'confidence_score' => 1.5,
            ],
        ]);
    }

    public function test_ai_message_response_validation_invalid_urgency_score()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('urgency_score must be between 1 and 10');
        
        AiMessageResponse::fromArray([
            'id' => 'm1',
            'sender' => 'test@example.com',
            'subject' => 'Test',
            'sentiment' => [
                'urgency_score' => 11,
            ],
        ]);
    }

    public function test_ai_message_response_validation_invalid_priority_level()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('priority_level must be one of: low, medium, high');
        
        AiMessageResponse::fromArray([
            'id' => 'm1',
            'sender' => 'test@example.com',
            'subject' => 'Test',
            'recommendation' => [
                'priority_level' => 'invalid',
            ],
        ]);
    }

    public function test_ai_message_response_validation_invalid_timeline()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('timeline must be one of: hitno, ova_nedelja, ovaj_mesec, dugorocno, nema_deadline');
        
        AiMessageResponse::fromArray([
            'id' => 'm1',
            'sender' => 'test@example.com',
            'subject' => 'Test',
            'action_steps' => [
                [
                    'type' => 'REPLY',
                    'timeline' => 'invalid_timeline',
                ],
            ],
        ]);
    }

    public function test_ai_message_response_with_minimal_data()
    {
        $data = [
            'id' => 'm1',
            'sender' => 'test@example.com',
            'subject' => 'Test Subject',
        ];

        $dto = AiMessageResponse::fromArray($data);
        
        $this->assertEquals('m1', $dto->id);
        $this->assertEquals('test@example.com', $dto->sender);
        $this->assertEquals('Test Subject', $dto->subject);
        $this->assertIsArray($dto->htmlAnalysis);
        $this->assertEmpty($dto->htmlAnalysis);
        $this->assertIsArray($dto->classification);
        $this->assertEmpty($dto->classification);
        $this->assertIsArray($dto->sentiment);
        $this->assertEmpty($dto->sentiment);
        $this->assertIsArray($dto->recommendation);
        $this->assertEmpty($dto->recommendation);
        $this->assertIsArray($dto->actionSteps);
        $this->assertEmpty($dto->actionSteps);
        $this->assertEquals('', $dto->summary);
        $this->assertEquals('', $dto->gmailLink);
    }

    public function test_ai_message_response_toArray_preserves_structure()
    {
        $originalData = [
            'id' => 'msg123',
            'sender' => 'sender@test.com',
            'subject' => 'Test Email Subject',
            'html_analysis' => [
                'cleaned_text' => 'Sample cleaned text content',
                'is_newsletter' => false,
                'urgency_markers' => ['urgent', 'asap'],
                'structure_detected' => 'standard',
            ],
            'classification' => [
                'primary_category' => 'business',
                'subcategory' => 'proposal',
                'confidence_score' => 0.85,
                'matched_keywords' => ['proposal', 'meeting', 'project'],
            ],
            'sentiment' => [
                'urgency_score' => 7,
                'tone' => 'professional',
                'business_potential' => 8,
            ],
            'recommendation' => [
                'priority_level' => 'high',
                'text' => 'Respond immediately with detailed proposal.',
                'roi_estimate' => 'high',
                'reasoning' => 'High-value business opportunity requiring quick response.',
            ],
            'action_steps' => [
                [
                    'type' => 'REPLY',
                    'description' => 'Draft detailed proposal response',
                    'timeline' => 'hitno',
                    'deadline' => '2025-11-15',
                    'template_suggestion' => 'business_proposal',
                    'estimated_time' => 60,
                ],
                [
                    'type' => 'SCHEDULE',
                    'description' => 'Schedule follow-up meeting',
                    'timeline' => 'ova_nedelja',
                    'deadline' => '2025-11-20',
                    'template_suggestion' => null,
                    'estimated_time' => 15,
                ],
            ],
            'summary' => 'Business proposal requiring immediate attention',
            'gmail_link' => 'https://mail.google.com/mail/u/0/#inbox/msg123',
        ];

        $dto = AiMessageResponse::fromArray($originalData);
        $arrayResult = $dto->toArray();

        // Verify all top-level keys are present
        $this->assertArrayHasKey('id', $arrayResult);
        $this->assertArrayHasKey('sender', $arrayResult);
        $this->assertArrayHasKey('subject', $arrayResult);
        $this->assertArrayHasKey('html_analysis', $arrayResult);
        $this->assertArrayHasKey('classification', $arrayResult);
        $this->assertArrayHasKey('sentiment', $arrayResult);
        $this->assertArrayHasKey('recommendation', $arrayResult);
        $this->assertArrayHasKey('action_steps', $arrayResult);
        $this->assertArrayHasKey('summary', $arrayResult);
        $this->assertArrayHasKey('gmail_link', $arrayResult);

        // Verify the data matches
        $this->assertEquals($originalData['id'], $arrayResult['id']);
        $this->assertEquals($originalData['sender'], $arrayResult['sender']);
        $this->assertEquals($originalData['subject'], $arrayResult['subject']);
        $this->assertEquals($originalData['summary'], $arrayResult['summary']);
        $this->assertEquals($originalData['gmail_link'], $arrayResult['gmail_link']);

        // Verify nested structures are preserved
        $this->assertEquals($originalData['html_analysis'], $arrayResult['html_analysis']);
        $this->assertEquals($originalData['classification'], $arrayResult['classification']);
        $this->assertEquals($originalData['sentiment'], $arrayResult['sentiment']);
        $this->assertEquals($originalData['recommendation'], $arrayResult['recommendation']);
        $this->assertEquals($originalData['action_steps'], $arrayResult['action_steps']);

        // Verify specific nested values
        $this->assertEquals('Sample cleaned text content', $arrayResult['html_analysis']['cleaned_text']);
        $this->assertEquals(0.85, $arrayResult['classification']['confidence_score']);
        $this->assertEquals(7, $arrayResult['sentiment']['urgency_score']);
        $this->assertEquals('high', $arrayResult['recommendation']['priority_level']);
        $this->assertCount(2, $arrayResult['action_steps']);
        $this->assertEquals('REPLY', $arrayResult['action_steps'][0]['type']);
        $this->assertEquals('hitno', $arrayResult['action_steps'][0]['timeline']);
    }

    public function test_ai_message_response_toArray_with_empty_nested_structures()
    {
        $data = [
            'id' => 'test_id',
            'sender' => 'empty@test.com',
            'subject' => 'Empty Structures Test',
            'html_analysis' => [],
            'classification' => [],
            'sentiment' => [],
            'recommendation' => [],
            'action_steps' => [],
            'summary' => 'Test summary',
            'gmail_link' => 'https://mail.google.com/test',
        ];

        $dto = AiMessageResponse::fromArray($data);
        $arrayResult = $dto->toArray();

        // Verify empty arrays are preserved
        $this->assertIsArray($arrayResult['html_analysis']);
        $this->assertEmpty($arrayResult['html_analysis']);
        $this->assertIsArray($arrayResult['classification']);
        $this->assertEmpty($arrayResult['classification']);
        $this->assertIsArray($arrayResult['sentiment']);
        $this->assertEmpty($arrayResult['sentiment']);
        $this->assertIsArray($arrayResult['recommendation']);
        $this->assertEmpty($arrayResult['recommendation']);
        $this->assertIsArray($arrayResult['action_steps']);
        $this->assertEmpty($arrayResult['action_steps']);

        // Verify other fields are correct
        $this->assertEquals('test_id', $arrayResult['id']);
        $this->assertEquals('Test summary', $arrayResult['summary']);
    }
}
