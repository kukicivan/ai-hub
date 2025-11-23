<?php

namespace App\Services\AI\Adapters;

use App\Models\UserApiKey;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

abstract class BaseGroqAdapter implements AIModelAdapterInterface
{
    protected string $model;
    protected int $dailyLimit;
    protected int $maxTokens;
    protected string $apiKey;

    public function __construct()
    {
        $userApiKey = UserApiKey::getForService(Auth::id(), UserApiKey::SERVICE_GROK);
        $this->apiKey = $userApiKey?->getDecryptedKey() ?? '';
    }

    public function call(string $systemPrompt, string $userPrompt): array
    {
        if (!$this->apiKey) {
            throw new \Exception("Grok API key not found in database. Please add your API key in Settings.");
        }

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
            ]);

            throw new \Exception("Groq API error: {$response->status()}");
        }

        $data = $response->json();
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
