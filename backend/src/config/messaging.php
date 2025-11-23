<?php

return [
    'adapters' => [
        'gmail-primary' => [
            // enabled, app_script_url and api_key are read from database (UserAiService)
            'timeout' => 300, // 5 minutes
            'retry_times' => 6,
            'cache_ttl' => 300, // 5 minutes
        ],

        // Future adapters
        'slack' => [
            'enabled' => env('SLACK_ENABLED', false),
            'bot_token' => env('SLACK_BOT_TOKEN'),
            'app_token' => env('SLACK_APP_TOKEN'),
        ],

        'teams' => [
            'enabled' => env('TEAMS_ENABLED', false),
            'tenant_id' => env('TEAMS_TENANT_ID'),
            'client_id' => env('TEAMS_CLIENT_ID'),
            'client_secret' => env('TEAMS_CLIENT_SECRET'),
        ],
    ],

    'sync' => [
        'interval' => 300,      // 5 minutes
        'batch_size' => 50,
        'max_retries' => 3,
    ],

    // AI config stays the same...
    'ai' => [
        'enabled' => env('AI_ENABLED', false),
        'queue' => env('AI_QUEUE', 'ai-processing'),
    ],
];
