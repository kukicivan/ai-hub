<?php

namespace App\Services\AI;

use Exception;
use App\Services\AI\Adapters\Groq\{
    Llama31_8bInstantAdapter,
    Llama33_70bVersatileAdapter,
    GPT_OSS_120bAdapter,
    GPT_OSS_20bAdapter,
    GroqCompoundAdapter,
    GroqCompoundMiniAdapter,
    Llama4Maverick17bAdapter,
    Llama4Scout17bAdapter,
    Qwen3_32bAdapter,
    LlamaGuard4_12bAdapter,
    KimiK2InstructAdapter,
    Allam27bAdapter,
    LlamaPromptGuard2_22mAdapter,
    LlamaPromptGuard2_86mAdapter,
    PlayAITTSAdapter,
    PlayAITTSArabicAdapter,
    WhisperLargeV3Adapter,
    WhisperLargeV3TurboAdapter,
};

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

// TODO: There are issues in this Class, mostly on Logging, it is not providing sufficient data, so I can know what to do or fix
// TODO: (For latter) Also, there is an complicated architecture, but for now we will leave it as is
class ModelRouterService
{
    protected array $adapters = [];
    protected TokenEstimator $estimator;

    public function __construct(TokenEstimator $estimator)
    {
        $this->estimator = $estimator;

        // Priority: fastest free models first
        $this->adapters = [
            new Llama31_8bInstantAdapter(),
            new GroqCompoundMiniAdapter(),
            new Llama33_70bVersatileAdapter(),
            new GroqCompoundAdapter(),
            new GPT_OSS_20bAdapter(),
            new GPT_OSS_120bAdapter(),
            new Llama4Maverick17bAdapter(),
            new Llama4Scout17bAdapter(),
            new Qwen3_32bAdapter(),
            new LlamaGuard4_12bAdapter(),
            new KimiK2InstructAdapter(),
            new Allam27bAdapter(),
            new LlamaPromptGuard2_22mAdapter(),
            new LlamaPromptGuard2_86mAdapter(),
            new PlayAITTSAdapter(),
            new PlayAITTSArabicAdapter(),
            new WhisperLargeV3Adapter(),
            new WhisperLargeV3TurboAdapter(),
        ];
    }

    /**
     * Set user ID on all adapters to use their API key from database.
     */
    public function setUserId(int $userId): self
    {
        foreach ($this->adapters as $adapter) {
            if (method_exists($adapter, 'setUserId')) {
                $adapter->setUserId($userId);
            }
        }
        return $this;
    }

    /**
     * Get an adapter with enough tokens available
     * @throws Exception
     */
    public function getAvailableAdapter(int $estimatedTokens = 0)
    {
        $attemptedModels = [];

        // Prefer adapters with more available tokens first so we try
        // models with larger capacity before smaller ones.
        usort($this->adapters, function($a, $b) {
            $aTokens = $this->getAvailableTokens($a);
            $bTokens = $this->getAvailableTokens($b);
            return $bTokens <=> $aTokens;
        });

        foreach ($this->adapters as $adapter) {
            $canHandle = $this->canHandleRequest($adapter, $estimatedTokens);

            $attemptedModels[] = [
                'model' => $adapter->getName(),
                'available' => $adapter->isAvailable(),
                'tokens_available' => $this->getAvailableTokens($adapter),
                'can_handle' => $canHandle
            ];

            if ($canHandle) {
                Log::info("✅ Selected adapter", [
                    'model' => $adapter->getName(),
                    'estimated_tokens' => $estimatedTokens,
                    'available_tokens' => $this->getAvailableTokens($adapter),
                    'daily_limit' => $adapter->getDailyTokenLimit(),
                    'attempted_models' => $attemptedModels
                ]);
                return $adapter;
            }
        }

        Log::error("❌ No available AI models", [
            'estimated_tokens' => $estimatedTokens,
            'attempted_models' => $attemptedModels,
            'total_adapters_checked' => count($this->adapters)
        ]);

        throw new Exception('No available AI models with sufficient tokens');
    }

    /**
     * Check if the adapter can handle the request
     */
    protected function canHandleRequest($adapter, int $estimatedTokens): bool
    {
        if (!$adapter->isAvailable()) {
            return false;
        }

        $availableTokens = $this->getAvailableTokens($adapter);

        // Need at least estimated tokens + 20% buffer
        $requiredTokens = $estimatedTokens * 1.2;

        return $availableTokens >= $requiredTokens;
    }

    /**
     * Get available tokens for adapter
     */
    protected function getAvailableTokens($adapter): int
    {
        $key = $this->getCacheKey($adapter);
        $used = Cache::get($key, 0);
        $limit = $adapter->getDailyTokenLimit();

        return max(0, $limit - $used);
    }

