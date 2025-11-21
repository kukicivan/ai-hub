<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MessagingMessage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class EmailControllerV5 extends Controller
{
    /**
     * Get paginated list of emails with enhanced AI analysis structure (V5)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
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
                    $qb->whereRaw("JSON_EXTRACT(metadata, '$.subject') LIKE ?", ["%{$q}%"])
                       ->orWhereRaw("JSON_EXTRACT(sender, '$.email') LIKE ?", ["%{$q}%"])
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

            // Map to V5 API response format
            $data = $paginator->getCollection()->map(function($message) {
                return $this->formatMessageV5($message);
            });

            return response()->json([
                'success' => true,
                'data' => $data,
                'meta' => [
                    'page' => $paginator->currentPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'total_pages' => $paginator->lastPage(),
                ],
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'details' => $e->errors(),
            ], 400);

        } catch (\Exception $e) {
            Log::error('Email API V5 error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => app()->environment('production')
                    ? 'Internal server error'
                    : $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Format message for V5 API response with enhanced structure
     *
     * @param MessagingMessage $message
     * @return array
     */
    private function formatMessageV5(MessagingMessage $message): array
    {
        $sender = $message->sender ?? [];
        $metadata = $message->metadata ?? [];
        $aiAnalysis = $message->ai_analysis ?? null;

        // Build Gmail link
        $gmailLink = sprintf(
            'https://mail.google.com/mail/u/0/#inbox/%s',
            $message->message_id
        );

        return [
            'id' => $message->message_id, // Use Gmail message_id as primary ID
            'sender' => $sender['email'] ?? 'unknown@example.com',
            'subject' => $metadata['subject'] ?? '(No Subject)',
            'summary' => $this->extractSummary($aiAnalysis),
            'sentiment' => $this->extractSentiment($aiAnalysis),
            'gmail_link' => $gmailLink,
            'action_steps' => $this->extractActionSteps($aiAnalysis),
            'html_analysis' => $this->extractHtmlAnalysis($aiAnalysis, $message),
            'classification' => $this->extractClassification($aiAnalysis),
            'recommendation' => $this->extractRecommendation($aiAnalysis),
            
            // Status flags
            'unread' => $message->is_unread,
            'starred' => $message->is_starred,
            'important' => $metadata['isImportant'] ?? false,
            'priority' => $message->priority,
            
            // Date fields
            'received_at' => $message->message_timestamp,
            'synced_at' => $message->created_at,
            'ai_processed_at' => $message->ai_processed_at,
            'ai_status' => $message->ai_status,
        ];
    }

    /**
     * Extract summary from AI analysis
     */
    private function extractSummary(?array $aiAnalysis): string
    {
        if (!$aiAnalysis) {
            return '';
        }

        return $aiAnalysis['summary'] ?? 
               $aiAnalysis['brief_summary'] ?? 
               '';
    }

    /**
     * Extract sentiment data from AI analysis
     */
    private function extractSentiment(?array $aiAnalysis): array
    {
        if (!$aiAnalysis || !isset($aiAnalysis['sentiment'])) {
            return [
                'tone' => 'neutral',
                'urgency_score' => 0,
                'business_potential' => 0,
            ];
        }

        $sentiment = $aiAnalysis['sentiment'];

        // Handle both string and object sentiment formats
        if (is_string($sentiment)) {
            return [
                'tone' => $sentiment,
                'urgency_score' => $aiAnalysis['urgency_score'] ?? 0,
                'business_potential' => $aiAnalysis['business_potential'] ?? 0,
            ];
        }

        return [
            'tone' => $sentiment['tone'] ?? 'neutral',
            'urgency_score' => $sentiment['urgency_score'] ?? 0,
            'business_potential' => $sentiment['business_potential'] ?? 0,
        ];
    }

    /**
     * Extract action steps from AI analysis
     */
    private function extractActionSteps(?array $aiAnalysis): array
    {
        if (!$aiAnalysis) {
            return [];
        }

        // Check if action_steps or action_items exist
        $actions = $aiAnalysis['action_steps'] ?? 
                   $aiAnalysis['action_items'] ?? 
                   [];

        if (empty($actions)) {
            return [];
        }

        // Ensure each action has the required fields
        return array_map(function($action) {
            return [
                'type' => strtoupper($action['type'] ?? 'NONE'),
                'deadline' => $action['deadline'] ?? null,
                'timeline' => $action['timeline'] ?? 'nema_deadline',
                'description' => $action['description'] ?? '',
                'estimated_time' => $action['estimated_time'] ?? 0,
                'template_suggestion' => $action['template_suggestion'] ?? null,
            ];
        }, $actions);
    }

    /**
     * Extract HTML analysis from AI analysis
     */
    private function extractHtmlAnalysis(?array $aiAnalysis, MessagingMessage $message): array
    {
        if (!$aiAnalysis || !isset($aiAnalysis['html_analysis'])) {
            return [
                'cleaned_text' => $message->content_snippet ?? substr($message->content_text, 0, 200),
                'is_newsletter' => false,
                'urgency_markers' => [],
                'structure_detected' => 'unknown',
            ];
        }

        $htmlAnalysis = $aiAnalysis['html_analysis'];

        return [
            'cleaned_text' => $htmlAnalysis['cleaned_text'] ?? 
                             $message->content_snippet ?? 
                             substr($message->content_text, 0, 200),
            'is_newsletter' => $htmlAnalysis['is_newsletter'] ?? false,
            'urgency_markers' => $htmlAnalysis['urgency_markers'] ?? [],
            'structure_detected' => $htmlAnalysis['structure_detected'] ?? 'unknown',
        ];
    }

    /**
     * Extract classification from AI analysis
     */
    private function extractClassification(?array $aiAnalysis): array
    {
        if (!$aiAnalysis || !isset($aiAnalysis['classification'])) {
            return [
                'primary_category' => 'other',
                'subcategory' => 'unknown',
                'confidence_score' => 0.0,
                'matched_keywords' => [],
            ];
        }

        $classification = $aiAnalysis['classification'];

        return [
            'primary_category' => $classification['primary_category'] ?? 
                                 $classification['category'] ?? 
                                 'other',
            'subcategory' => $classification['subcategory'] ?? 
                            $classification['sub_category'] ?? 
                            'unknown',
            'confidence_score' => (float)($classification['confidence_score'] ?? 
                                         $classification['confidence'] ?? 
                                         0.0),
            'matched_keywords' => $classification['matched_keywords'] ?? 
                                 $classification['keywords'] ?? 
                                 [],
        ];
    }

    /**
     * Extract recommendation from AI analysis
     */
    private function extractRecommendation(?array $aiAnalysis): array
    {
        if (!$aiAnalysis || !isset($aiAnalysis['recommendation'])) {
            return [
                'text' => '',
                'reasoning' => '',
                'priority_level' => 'low',
                'roi_estimate' => 'N/A',
            ];
        }

        $recommendation = $aiAnalysis['recommendation'];

        return [
            'text' => $recommendation['text'] ?? 
                     $recommendation['message'] ?? 
                     '',
            'reasoning' => $recommendation['reasoning'] ?? 
                          $recommendation['reason'] ?? 
                          '',
            'priority_level' => $recommendation['priority_level'] ?? 
                               $recommendation['priority'] ?? 
                               'low',
            'roi_estimate' => $recommendation['roi_estimate'] ?? 
                             $recommendation['roi'] ?? 
                             'N/A',
        ];
    }

    /**
     * Get single email with full details (kept for compatibility)
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $message = MessagingMessage::with(['channel', 'attachments', 'headers'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $this->formatMessageV5($message),
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Message not found',
            ], 404);

        } catch (\Exception $e) {
            Log::error('Email show V5 error', [
                'id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Internal server error',
            ], 500);
        }
    }
}
