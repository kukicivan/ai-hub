<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class KimiK2InstructAdapter extends BaseGroqAdapter
{
    protected string $model = 'moonshotai/kimi-k2-instruct-0905';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 8000;
}
