<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Feature Toggle
    |--------------------------------------------------------------------------
    */
    'enabled' => env('AI_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Model Routing Strategy
    |--------------------------------------------------------------------------
    | Options: 'predictive' (token-based), 'fallback' (try in order), 'single' (one model only)
    */
    'routing_strategy' => env('AI_ROUTING_STRATEGY', 'predictive'),

    /*
    |--------------------------------------------------------------------------
    | Primary AI Provider
    |--------------------------------------------------------------------------
    | Used when routing_strategy is 'single'
    */
    'primary_provider' => env('AI_PRIMARY_PROVIDER', 'groq'),
    'primary_model' => env('AI_PRIMARY_MODEL', 'llama-3.1-8b-instant'),

    /*
    |--------------------------------------------------------------------------
    | OpenAI Configuration
    |--------------------------------------------------------------------------
    */
    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'max_tokens' => env('OPENAI_MAX_TOKENS', 4000),
        'temperature' => env('OPENAI_TEMPERATURE', 0.3),
        'daily_token_limit' => PHP_INT_MAX, // Paid - unlimited
    ],

    /*
    |--------------------------------------------------------------------------
    | Groq Configuration (Free Tier)
    |--------------------------------------------------------------------------
    */
    'groq' => [
        'api_key' => env('GROQ_API_KEY'),

        'models' => [
            'llama-3.1-8b-instant' => [
                'daily_token_limit' => 14400, // Free tier
                'tokens_per_minute' => 14400,
                'requests_per_minute' => 30,
            ],
            'llama-3.3-70b-versatile' => [
                'daily_token_limit' => 14400,
                'tokens_per_minute' => 14400,
                'requests_per_minute' => 30,
            ],
            'gemma2-9b-it' => [
                'daily_token_limit' => 7200,
                'tokens_per_minute' => 7200,
                'requests_per_minute' => 30,
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Email Analysis Settings
    |--------------------------------------------------------------------------
    */
    'email_analysis' => [
        'max_emails_per_batch' => 50,
        'include_attachments_metadata' => true,
        'anonymize_personal_data' => true,
        'retry_failed_analysis' => true,
        'max_retries' => 3,
    ],

    /*
    |--------------------------------------------------------------------------
    | Goal System
    |--------------------------------------------------------------------------
    */
    'goals' => [
        'enabled' => true,
        'storage_path' => storage_path('app/goals'),
        'auto_update' => env('GOALS_AUTO_UPDATE', false),
        'cache_ttl' => 3600, // 1 hour
    ],

    /*
    |--------------------------------------------------------------------------
    | Cost Tracking
    |--------------------------------------------------------------------------
    */
    'cost_tracking' => [
        'enabled' => env('AI_COST_TRACKING_ENABLED', true),
        'log_to_database' => true,
        'alert_threshold_usd' => env('AI_COST_ALERT_THRESHOLD', 10.0),
    ],

    /*
    |--------------------------------------------------------------------------
    | Caching
    |--------------------------------------------------------------------------
    */
    'cache' => [
        'enabled' => env('AI_CACHE_ENABLED', true),
        'ttl' => 86400, // 24 hours
        'driver' => env('AI_CACHE_DRIVER', 'redis'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    */
    'logging' => [
        'enabled' => true,
        'level' => env('AI_LOG_LEVEL', 'info'),
        'channel' => env('AI_LOG_CHANNEL', 'stack'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Token Estimation
    |--------------------------------------------------------------------------
    */
    'token_estimation' => [
        'average_chars_per_token' => 4,
        'safety_buffer_percentage' => 20, // Add 20% buffer to estimates
    ],

    /*
    |--------------------------------------------------------------------------
    | Data Anonymization
    |--------------------------------------------------------------------------
    */
    'anonymization' => [
        'enabled' => env('AI_ANONYMIZATION_ENABLED', true),
        'patterns' => [
            'email' => '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/',
            'phone' => '/(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/',
            'url' => '/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/',
            'address' => '/\d{1,5}\s+[a-zA-Z0-9\s,]+,\s*[a-zA-Z\s]+,\s*[A-Z]{2}\s+\d{5}/',
        ],
        'replacements' => [
            'email' => '[EMAIL]',
            'phone' => '[PHONE]',
            'url' => '[URL]',
            'address' => '[ADDRESS]',
        ],
    ],
];
