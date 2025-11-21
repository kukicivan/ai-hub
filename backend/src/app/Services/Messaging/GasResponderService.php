<?php

namespace App\Services\Messaging;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GasResponderService
{
    protected ?string $appScriptUrl;
    protected int $timeoutSeconds = 30;

    public function __construct()
    {
        // Read from config -> messaging.adapters.gmail-primary.app_script_url
        $this->appScriptUrl = config('messaging.adapters.gmail-primary.app_script_url') ?: env('GMAIL_APP_SCRIPT_URL');
    }

    /**
     * Send a reply payload to configured Google Apps Script webhook.
     *
     * @param array $payload
     * @return array ['ok' => bool, 'status' => int|null, 'body' => mixed|null, 'error' => string|null]
     */
    public function sendToGas(array $payload): array
    {
        if (empty($this->appScriptUrl)) {
            $msg = 'GasResponderService: app script url not configured (messaging.adapters.gmail-primary.app_script_url or GMAIL_APP_SCRIPT_URL)';
            Log::warning($msg);
            return [
                'ok' => false,
                'status' => null,
                'body' => null,
                'error' => $msg,
            ];
        }

        Log::info('GasResponderService: sending payload to GAS', ['url' => $this->appScriptUrl, 'payload' => $payload]);

        try {
            $response = Http::timeout($this->timeoutSeconds)
                ->acceptJson()
                ->post($this->appScriptUrl, $payload);

            $status = $response->status();
            $body = null;

            // Attempt to decode JSON if present
            try {
                $body = $response->json();
            } catch (\Throwable $e) {
                $body = $response->body();
            }

            $ok = $response->successful();

            Log::info('GasResponderService: received response', ['status' => $status, 'body' => $body]);

            return [
                'ok' => $ok,
                'status' => $status,
                'body' => $body,
                'error' => null,
            ];
        } catch (\Throwable $e) {
            Log::error('GasResponderService: request failed: ' . $e->getMessage(), ['exception' => $e]);
            return [
                'ok' => false,
                'status' => null,
                'body' => null,
                'error' => $e->getMessage(),
            ];
        }
    }
}
