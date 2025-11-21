<?php

namespace App\Interfaces;

use Carbon\Carbon;

interface MessageAdapterInterface
{
    public function connect(): bool;

    public function disconnect(): void;

    public function isConnected(): bool;

    public function receiveMessages(?Carbon $since = null, int $limit = 50): array;

    public function receiveMessagesViaHistory(string $historyId): array;

    public function validateConfiguration(): bool;

    public function getChannelType(): string;

    public function getChannelId(): string;

    public function getLastSync(): ?Carbon;

    public function getHealthStatus(): array;
}
