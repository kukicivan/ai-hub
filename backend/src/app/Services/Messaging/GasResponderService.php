<?php

namespace App\Services\Messaging;

use App\Models\UserAiService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GasResponderService
{
    protected ?string $appScriptUrl;
    protected int $timeoutSeconds = 30;

    public function __construct()
    {
        $this->appScriptUrl = UserAiService::getOrCreateForUser(Auth::id())->gmail_settings['app_script_url'] ?? null;
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
            $msg = 'GasResponderService: app_script_url not configured in user settings';
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
