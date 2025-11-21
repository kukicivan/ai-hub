<?php

namespace App\Services\AI\Adapters\Groq;

use App\Services\AI\Adapters\BaseGroqAdapter;

// TODO: (For latter) Should this Adapters implements AIModelAdapterInterface interface
class Allam27bAdapter extends BaseGroqAdapter
{
    protected string $model = 'allam-2-7b';
    // RPM 30, RPD ~7K -> use daily limit guess compatible with others
    protected int $dailyLimit = 7000;
    protected int $maxTokens = 500000; // indicated high token capacity
}
