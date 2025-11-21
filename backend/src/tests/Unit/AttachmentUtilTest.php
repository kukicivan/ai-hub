<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Utils\AttachmentUtil;

class AttachmentUtilTest extends TestCase
{
    public function test_formatFileSize_zero()
    {
        $this->assertEquals('0 B', AttachmentUtil::formatFileSize(0));
    }

    public function test_formatFileSize_various()
    {
        $this->assertEquals('500 B', AttachmentUtil::formatFileSize(500));
        $this->assertEquals('1 KB', AttachmentUtil::formatFileSize(1024));
        $this->assertEquals('1.5 KB', AttachmentUtil::formatFileSize(1536));
        $this->assertEquals('1 MB', AttachmentUtil::formatFileSize(1048576));
    }

    public function test_getFileExtension()
    {
        $this->assertEquals('txt', AttachmentUtil::getFileExtension('file.TXT'));
    // pathinfo treats a leading-dot filename as having an extension equal to the rest of the name
    $this->assertEquals('hiddenfile', AttachmentUtil::getFileExtension('.hiddenfile'));
    }

    public function test_isCode_and_isSafeFileType()
    {
        $this->assertTrue(AttachmentUtil::isCode('script.js'));
        $this->assertFalse(AttachmentUtil::isCode('image.png'));
        $this->assertFalse(AttachmentUtil::isSafeFileType('malware.exe'));
        $this->assertTrue(AttachmentUtil::isSafeFileType('document.pdf'));
    }
}
