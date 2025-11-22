<?php

namespace App\Http\Controllers;

use App\Services\Orchestration\SyncOrchestratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SyncOrchestratorController extends Controller
{
    public function __construct(
        protected SyncOrchestratorService $orchestrator
    ) {}

    /**
     * POST /api/sync/mail
     * Sync messages only
     */
    public function syncMail(): JsonResponse
    {
        if ($this->orchestrator->isSyncInProgress(SyncOrchestratorService::LOCK_MESSAGES)) {
            return response()->json([
                'success' => false,
                'status' => 'already_running',
                'message' => 'Message sync is already in progress'
            ], 409);
        }

        $result = $this->orchestrator->syncMessagesOnly();

        return response()->json($result, $result['success'] ? 200 : 500);
    }

    /**
     * POST /api/sync/ai
     * Process AI only
     */
    public function syncAi(Request $request): JsonResponse
    {
        if ($this->orchestrator->isSyncInProgress(SyncOrchestratorService::LOCK_AI)) {
            return response()->json([
                'success' => false,
                'status' => 'already_running',
                'message' => 'AI processing is already in progress'
            ], 409);
        }

        $limit = $request->input('limit', 50);

        $result = $this->orchestrator->processAiOnly($limit);

        return response()->json($result, $result['success'] ? 200 : 500);
    }

    /**
     * POST /api/sync/ai/{id}
     * Process single message with AI by ID
     */
    public function syncAiById(int $id, Request $request): JsonResponse
    {
        $forceReprocess = filter_var($request->input('force', false), FILTER_VALIDATE_BOOLEAN);

        $result = $this->orchestrator->processSingleMessageById($id, $forceReprocess);

        return response()->json($result, $result['success'] ? 200 : 404);
    }

    /**
     * GET /api/sync/status
     * Get sync status by key
     */
    public function status(Request $request): JsonResponse
    {
        $key = $request->input('key', 'messages'); // 'messages' or 'ai'

        $lockKey = $key === 'ai'
            ? SyncOrchestratorService::LOCK_AI
            : SyncOrchestratorService::LOCK_MESSAGES;

        $status = $this->orchestrator->getSyncStatus($lockKey);

        // Standardized response per SRS 12.2
        return response()->json([
            'success' => true,
            'data' => [
                'key' => $key,
                'status' => $status
            ],
            'message' => 'Sync status retrieved successfully'
        ]);
    }

    /**
     * POST /api/sync/cancel
     * Force cancel sync by key
     */
    public function cancel(Request $request): JsonResponse
    {
        $key = $request->input('key', 'messages'); // 'messages' or 'ai'

        $lockKey = $key === 'ai'
            ? SyncOrchestratorService::LOCK_AI
            : SyncOrchestratorService::LOCK_MESSAGES;

        $this->orchestrator->forceReleaseLock($lockKey);

        // Standardized response per SRS 12.2
        return response()->json([
            'success' => true,
            'data' => ['key' => $key],
            'message' => ucfirst($key) . ' sync cancelled'
        ]);
    }
}
