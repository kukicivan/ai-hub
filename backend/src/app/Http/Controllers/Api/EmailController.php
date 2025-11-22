<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MessagingMessage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class EmailController extends Controller
{
    /**
     * Get paginated list of emails with AI analysis
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            // Validation
            $validated = $request->validate([
                'page' => 'integer|min:1',
                'per_page' => 'integer|min:1|max:200',
                'q' => 'string|nullable|max:255',
                'unread' => 'boolean|nullable',
                'priority' => 'in:low,normal,high|nullable',
                'channel_id' => 'integer|exists:messaging_channels,id|nullable',
                'sort' => 'string|in:created_at,message_timestamp,priority|nullable',
            ]);

            $perPage = $validated['per_page'] ?? 25;

            // Build query
            $query = MessagingMessage::query()
                ->with(['channel', 'attachments'])
                ->where('channel_id', $validated['channel_id'] ?? 1); // Default to primary channel

            // Search filter
            if (!empty($validated['q'])) {
                $q = $validated['q'];
                $query->where(function($qb) use ($q) {
                    $qb->whereRaw("JSON_EXTRACT(metadata, '$$.subject') LIKE ?", ["%{$q}%"])
                       ->orWhereRaw("JSON_EXTRACT(sender, '$$.email') LIKE ?", ["%{$q}%"])
                       ->orWhere('content_text', 'like', "%{$q}%");
                });
            }

            // Unread filter
            if (isset($validated['unread'])) {
                $query->where('is_unread', $validated['unread']);
            }

            // Priority filter
            if (!empty($validated['priority'])) {
                $query->where('priority', $validated['priority']);
            }

            // Sorting
            $sortBy = $validated['sort'] ?? 'message_timestamp';
            $query->orderBy($sortBy, 'desc');

            // Paginate
            $paginator = $query->paginate($perPage)->appends($request->query());

            // Map to API response format
            $data = $paginator->getCollection()->map(function($message) {
                return $this->formatMessage($message);
            });

            // Standardized response per SRS 12.2
            return response()->json([
                'success' => true,
                'data' => [
                    'messages' => $data,
                    'meta' => [
                        'page' => $paginator->currentPage(),
                        'per_page' => $paginator->perPage(),
                        'total' => $paginator->total(),
                        'total_pages' => $paginator->lastPage(),
                    ]
                ],
                'message' => 'Messages retrieved successfully'
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Standardized error response per SRS 12.2
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 400);

        } catch (\Exception $e) {
            Log::error('Email API error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Standardized error response per SRS 12.2
            return response()->json([
                'success' => false,
                'message' => app()->environment('production')
                    ? 'Internal server error'
                    : $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single email with full details
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $message = MessagingMessage::with(['channel', 'attachments', 'headers'])
                ->findOrFail($id);

            // Standardized response per SRS 12.2
            return response()->json([
                'success' => true,
                'data' => ['message' => $this->formatMessage($message, true)],
                'message' => 'Message retrieved successfully'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Standardized error response per SRS 12.2
            return response()->json([
                'success' => false,
                'message' => 'Message not found',
            ], 404);

        } catch (\Exception $e) {
            Log::error('Email show error', [
                'id' => $id,
                'error' => $e->getMessage(),
            ]);

            // Standardized error response per SRS 12.2
            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
            ], 500);
        }
    }

    /**
     * Format message for API response
     *
     * @param MessagingMessage $message
     * @param bool $fullDetails
     * @return array
     */
    private function formatMessage(MessagingMessage $message, bool $fullDetails = false): array
    {
        $sender = $message->sender ?? [];
        $metadata = $message->metadata ?? [];
        $aiAnalysis = $message->ai_analysis ?? null;

        $formatted = [
            'id' => $message->id,
            'message_id' => $message->message_id,
            'thread_id' => $message->thread_id,

            // Basic info
            'from' => $sender['email'] ?? 'unknown@example.com',
            'from_name' => $sender['name'] ?? $sender['email'] ?? 'Unknown',
            'to' => $this->formatRecipients($message->recipients['to'] ?? []),
            'cc' => $this->formatRecipients($message->recipients['cc'] ?? []),
            'subject' => $metadata['subject'] ?? '(No Subject)',
            'body_preview' => $message->getSnippet(200),

            // Timestamps
            'received_at' => $message->message_timestamp->toIso8601String(),
            'synced_at' => $message->synced_at?->toIso8601String(),

            // Status flags
            'unread' => $message->is_unread,
            'starred' => $message->is_starred,
            'important' => $metadata['isImportant'] ?? false,
            'priority' => $message->priority,

            // Attachments
            'has_attachments' => $message->attachment_count > 0,
            'attachment_count' => $message->attachment_count,

            // AI Analysis
            'ai' => $this->formatAIAnalysis($aiAnalysis, $message->ai_status),
        ];

        // Add full details if requested
        if ($fullDetails) {
            $formatted['content'] = [
                'text' => $message->content_text,
                'html' => $message->content_html,
            ];

            $formatted['attachments'] = $message->attachments->map(function($att) {
                return [
                    'id' => $att->id,
                    'name' => $att->name,
                    'mime_type' => $att->mime_type,
                    'size' => $att->size,
                    'size_formatted' => $this->formatBytes($att->size),
                    'url' => $att->url,
                ];
            })->toArray();

            $formatted['headers'] = $message->headers ? [
                'message_id' => $message->headers->message_id_header,
                'in_reply_to' => $message->headers->in_reply_to,
                'references' => $message->headers->references,
            ] : null;
        } else {
            // Preview only
            $formatted['attachments'] = $message->attachments->take(3)->map(function($att) {
                return [
                    'name' => $att->name,
                    'size_formatted' => $this->formatBytes($att->size),
                ];
            })->toArray();
        }

        return $formatted;
    }

    /**
     * Format AI analysis for API response
     *
     * @param array|null $analysis
     * @param string $status
     * @return array
     */
    private function formatAIAnalysis(?array $analysis, string $status): array
    {
        if (!$analysis || $status !== 'completed') {
            return [
                'status' => $status,
                'pending' => $status === 'pending',
                'processing' => $status === 'processing',
                'failed' => $status === 'failed',
            ];
        }

        return [
            'status' => 'completed',
            'summary' => $analysis['summary'] ?? null,
            'sentiment' => $analysis['sentiment'] ?? 'neutral',
            'intent' => $analysis['intent'] ?? 'other',
            'priority' => $analysis['priority'] ?? 'normal',
            'entities' => [
                'dates' => $analysis['entities']['dates'] ?? [],
                'people' => $analysis['entities']['people'] ?? [],
                'organizations' => $analysis['entities']['organizations'] ?? [],
                'locations' => $analysis['entities']['locations'] ?? [],
            ],
            'suggested_reply' => $analysis['suggested_reply'] ?? null,
            'action_items' => $analysis['action_items'] ?? [],
            'confidence' => $analysis['confidence'] ?? 0.0,
            'model' => $analysis['model'] ?? 'unknown',
            'processed_at' => $analysis['processed_at'] ?? null,
        ];
    }

    /**
     * Format recipients list
     *
     * @param array $recipients
     * @return array
     */
    private function formatRecipients(array $recipients): array
    {
        return array_map(function($recipient) {
            return [
                'email' => $recipient['email'] ?? 'unknown',
                'name' => $recipient['name'] ?? $recipient['email'] ?? 'Unknown',
            ];
        }, $recipients);
    }

    /**
     * Format bytes to human readable
     *
     * @param int $bytes
     * @return string
     */
    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
