<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class LlamaPromptGuard2_86mAdapter extends BaseGroqAdapter
{
    protected string $model = 'meta-llama/llama-prompt-guard-2-86m';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 500000;
}
