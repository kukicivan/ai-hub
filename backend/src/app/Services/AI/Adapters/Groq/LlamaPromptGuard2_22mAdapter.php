<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class LlamaPromptGuard2_22mAdapter extends BaseGroqAdapter
{
    protected string $model = 'meta-llama/llama-prompt-guard-2-22m';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 500000;
}
