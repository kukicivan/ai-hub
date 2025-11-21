<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class LlamaGuard4_12bAdapter extends BaseGroqAdapter
{
    protected string $model = 'meta-llama/llama-guard-4-12b';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 1024;
}
