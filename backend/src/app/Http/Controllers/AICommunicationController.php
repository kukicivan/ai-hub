<?php

namespace App\Http\Controllers;

use App\Models\MessagingMessage;
use App\Services\AI\AiMessageProcessor;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

// TODO: (For latter) Add filter for GAS messages not to include messages from spam folder, trash folder, etc.
// TODO: (For latter) Check number of emails returned by AI API. It missed one email, when in needed to return two emails it returned only one.

class AICommunicationController
{
    public function __construct(protected AiMessageProcessor $aiProcessor)
    {
    }

    /**
     * AI Dashboard View - Process and display analyzed emails
     * GET /api/communication/ai-dashboard
     */
    public function aiDashboard(Request $request)
    {
        $daysBack = $request->input('days', 10); // Default: today only

        try {

            $limit = 30;

            // Get messages from last N days
            $startDate = Carbon::now()->subDays($daysBack)->startOfDay();

            $messages = MessagingMessage::with(['thread', 'attachments'])
                ->where('message_timestamp', '>=', $startDate)
                ->orderBy('message_timestamp', 'desc')
                ->limit($limit)
                ->get();

            // Group messages by priority and category
            $priorityActions = $this->extractPriorityActions($messages);
            $groupedByDate = $this->groupMessagesByDate($messages);

            return view('communication.ai-dashboard', [
                'priorityActions' => $priorityActions,
                'groupedMessages' => $groupedByDate,
                'totalMessages' => $messages->count(),
                'processedMessages' => $messages->where('ai_status', 'completed')->count(),
                'daysBack' => $daysBack,
                'processingStats' => [
                    'total' => $messages->count(),
                    'processed' => -1,
                    'success_rate' => $messages->count() > 0
                        ? round(($messages->where('ai_status', 'completed')->count() / $messages->count()) * 100, 1)
                        : 0,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('AI Dashboard failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return view('communication.ai-dashboard', [
                'error' => $e->getMessage(),
                'priorityActions' => [],
                'groupedMessages' => [],
                'totalMessages' => 0,
                'processedMessages' => 0,
                'daysBack' => $daysBack,
            ]);
        }
    }

    /**
     * Extract priority actions for the dashboard header
     */
    protected function extractPriorityActions($messages): array
    {
        $urgent = [];
        $important = [];
        $scheduled = [];
        $recommendations = [];

        foreach ($messages as $message) {
            if ($message->ai_status !== 'completed' || empty($message->ai_analysis)) {
                continue;
            }

            $analysis = $message->ai_analysis;

            // Urgent (high priority + high urgency)
            if (($analysis['priority_level'] ?? '') === 'high' &&
                ($analysis['urgency_score'] ?? 0) >= 8) {
                $urgent[] = [
                    'subject' => $analysis['subject'] ?? 'No subject',
                    'recommendation' => $analysis['recommendation'] ?? '',
                    'sender' => $message->sender['name'] ?? $message->sender['email'] ?? 'Unknown',
                    'link' => $analysis['gmail_link'] ?? '#',
                    'message_id' => $message->message_id,
                    'deadline' => $this->calculateDeadline($analysis['timeline'] ?? 'hitno'),
                ];
            } // Important (high/medium priority)
            elseif (in_array($analysis['priority_level'] ?? '', ['high', 'medium']) &&
                ($analysis['urgency_score'] ?? 0) >= 5) {
                $important[] = [
                    'subject' => $analysis['subject'] ?? 'No subject',
                    'recommendation' => $analysis['recommendation'] ?? '',
                    'sender' => $message->sender['name'] ?? $message->sender['email'] ?? 'Unknown',
                    'link' => $analysis['gmail_link'] ?? '#',
                    'message_id' => $message->message_id,
                    'deadline' => $this->calculateDeadline($analysis['timeline'] ?? 'ova_nedelja'),
                ];
            }

            // Extract scheduled items from action_steps
            if (!empty($analysis['action_steps'])) {
                foreach ($analysis['action_steps'] as $step) {
                    if (stripos($step, 'zakazati') !== false ||
                        stripos($step, 'meeting') !== false ||
                        stripos($step, 'poziv') !== false) {
                        $scheduled[] = [
                            'action' => $step,
                            'subject' => $analysis['subject'] ?? '',
                            'link' => $analysis['gmail_link'] ?? '#',
                            'message_id' => $message->message_id,
                        ];
                    }
                }
            }

            // General recommendations
            if (($analysis['business_potential'] ?? 0) >= 7 ||
                ($analysis['automation_relevance'] ?? 0) >= 7) {
                $recommendations[] = [
                    'recommendation' => $analysis['recommendation'] ?? '',
                    'subject' => $analysis['subject'] ?? '',
                    'link' => $analysis['gmail_link'] ?? '#',
                    'message_id' => $message->message_id,
                ];
            }
        }

        return [
            'urgent' => array_slice($urgent, 0, 5),
            'important' => array_slice($important, 0, 5),
            'scheduled' => array_slice($scheduled, 0, 5),
            'recommendations' => array_slice($recommendations, 0, 3),
        ];
    }

    /**
     * Group messages by date
     */
    protected function groupMessagesByDate($messages): array
    {
        $grouped = [];

        foreach ($messages as $message) {
            if ($message->ai_status !== 'completed' || empty($message->ai_analysis)) {
                continue;
            }

            $date = $message->message_timestamp->format('Y-m-d');
            $dateLabel = $message->message_timestamp->format('d.m.Y (l)');

            if (!isset($grouped[$date])) {
                $grouped[$date] = [
                    'label' => $dateLabel,
                    'date' => $date,
                    'messages' => [],
                ];
            }

            $grouped[$date]['messages'][] = [
                'id' => $message->id,
                'message_id' => $message->message_id,
                'sender' => $message->sender['name'] ?? $message->sender['email'] ?? 'Unknown',
                'sender_email' => $message->sender['email'] ?? '',
                'subject' => $message->ai_analysis['subject'] ?? $message->metadata['subject'] ?? 'No subject',
                'summary' => $message->ai_analysis['summary'] ?? '',
                'recommendation' => $message->ai_analysis['recommendation'] ?? '',
                'action_steps' => $message->ai_analysis['action_steps'] ?? [],
                'priority_level' => $message->ai_analysis['priority_level'] ?? 'low',
                'business_potential' => $message->ai_analysis['business_potential'] ?? 1,
                'urgency_score' => $message->ai_analysis['urgency_score'] ?? 1,
                'automation_relevance' => $message->ai_analysis['automation_relevance'] ?? 1,
                'timeline' => $message->ai_analysis['timeline'] ?? 'dugorocno',
                'category' => $message->ai_analysis['category'] ?? 'administrative',
                'gmail_link' => $message->ai_analysis['gmail_link'] ?? '#',
                'timestamp' => $message->message_timestamp->setTimezone(env('USER_TIMEZONE', 'UTC'))->format('H:i'),
                'has_attachments' => $message->attachment_count > 0,
                'attachment_count' => $message->attachment_count,
                'is_unread' => $message->is_unread,
            ];
        }

        // Sort by date descending
        krsort($grouped);

        return array_values($grouped);
    }

    /**
     * Calculate deadline from timeline
     */
    protected function calculateDeadline(string $timeline): string
    {
        return match ($timeline) {
            'hitno' => 'do ' . Carbon::now()->setTimezone(env('USER_TIMEZONE', 'UTC'))->addHours(4)->format('H:i'),
            'ova_nedelja' => 'do kraja nedelje',
            'ovaj_mesec' => 'do kraja meseca',
            'dugorocno' => 'nema deadline',
            default => $timeline,
        };
    }

    /**
     * Analyze a single message by message_id
     * GET /api/communication/ai-message/{message_id}
     */
    public function analyzeSingleMessage(Request $request, string $messageId)
    {
        $forceReprocess = filter_var($request->input('reprocess', false), FILTER_VALIDATE_BOOLEAN);

        try {
            // Find a message by message_id
            $message = MessagingMessage::with(['thread', 'attachments'])
                ->where('message_id', $messageId)
                ->first();

            if (!$message) {
//                if ($request->wantsJson()) {
//                    return response()->json([
//                        'success' => false,
//                        'error' => 'Message not found'
//                    ], 404);
//                }
                return view('communication.single-message', [
                    'error' => 'Message not found',
                    'message' => null,
                ]);
            }

            // Check if processing is needed
            $needsProcessing = $forceReprocess ||
                $message->ai_status === 'pending' ||
                $message->ai_status === 'failed' ||
                empty($message->ai_analysis);

            if ($needsProcessing) {
                $this->aiProcessor->processSingleMessage($message, $forceReprocess);
                $message->refresh();
            }

            // Return JSON or view
//            if ($request->wantsJson()) {
//                return response()->json([
//                    'success' => true,
//                    'data' => [
//                        'id' => $message->id,
//                        'message_id' => $message->message_id,
//                        'subject' => $message->metadata['subject'] ?? '',
//                        'sender' => $message->sender,
//                        'content_text' => $message->content_text,
//                        'ai_analysis' => $message->ai_analysis,
//                        'ai_status' => $message->ai_status,
//                        'timestamp' => $message->message_timestamp->toIso8601String(),
//                    ],
//                ]);
//            }

            // Prepare data for view
            $messageData = [
                'id' => $message->id,
                'message_id' => $message->message_id,
                'sender' => $message->sender['name'] ?? $message->sender['email'] ?? 'Unknown',
                'sender_email' => $message->sender['email'] ?? '',
                'subject' => $message->ai_analysis['subject'] ?? $message->metadata['subject'] ?? 'No subject',
                'summary' => $message->ai_analysis['summary'] ?? '',
                'recommendation' => $message->ai_analysis['recommendation'] ?? '',
                'action_steps' => $message->ai_analysis['action_steps'] ?? [],
                'priority_level' => $message->ai_analysis['priority_level'] ?? 'low',
                'business_potential' => $message->ai_analysis['business_potential'] ?? 1,
                'urgency_score' => $message->ai_analysis['urgency_score'] ?? 1,
                'automation_relevance' => $message->ai_analysis['automation_relevance'] ?? 1,
                'timeline' => $message->ai_analysis['timeline'] ?? 'dugorocno',
                'category' => $message->ai_analysis['category'] ?? 'administrative',
                'gmail_link' => $message->ai_analysis['gmail_link'] ?? '#',
                'timestamp' => $message->message_timestamp->setTimezone(env('USER_TIMEZONE', 'UTC'))->format('d.m.Y H:i'),
                'has_attachments' => $message->attachment_count > 0,
                'attachment_count' => $message->attachment_count,
                'is_unread' => $message->is_unread,
                'ai_status' => $message->ai_status,
                'content_text' => $message->content_text ?? '',
            ];

            return view('communication.single-message', [
                'message' => $messageData,
                'error' => null,
            ]);

        } catch (\Exception $e) {
            Log::error('Single message analysis failed', [
                'message_id' => $messageId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

//            if ($request->wantsJson()) {
//                return response()->json([
//                    'success' => false,
//                    'error' => $e->getMessage()
//                ], 500);
//            }

            return view('communication.single-message', [
                'error' => $e->getMessage(),
                'message' => null,
            ]);
        }
    }

    /**
     * API endpoint for AI analysis (JSON response)
     * GET /api/communication/ai-analysis
     */
    // public function aiAnalysis(Request $request): JsonResponse
    // {
    //     $daysBack = $request->input('days', 1);
    //     $forceReprocess = $request->input('reprocess', false);

    //     try {
    //         $startDate = Carbon::now()->subDays($daysBack)->startOfDay();

    //         $messages = MessagingMessage::with(['thread', 'attachments'])
    //             ->where('message_timestamp', '>=', $startDate)
    //             ->orderBy('message_timestamp', 'desc')
    //             ->get();

    //         $messagesToProcess = $messages->filter(function ($message) use ($forceReprocess) {
    //             if ($forceReprocess) return true;
    //             return $message->ai_status === 'pending' ||
    //                 $message->ai_status === 'failed' ||
    //                 empty($message->ai_analysis);
    //         });

    //         if ($messagesToProcess->count() > 0) {
    //             Log::info('Processing messages with AI', [
    //                 'total_messages' => $messages->count(),
    //                 'to_process' => $messagesToProcess->count(),
    //                 'days_back' => $daysBack
    //             ]);

    //             $this->aiProcessor->processBatch($messagesToProcess, $forceReprocess);
    //         }

    //         // Refresh and return
    //         $messages = MessagingMessage::with(['thread', 'attachments'])
    //             ->where('message_timestamp', '>=', $startDate)
    //             ->where('ai_status', 'completed')
    //             ->orderBy('message_timestamp', 'desc')
    //             ->get();

    //         return response()->json([
    //             'success' => true,
    //             'data' => $messages->map(fn($m) => [
    //                 'id' => $m->id,
    //                 'message_id' => $m->message_id,
    //                 'subject' => $m->metadata['subject'] ?? '',
    //                 'ai_analysis' => $m->ai_analysis,
    //                 'timestamp' => $m->message_timestamp->toIso8601String(),
    //             ]),
    //             'meta' => [
    //                 'total_messages' => $messages->count(),
    //                 'days_back' => $daysBack,
    //             ]
    //         ]);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

}
