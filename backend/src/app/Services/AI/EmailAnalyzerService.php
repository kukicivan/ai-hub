<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Log;

class EmailAnalyzerService
{
    const CHUNK_STRATEGIES = [
        'single' => 1,    // 1 email per call
        'micro' => 1,     // 2 emails per call (safest for free tier)
        'small' => 1,     // 3 emails per call
        'medium' => 3,    // 5 emails per call (risky)
    ];

    public function __construct(
        protected ModelRouterService     $router,
        protected GoalBasedPromptBuilder $promptBuilder,
        protected DataAnonymizer         $anonymizer,
        protected AiResponseNormalizer   $normalizer
    )
    {
    }

    public function analyzeEmails(array $emails, $userId = null, ?array $userGoals = null): array
    {
//        $anonymizedEmails = array_map(
//            fn($email) => $this->anonymizer->anonymizeMessage($email),
//            $emails
//        );

        $anonymizedEmails = $emails;

        $systemPrompt = 'Ti si AI Email Orchestrator koji analizira emailove kroz 5 servisa i vraća strukturiran, actionable output. Prati instrukcije za svaki servis i vrati kompletan JSON sa svim poljima.';

        // Batching strategy: choose chunk size based on number of emails
        $count = count($anonymizedEmails);
        if ($count <= 10) {
            $chunkSize = self::CHUNK_STRATEGIES['single'];
        } elseif ($count <= 30) {
            $chunkSize = self::CHUNK_STRATEGIES['micro'];
        } else {
            $chunkSize = self::CHUNK_STRATEGIES['small'];
        }

        $chunks = array_chunk($anonymizedEmails, $chunkSize);

        $allParsed = [];
        $aggregateUsage = [
            'prompt_tokens' => 0,
            'completion_tokens' => 0,
            'total_tokens' => 0,
        ];
        $modelsUsed = [];

        try {
            foreach ($chunks as $i => $chunk) {
                // Build prompt with 5-service architecture (supports userId for future DB lookup)
                $chunkUserPrompt = $this->promptBuilder->buildEmailAnalysisPrompt($chunk, $userId, $userGoals);
                file_put_contents(storage_path('logs/last_prompt.txt'), $chunkUserPrompt);

                // call router which handles model selection/rotation
                $response = $this->router->callWithPredictiveRouting($systemPrompt, $chunkUserPrompt);

                $content = $response['choices'][0]['message']['content'] ?? '';
                file_put_contents(storage_path('logs/last_response.txt'), $content);

                // Use the normalizer service to handle all response formats
                $normalizedItems = $this->normalizer->normalize($content);

                Log::info('AI Response', [
                    'content' => $content,
                    'usage' => $response['usage'] ?? [],
                    'model' => $response['model'] ?? 'unknown'
                ]);

                // Append normalized items to aggregate list
                foreach ($normalizedItems as $ni) {
                    $allParsed[] = $ni;
                }

                // aggregate usage meta if present
                $usage = $response['usage'] ?? [];
                $aggregateUsage['prompt_tokens'] += $usage['prompt_tokens'] ?? 0;
                $aggregateUsage['completion_tokens'] += $usage['completion_tokens'] ?? 0;
                $aggregateUsage['total_tokens'] += $usage['total_tokens'] ?? 0;

                $modelsUsed[] = $response['model'] ?? ($response['model_name'] ?? 'unknown');

                // Small delay to avoid bursts (only if not last chunk)
                // Prevents Throws 429: You’re sending too many requests too quickly.
                if ($i !== count($chunks) - 1) {
                    sleep(10);
                }
            }

            return [
                'success' => true,
                'data' => $allParsed,
                'meta' => [
                    'models' => array_values(array_unique($modelsUsed)),
                    'prompt_tokens' => $aggregateUsage['prompt_tokens'],
                    'completion_tokens' => $aggregateUsage['completion_tokens'],
                    'total_tokens' => $aggregateUsage['total_tokens'],
                    'anonymized' => true,
                ]
            ];

        } catch (\Exception $e) {
            // TODO: Add more information about error
            Log::error('Email analysis failed', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
