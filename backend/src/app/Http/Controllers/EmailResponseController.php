<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Messaging\EmailResponderService;

class EmailResponseController extends Controller
{
    protected EmailResponderService $responder;

    public function __construct(EmailResponderService $responder)
    {
        $this->responder = $responder;
    }

    /**
     * Receive an incoming email payload and return/send a reply.
     * Expected payload (JSON): { from, to, subject, body }
     */
    public function respond(Request $request)
    {
        $payload = $request->only(['from', 'to', 'subject', 'body']);

        // Basic validation - ensure at least `from` and `body`
        if (empty($payload['from']) || empty($payload['body'])) {
            return response()->json([
                'success' => false,
                'message' => 'Missing required fields: from and body'
            ], 422);
        }

        $result = $this->responder->respondToEmail($payload);

        // Standardized response per SRS 12.2
        return response()->json([
            'success' => true,
            'data' => $result,
            'message' => 'Email response generated successfully'
        ]);
    }
}
