<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class Llama33_70bVersatileAdapter extends BaseGroqAdapter
{
    protected string $model = 'llama-3.3-70b-versatile';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 8000;
}
