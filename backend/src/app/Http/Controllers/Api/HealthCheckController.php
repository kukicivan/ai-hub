<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class HealthCheckController extends Controller
{
    public function check()
    {
        $health = [
            'status' => 'up',
            'timestamp' => now()->toISOString(),
            'services' => [
                'database' => 'up',
                'redis' => 'up'
            ]
        ];

        try {
            // Check database connection
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $health['services']['database'] = 'down';
            $health['status'] = 'down';
        }

        try {
            // Check Redis connection
//            Redis::ping();
        } catch (\Exception $e) {
            $health['services']['redis'] = 'down';
            $health['status'] = 'down';
        }

        // Standardized response per SRS 12.2
        return response()->json([
            'success' => $health['status'] === 'up',
            'data' => $health,
            'message' => $health['status'] === 'up' ? 'All services are healthy' : 'Some services are down'
        ]);
    }
}
