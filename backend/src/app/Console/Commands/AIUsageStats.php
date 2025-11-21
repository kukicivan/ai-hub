<?php

namespace App\Console\Commands;

use App\Services\AI\ModelRouterService;
use Illuminate\Console\Command;

class AIUsageStats extends Command
{
    protected $signature = 'ai:stats';
    protected $description = 'Display AI model usage statistics';

    public function handle(ModelRouterService $router)
    {
        $stats = $router->getUsageStats();

        $this->info("AI Model Usage Statistics - " . date('Y-m-d H:i:s'));
        $this->newLine();

        // Model stats
        $headers = ['Model', 'Provider', 'Used', 'Limit', 'Available', '%', 'Status'];
        $rows = [];

        foreach ($stats['models'] as $model) {
            $rows[] = [
                $model['model'],
                $model['provider'],
                number_format($model['used']),
                $model['limit'] === PHP_INT_MAX ? '∞' : number_format($model['limit']),
                number_format($model['available']),
                $model['percentage'] . '%',
                $this->colorStatus($model['status']),
            ];
        }

        $this->table($headers, $rows);

        // Summary
        $this->newLine();
        $this->info("Summary:");
        $this->line("Total Used: " . number_format($stats['summary']['total_used']));
        $this->line("Total Available: " . number_format($stats['summary']['total_available']));
        $this->line("Overall Usage: " . $stats['summary']['overall_percentage'] . '%');

        return 0;
    }

    protected function colorStatus(string $status): string
    {
        return match($status) {
            'healthy' => "<fg=green>$status</>",
            'medium' => "<fg=yellow>$status</>",
            'low' => "<fg=yellow>$status</>",
            'exhausted' => "<fg=red>$status</>",
            'paid' => "<fg=cyan>$status</>",
            default => $status,
        };
    }
}
