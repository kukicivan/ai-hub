<?php

namespace App\Services\AI\Adapters;

use App\Models\UserApiKey;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

abstract class BaseGroqAdapter implements AIModelAdapterInterface
{
    protected string $model;
    protected int $dailyLimit;
    protected int $maxTokens;
    protected string $apiKey;
    protected ?int $userId = null;

    public function __construct()
    {
        $this->apiKey = config('services.groq.key');
    }

    /**
     * Set user ID to use their API key from database.
     */
    public function setUserId(int $userId): self
    {
        $this->userId = $userId;
        $this->loadUserApiKey();
        return $this;
    }

    /**
     * Load API key from database for the set user.
     */
    protected function loadUserApiKey(): void
    {
        if (!$this->userId) {
            return;
        }

        $userApiKey = UserApiKey::getForService($this->userId, UserApiKey::SERVICE_GROK);

        if ($userApiKey && $userApiKey->isValid()) {
            $decryptedKey = $userApiKey->getDecryptedKey();
            if ($decryptedKey) {
                $this->apiKey = $decryptedKey;
                $userApiKey->markAsUsed();
                Log::debug("Using user's Grok API key", ['user_id' => $this->userId]);
            }
        }
    }

    /**
     * Directly set the API key (useful for testing or manual override).
     */
    public function setApiKey(string $apiKey): self
    {
        $this->apiKey = $apiKey;
        return $this;
    }

    public function call(string $systemPrompt, string $userPrompt): array
    {
        if (!$this->isAvailable()) {
            throw new \Exception("Groq {$this->model} daily limit exceeded");
        }

        $requestPayload = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userPrompt]
            ],
            'max_tokens' => $this->maxTokens,
            'temperature' => 0.1,
            'response_format' => ['type' => 'json_object']
        ];

        $response = Http::timeout(60)
            ->withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])
            ->post('https://api.groq.com/openai/v1/chat/completions', $requestPayload);

        if (!$response->successful()) {
            Log::error("Groq API error", [
                'model' => $this->model,
                'status_code' => $response->status(),
                'response_body' => $response->body(),
                'request_payload' => $requestPayload
            ]);

            throw new \Exception("Groq API error: {$response->status()}");
        }

        $data = $response->json();

        // FIX: Log complete response
        Log::debug("Groq API full response", [
            'model' => $this->model,
            'response' => $data,
            'usage' => $data['usage'] ?? null,
            'finish_reason' => $data['choices'][0]['finish_reason'] ?? null,
            'response_id' => $data['id'] ?? null,
            'created' => $data['created'] ?? null
        ]);

        $tokensUsed = $data['usage']['total_tokens'] ?? 0;
        $this->trackUsage($tokensUsed);

        return $data;
    }

    public function getName(): string
    {
        return $this->model;
    }

    public function getProvider(): string
    {
        return 'groq';
    }

    public function getDailyTokenLimit(): int
    {
        return $this->dailyLimit;
    }

    public function getCostPerToken(): float
    {
        return 0.0;
    }

    public function isAvailable(): bool
    {
        $used = Cache::get($this->getCacheKey(), 0);
        return $used < $this->dailyLimit;
    }

    protected function trackUsage(int $tokens): void
    {
        $key = $this->getCacheKey();
        $current = Cache::get($key, 0);
        Cache::put($key, $current + $tokens, now()->endOfDay());
    }

    protected function getCacheKey(): string
    {
        return "groq_{$this->model}_tokens_" . date('Y-m-d');
    }
}
