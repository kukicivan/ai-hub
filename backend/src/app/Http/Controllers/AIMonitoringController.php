<?php

namespace App\Http\Controllers;

use App\Services\AI\ModelRouterService;
use Illuminate\Http\JsonResponse;

class AIMonitoringController extends Controller
{
    public function usage(ModelRouterService $router): JsonResponse
    {
        return response()->json($router->getUsageStats());
    }
}
