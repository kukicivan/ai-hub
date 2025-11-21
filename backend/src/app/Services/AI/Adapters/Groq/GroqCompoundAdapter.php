<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class GroqCompoundAdapter extends BaseGroqAdapter
{
    protected string $model = 'groq/compound';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 8192;
}
