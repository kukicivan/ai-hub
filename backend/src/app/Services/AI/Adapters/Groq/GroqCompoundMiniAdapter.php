<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class GroqCompoundMiniAdapter extends BaseGroqAdapter
{
    protected string $model = 'groq/compound-mini';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 8192;
}
