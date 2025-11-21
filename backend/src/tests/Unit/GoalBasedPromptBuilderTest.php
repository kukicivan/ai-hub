<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\AI\GoalBasedPromptBuilder;

class GoalBasedPromptBuilderTest extends TestCase
{
    public function test_prompt_is_utf8_and_contains_unicode()
    {
        $builder = new GoalBasedPromptBuilder();

        $emails = [
            [
                'id' => 'message_id_1',
                'sender' => 'noreply@example.com',
                'subject' => 'Test subject ČĆŠŽ čćšž',
                'content' => ['text' => 'Ovo je test sa posebnim karakterima: ČĆŠŽ čćšž']
            ]
        ];

        $prompt = $builder->buildEmailAnalysisPrompt($emails);

        // Ensure string is valid UTF-8
        $this->assertTrue(
            mb_check_encoding($prompt, 'UTF-8'),
            'Prompt must be valid UTF-8 encoded string'
        );

        // Ensure original accented characters are present (JSON_UNESCAPED_UNICODE expected)
        $this->assertStringContainsString('ČĆŠŽ', $prompt);

        // Ensure newsletter detection section didn't get truncated (look for a keyword from that section)
        $this->assertStringContainsString('unsubscribe', strtolower($prompt));
    }
}
