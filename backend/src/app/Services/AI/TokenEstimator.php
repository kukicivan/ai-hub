<?php

namespace App\Services\AI;

class TokenEstimator
{
    /**
     * Estimate tokens for a prompt (rough approximation)
     * 1 token ≈ 4 characters for English, ≈ 2-3 for Serbian/Croatian
     */
    public function estimateTokens(string $text): int
    {
        // Check if text is mostly Cyrillic/Latin Serbian
        $isCyrillic = preg_match('/[\x{0400}-\x{04FF}]/u', $text);
        $isLatin = preg_match('/[čćžšđČĆŽŠĐ]/u', $text);

        if ($isCyrillic || $isLatin) {
            // Serbian/Croatian: denser encoding
            return (int) ceil(mb_strlen($text) / 2.5);
        }

        // English: standard encoding
        return (int) ceil(strlen($text) / 4);
    }

    /**
     * Estimate total tokens for a complete API call
     */
    public function estimateRequestTokens(string $systemPrompt, string $userPrompt, int $maxCompletionTokens = 2500): array
    {
        $promptTokens = $this->estimateTokens($systemPrompt) + $this->estimateTokens($userPrompt);
        $totalTokens = $promptTokens + $maxCompletionTokens;

        return [
            'prompt_tokens' => $promptTokens,
            'completion_tokens' => $maxCompletionTokens,
            'total_tokens' => $totalTokens,
        ];
    }
}
