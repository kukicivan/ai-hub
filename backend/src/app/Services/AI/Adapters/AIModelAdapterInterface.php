<?php

namespace App\Services\AI\Adapters;

interface AIModelAdapterInterface
{
    public function call(string $systemPrompt, string $userPrompt): array;
    public function getName(): string;
    public function getProvider(): string;
    public function getDailyTokenLimit(): int;
    public function getCostPerToken(): float;
    public function isAvailable(): bool;
}
