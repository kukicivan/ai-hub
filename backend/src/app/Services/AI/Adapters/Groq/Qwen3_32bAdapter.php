<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class Qwen3_32bAdapter extends BaseGroqAdapter
{
    protected string $model = 'qwen/qwen3-32b';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 8000;
}
