<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class PlayAITTSAdapter extends BaseGroqAdapter
{
    protected string $model = 'playai-tts';
    protected int $dailyLimit = 1200;
    protected int $maxTokens = 3600;
}
