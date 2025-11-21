<?php

namespace App\Services\Messaging;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Services\Messaging\GasResponderService;

class EmailResponderService
{
    protected ?GasResponderService $gasResponder = null;

    public function __construct(?GasResponderService $gasResponder = null)
    {
        $this->gasResponder = $gasResponder;
    }
    /**
     * Build a reply and optionally send it.
     * Returns an array with reply details.
     *
     * @param array $payload { from, to, subject, body }
     * @return array
     */
    public function respondToEmail(array $payload): array
    {
        $from = $payload['from'] ?? null;
        $to = $payload['to'] ?? null;
        $subject = $payload['subject'] ?? '';
        $body = $payload['body'] ?? '';

        // Compose a simple reply. You can replace this with more advanced logic.
        $replySubject = 'Re: ' . ($subject ?: 'Your message');
        $replyBody = "Hello,\n\nThanks for your message. We received:\n\n" . trim($body)
            . "\n\nThis is an automated acknowledgement.\n";

        $reply = [
            'to' => $from,
            'from' => $to,
            'subject' => $replySubject,
            'body' => $replyBody,
        ];

        // Log the reply for audit/debugging.
        Log::info('EmailResponderService: composed reply', $reply);

        // Attempt to send via Google Apps Script (GAS) if configured
        try {
            if (!empty($from) && $this->gasResponder) {
                $apiKey = config('messaging.adapters.gmail-primary.api_key') ?: env('GMAIL_API_KEY');

                $gasPayload = [
                    'apiKey' => $apiKey,
                    'action' => 'postReply',
                    'payload' => [
                        'to' => $from,
                        'subject' => $replySubject,
                        'body' => $replyBody,
                    ],
                ];

                $gasResult = $this->gasResponder->sendToGas($gasPayload);
                $reply['gas_result'] = $gasResult;
                $reply['sent_via_gas'] = $gasResult['ok'] ?? false;
            }
        } catch (\Throwable $e) {
            Log::warning('EmailResponderService: failed to post to GAS: '.$e->getMessage());
            $reply['sent_via_gas'] = false;
            $reply['gas_error'] = $e->getMessage();
        }

        // Fallback: attempt to send via Mail if configured. Wrap in try/catch so missing config doesn't break.
        try {
            if (empty($reply['sent_via_gas']) && !empty($from) && class_exists(Mail::class)) {
                // If you have a Mailable, you can send it here. We'll use simple raw mail as a safe default.
                Mail::raw($replyBody, function ($message) use ($from, $replySubject, $to) {
                    $message->to($from)
                        ->subject($replySubject);

                    if (!empty($to)) {
                        $message->from($to);
                    }
                });

                $reply['sent'] = true;
            }
        } catch (\Throwable $e) {
            Log::warning('EmailResponderService: failed to send reply via Mail: '.$e->getMessage());
            $reply['sent'] = $reply['sent'] ?? false;
            $reply['error'] = $reply['error'] ?? $e->getMessage();
        }

        return $reply;
    }
}
