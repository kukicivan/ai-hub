<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class Llama31_8bInstantAdapter extends BaseGroqAdapter
{
    protected string $model = 'llama-3.1-8b-instant';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 8000;
}
