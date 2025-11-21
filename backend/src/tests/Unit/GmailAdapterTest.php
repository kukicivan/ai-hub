<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\Messaging\Adapters\GmailAdapter;
use Carbon\Carbon;

class GmailAdapterTest extends TestCase
{
    public function test_constructor_requires_app_script_url()
    {
        $this->expectException(\InvalidArgumentException::class);
        new GmailAdapter([]);
    }

    public function test_getters_and_connection()
    {
        $adapter = new GmailAdapter(['app_script_url' => 'https://example.com/script', 'api_key' => 'k']);

        $this->assertEquals('gmail-primary', $adapter->getChannelType());
        $this->assertEquals('gmail-primary', $adapter->getChannelId());
        $this->assertFalse($adapter->isConnected());

        $this->assertTrue($adapter->connect());
        $this->assertTrue($adapter->isConnected());

        $adapter->disconnect();
        $this->assertFalse($adapter->isConnected());
    }

    public function test_validateConfiguration()
    {
        $good = new GmailAdapter(['app_script_url' => 'https://example.com/script']);
        $this->assertTrue($good->validateConfiguration());

        $bad = new GmailAdapter(['app_script_url' => 'not-a-url']);
        $this->assertFalse($bad->validateConfiguration());
    }

    public function test_methods_when_not_connected()
    {
        $adapter = new GmailAdapter(['app_script_url' => 'https://example.com/script']);

        $this->assertNull($adapter->getThread('t1'));
        $this->assertFalse($adapter->markAsRead('t1'));
        $this->assertFalse($adapter->markAsUnread('t1'));
    }

    public function test_getHealthStatus_reports_connected()
    {
        $adapter = new GmailAdapter(['app_script_url' => 'https://example.com/script']);
        $status = $adapter->getHealthStatus();

        $this->assertEquals('healthy', $status['status']);
        $this->assertTrue($status['connected']);
        $this->assertArrayHasKey('appScriptUrl', $status);
    }
}
