<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class WhisperLargeV3Adapter extends BaseGroqAdapter
{
    protected string $model = 'whisper-large-v3';
    protected int $dailyLimit = 7200;
    protected int $maxTokens = 28800;
}
