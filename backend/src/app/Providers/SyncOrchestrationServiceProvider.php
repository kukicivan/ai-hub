<?php

namespace App\Providers;

use App\Services\AI\AiMessageProcessor;
use App\Services\AI\AiResponseNormalizer;
use App\Services\AI\DataAnonymizer;
use App\Services\AI\EmailAnalyzerService;
use App\Services\AI\GoalBasedPromptBuilder;
use App\Services\AI\ModelRouterService;
use App\Services\AI\TokenEstimator;
use App\Services\Messaging\MessageService;
use App\Services\Messaging\MessagePersistenceService;
use App\Services\Messaging\MessageSyncService;
use App\Services\Orchestration\SyncOrchestratorService;
use Illuminate\Support\ServiceProvider;

/**
 * Service Provider for Sync Orchestration
 * Registers all services needed for message sync and AI processing
 */
class SyncOrchestrationServiceProvider extends ServiceProvider
{
    /**
     * Register services
     */
    public function register(): void
    {
        // Core Messaging Services
        $this->registerMessagingServices();

        // AI Services
        $this->registerAiServices();

        // Orchestrator Service (depends on both)
        $this->registerOrchestratorService();

        // Merge config
        $this->mergeConfigFrom(
            __DIR__.'/../../config/messaging.php', 'messaging'
        );
    }

    /**
     * Register messaging services
     */
    protected function registerMessagingServices(): void
    {
        // MessageService - adapter registry
        $this->app->singleton(MessageService::class, function ($app) {
            return new MessageService();
        });

        // MessagePersistenceService - database operations
        $this->app->singleton(MessagePersistenceService::class, function ($app) {
            return new MessagePersistenceService();
        });

        // MessageSyncService - Gmail sync
        $this->app->singleton(MessageSyncService::class, function ($app) {
            return new MessageSyncService(
                $app->make(MessageService::class),
                $app->make(MessagePersistenceService::class),
                $app->make(AiMessageProcessor::class)
            );
        });
    }

    /**
     * Register AI services
     */
    protected function registerAiServices(): void
    {
        // AiResponseNormalizer - normalize AI responses
        $this->app->singleton(AiResponseNormalizer::class, function ($app) {
            return new AiResponseNormalizer();
        });

        // TokenEstimator - token calculation
        $this->app->singleton(TokenEstimator::class, function ($app) {
            return new TokenEstimator();
        });

        // ModelRouterService - AI model rotation
        $this->app->singleton(ModelRouterService::class, function ($app) {
            return new ModelRouterService(
                $app->make(TokenEstimator::class)
            );
        });

        // GoalBasedPromptBuilder - prompt generation
        $this->app->singleton(GoalBasedPromptBuilder::class, function ($app) {
            return new GoalBasedPromptBuilder();
        });

        // DataAnonymizer - data privacy
        $this->app->singleton(DataAnonymizer::class, function ($app) {
            return new DataAnonymizer();
        });

        // EmailAnalyzerService - AI analysis orchestration
        $this->app->singleton(EmailAnalyzerService::class, function ($app) {
            return new EmailAnalyzerService(
                $app->make(ModelRouterService::class),
                $app->make(GoalBasedPromptBuilder::class),
                $app->make(DataAnonymizer::class),
                $app->make(AiResponseNormalizer::class)
            );
        });

        // AiMessageProcessor - message processing
        $this->app->singleton(AiMessageProcessor::class, function ($app) {
            return new AiMessageProcessor(
                $app->make(EmailAnalyzerService::class)
            );
        });
    }

    /**
     * Register orchestrator service
     */
    protected function registerOrchestratorService(): void
    {
        $this->app->singleton(SyncOrchestratorService::class, function ($app) {
            return new SyncOrchestratorService(
                $app->make(MessageSyncService::class),
                $app->make(AiMessageProcessor::class)
            );
        });
    }

    /**
     * Bootstrap services
     */
    public function boot(): void
    {
        // Load migrations
        $this->loadMigrationsFrom(__DIR__.'/../../database/migrations');

        // Publish config
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../../config/messaging.php' => config_path('messaging.php'),
            ], 'sync-config');
        }
    }

    /**
     * Get the services provided by the provider
     */
    public function provides(): array
    {
        return [
            // Core Services
            MessageService::class,
            MessagePersistenceService::class,
            MessageSyncService::class,

            // AI Services
            AiResponseNormalizer::class,
            TokenEstimator::class,
            ModelRouterService::class,
            GoalBasedPromptBuilder::class,
            DataAnonymizer::class,
            EmailAnalyzerService::class,
            AiMessageProcessor::class,

            // Orchestrator
            SyncOrchestratorService::class,
        ];
    }
}
