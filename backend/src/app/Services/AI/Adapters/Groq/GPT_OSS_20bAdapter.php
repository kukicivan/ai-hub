<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class GPT_OSS_20bAdapter extends BaseGroqAdapter
{
    protected string $model = 'openai/gpt-oss-20b';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 8000;
}
