<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

class WhisperLargeV3TurboAdapter extends BaseGroqAdapter
{
    protected string $model = 'whisper-large-v3-turbo';
    protected int $dailyLimit = 7200;
    protected int $maxTokens = 28800;
}
