<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class Llama4Maverick17bAdapter extends BaseGroqAdapter
{
    protected string $model = 'meta-llama/llama-4-maverick-17b-128e-instruct';
    protected int $dailyLimit = 14400;
    protected int $maxTokens = 8192;
}
