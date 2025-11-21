<?php

namespace Tests\Unit;

use App\Services\AI\AiMessageProcessor;
use PHPUnit\Framework\TestCase;

class FakeAnalyzer extends \App\Services\AI\EmailAnalyzerService
{
    // Override constructor to avoid dependencies
    public function __construct() {}

    public function analyzeEmails(array $emails, $userId = null, ?array $userGoals = null): array
    {
        return [
            'success' => true,
            'data' => [],
            'meta' => []
        ];
    }
}

class TestProcessor extends AiMessageProcessor
{
    public function __construct($analyzer) { parent::__construct($analyzer); }
    public function exposeCalculateCost(array $meta) { return $this->calculateCost($meta); }
}

class AiMessageProcessorTest extends TestCase
{
    public function test_processBatch_no_messages_to_process()
    {
        $fake = new FakeAnalyzer();
        $proc = new AiMessageProcessor($fake);

        $result = $proc->processBatch([], false);
        $this->assertTrue($result['success']);
        $this->assertEquals(0, $result['processed']);
    }
}
