<?php

namespace App\Http\Controllers;

use App\Services\AI\ModelRouterService;
use Illuminate\Http\JsonResponse;

class AIMonitoringController extends Controller
{
    public function usage(ModelRouterService $router): JsonResponse
    {
        // Standardized response per SRS 12.2
        return response()->json([
            'success' => true,
            'data' => $router->getUsageStats(),
            'message' => 'AI usage statistics retrieved successfully'
        ]);
    }
}