    /**
     * Call AI with predictive routing
     * @throws Exception
     */
    public function callWithPredictiveRouting(string $systemPrompt, string $userPrompt): array
    {
        // Estimate tokens before calling
        $estimate = $this->estimator->estimateRequestTokens($systemPrompt, $userPrompt);

        Log::info("📊 Token estimate", [
            'prompt_tokens' => $estimate['prompt_tokens'],
            'completion_tokens' => $estimate['completion_tokens'],
            'total_tokens' => $estimate['total_tokens']
        ]);

        // Get an adapter with enough tokens
        $adapter = $this->getAvailableAdapter($estimate['total_tokens']);

        try {
            $startTime = microtime(true);
            $response = $adapter->call($systemPrompt, $userPrompt);
            $duration = round(microtime(true) - $startTime, 2);

            $actualTokens = $response['usage']['total_tokens'] ?? 0;
            $accuracy = $actualTokens > 0
                ? round(($estimate['total_tokens'] / $actualTokens) * 100, 2)
                : 0;

            Log::info("✅ API call successful", [
                'model' => $adapter->getName(),
                'provider' => $adapter->getProvider(),
                'duration_seconds' => $duration,
                'estimated_tokens' => $estimate['total_tokens'],
                'actual_tokens' => $actualTokens,
                'accuracy_percentage' => $accuracy,
                'prompt_tokens_used' => $response['usage']['prompt_tokens'] ?? 0,
                'completion_tokens_used' => $response['usage']['completion_tokens'] ?? 0,
                'daily_limit_remaining' => $this->getAvailableTokens($adapter)
            ]);

            return $response;

        } catch (Exception $e) {
            Log::error("❌ Adapter failed", [
                'model' => $adapter->getName(),
                'provider' => $adapter->getProvider(),
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'estimated_tokens' => $estimate['total_tokens'],
                'stack_trace' => $e->getTraceAsString()
            ]);

            // Remove the failed adapter temporarily and retry
            return $this->callWithFallback($systemPrompt, $userPrompt, [$adapter->getName()]);
        }
    }

    /**
     * Fallback with an exclusion list
     * @throws Exception
     */
    protected function callWithFallback(string $systemPrompt, string $userPrompt, array $excludeModels = []): array
    {
        foreach ($this->adapters as $adapter) {
            if (in_array($adapter->getName(), $excludeModels) || !$adapter->isAvailable()) {
                continue;
            }

            try {
                Log::info("⏳ Attempting fallback", [
                    'model' => $adapter->getName(),
                    'provider' => $adapter->getProvider(),
                    'excluded_models' => $excludeModels,
                    'sleep_seconds' => 10
                ]);

                sleep(10);

                $startTime = microtime(true);
                $response = $adapter->call($systemPrompt, $userPrompt);
                $duration = round(microtime(true) - $startTime, 2);

                Log::info("✅ Fallback successful", [
                    'model' => $adapter->getName(),
                    'provider' => $adapter->getProvider(),
                    'duration_seconds' => $duration,
                    'tokens_used' => $response['usage']['total_tokens'] ?? 0,
                    'prompt_tokens' => $response['usage']['prompt_tokens'] ?? 0,
                    'completion_tokens' => $response['usage']['completion_tokens'] ?? 0,
                    'response_id' => $response['id'] ?? null,
                    'response_created' => $response['created'] ?? null,
                    'finish_reason' => $response['choices'][0]['finish_reason'] ?? null
                ]);

                return $response;

            } catch (Exception $e) {
                $attemptedFallbacks[] = [
                    'model' => $adapter->getName(),
                    'error' => $e->getMessage(),
                    'code' => $e->getCode()
                ];

                Log::warning("⚠️ Fallback adapter failed", [
                    'model' => $adapter->getName(),
                    'provider' => $adapter->getProvider(),
                    'error_message' => $e->getMessage(),
                    'error_code' => $e->getCode(),
                    'http_status' => method_exists($e, 'getStatusCode') ? $e->getStatusCode() : null,
                    'response_body' => method_exists($e, 'getResponse')
                        ? (string)$e->getResponse()?->getBody()
                        : null
                ]);
            }
        }

        Log::critical("🚨 All AI models exhausted", [
            'excluded_models' => $excludeModels,
            'attempted_fallbacks' => $attemptedFallbacks ?? [],
            'total_attempts' => count($attemptedFallbacks ?? [])
        ]);

        throw new Exception('All AI models exhausted');
    }

    /**
     * Get cache key for adapter
     */
    protected function getCacheKey($adapter): string
    {
        return "ai_tokens_{$adapter->getProvider()}_{$adapter->getName()}_" . date('Y-m-d');
    }

    /**
     * Get detailed usage stats
     */
    public function getUsageStats(): array
    {
        $stats = [];
        $totalUsed = 0;
        $totalLimit = 0;

        foreach ($this->adapters as $adapter) {
            $limit = $adapter->getDailyTokenLimit();
            // use existing token-resolution logic to get available tokens
            $available = $this->getAvailableTokens($adapter);
            $used = max(0, $limit - $available);

            $totalUsed += $used;
            $totalLimit += $limit;

            $stats[] = [
                'model' => $adapter->getName(),
                'provider' => $adapter->getProvider(),
                'used' => $used,
                'limit' => $limit,
                'available' => $available,
                'percentage' => $limit > 0 ? round(($used / $limit) * 100, 2) : 0,
                'status' => $this->getModelStatus($used, $limit),
            ];
        }

        return [
            'models' => $stats,
            'summary' => [
                'total_used' => $totalUsed,
                'total_limit' => $totalLimit,
                'total_available' => max(0, $totalLimit - $totalUsed),
                'overall_percentage' => $totalLimit > 0 ? round(($totalUsed / $totalLimit) * 100, 2) : 0,
            ]
        ];
    }

    protected function getModelStatus(int $used, int $limit): string
    {
        if ($limit === 0 || $limit === PHP_INT_MAX) {
            return 'paid';
        }

        $percentage = ($used / $limit) * 100;

        if ($percentage >= 95) {
            return 'exhausted';
        } elseif ($percentage >= 80) {
            return 'low';
        } elseif ($percentage >= 50) {
            return 'medium';
        } else {
            return 'healthy';
        }
    }
}
