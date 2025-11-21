<?php

namespace Tests\Unit;

use App\Services\DTOs\Messaging\Participant;
use PHPUnit\Framework\TestCase;

class ParticipantTest extends TestCase
{
    public function test_create_and_toArray()
    {
        $p = Participant::create(['id' => 'u1', 'name' => 'Alice', 'email' => 'alice@example.com']);

        $this->assertEquals('u1', $p->id);
        $this->assertEquals('Alice', $p->name);
        $this->assertTrue($p->hasEmail());
        $this->assertEquals('"Alice" <alice@example.com>', $p->toEmailString());
        $this->assertEquals('Alice', $p->getDisplayName());
        $this->assertEquals('AL', $p->getInitials());
        $this->assertFalse($p->isPrivileged());
    }

    public function test_fromEmailString_and_privileged()
    {
        $p = Participant::fromEmailString('Bob <bob@example.com>');
        $this->assertEquals('bob@example.com', $p->id);
        $this->assertEquals('Bob', $p->name);

        $p2 = Participant::create(['id' => 'admin1', 'name' => 'Admin', 'role' => 'admin']);
        $this->assertTrue($p2->isPrivileged());
    }
}
