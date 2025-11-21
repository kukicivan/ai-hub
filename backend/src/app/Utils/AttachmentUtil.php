<?php

namespace App\Utils;

use Illuminate\Support\Str;

class AttachmentUtil
{
    public static function formatFileSize(int $bytes): string
    {
        if ($bytes === 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $power = floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);

        $size = $bytes / pow(1024, $power);

        return round($size, 2) . ' ' . $units[$power];
    }

    public static function getFileExtension(string $filename): string
    {
        return strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    }

    public static function isImage(string $mimeType): bool
    {
        $imageMimeTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
            'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'
        ];

        return in_array($mimeType, $imageMimeTypes, true);
    }

    public static function isDocument(string $mimeType): bool
    {
        $documentMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text',
            'text/plain',
            'application/rtf'
        ];

        return in_array($mimeType, $documentMimeTypes, true);
    }

    public static function isSpreadsheet(string $mimeType): bool
    {
        $spreadsheetMimeTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.oasis.opendocument.spreadsheet',
            'text/csv'
        ];

        return in_array($mimeType, $spreadsheetMimeTypes, true);
    }

    public static function isPresentation(string $mimeType): bool
    {
        $presentationMimeTypes = [
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.oasis.opendocument.presentation'
        ];

        return in_array($mimeType, $presentationMimeTypes, true);
    }

    public static function isArchive(string $mimeType): bool
    {
        $archiveMimeTypes = [
            'application/zip', 'application/x-zip-compressed',
            'application/x-rar-compressed', 'application/x-7z-compressed',
            'application/gzip', 'application/x-tar'
        ];

        return in_array($mimeType, $archiveMimeTypes, true);
    }

    public static function isVideo(string $mimeType): bool
    {
        return Str::startsWith($mimeType, 'video/');
    }

    public static function isAudio(string $mimeType): bool
    {
        return Str::startsWith($mimeType, 'audio/');
    }

    public static function isCode(string $filename): bool
    {
        $codeExtensions = [
            'js', 'jsx', 'ts', 'tsx', 'php', 'py', 'java', 'c', 'cpp',
            'cs', 'go', 'rb', 'swift', 'kt', 'html', 'css', 'scss',
            'json', 'xml', 'yaml', 'yml', 'sql', 'sh', 'bash'
        ];

        return in_array(self::getFileExtension($filename), $codeExtensions, true);
    }

    public static function getFileType(object $attachment): string
    {
        $mime = $attachment->mime_type ?? '';
        $filename = $attachment->filename ?? '';

        if (self::isImage($mime)) return 'image';
        if (self::isDocument($mime)) return 'document';
        if (self::isArchive($mime)) return 'archive';
        if (self::isVideo($mime)) return 'video';
        if (self::isAudio($mime)) return 'audio';
        if (self::isSpreadsheet($mime)) return 'spreadsheet';
        if (self::isPresentation($mime)) return 'presentation';
        if (self::isCode($filename)) return 'code';

        return 'other';
    }

    public static function getFileIcon(object $attachment): string
    {
        $type = self::getFileType($attachment);

        $icons = [
            'image' => 'image',
            'document' => 'file-text',
            'spreadsheet' => 'table',
            'presentation' => 'presentation',
            'archive' => 'archive',
            'video' => 'video',
            'audio' => 'music',
            'code' => 'code',
            'other' => 'file'
        ];

        return $icons[$type] ?? 'file';
    }

    public static function getIconColor(object $attachment): string
    {
        $type = self::getFileType($attachment);

        $colors = [
            'image' => '#10B981',
            'document' => '#3B82F6',
            'spreadsheet' => '#10B981',
            'presentation' => '#F59E0B',
            'archive' => '#8B5CF6',
            'video' => '#EF4444',
            'audio' => '#EC4899',
            'code' => '#6366F1',
            'other' => '#6B7280'
        ];

        return $colors[$type] ?? '#6B7280';
    }

    public static function isSafeFileType(string $filename): bool
    {
        $dangerousExtensions = [
            'exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js',
            'jar', 'msi', 'dll', 'app', 'deb', 'rpm'
        ];

        return !in_array(self::getFileExtension($filename), $dangerousExtensions, true);
    }

    public static function needsVirusScanning(object $attachment): bool
    {
        return !self::isSafeFileType($attachment->filename ?? '') || self::isArchive($attachment->mime_type ?? '');
    }

    public static function isPreviewable(object $attachment): bool
    {
        $mime = $attachment->mime_type ?? '';

        return self::isImage($mime) || $mime === 'application/pdf' || $mime === 'text/plain';
    }

    public static function getDownloadUrl(object $attachment): ?string
    {
        $storage = $attachment->storage_path ?? '';
        $id = $attachment->id ?? null;

        if (empty($storage)) {
            return null;
        }

        if (Str::startsWith($storage, ['http://', 'https://'])) {
            return $storage;
        }

        if ($id) {
            return route('attachments.download', ['attachment' => $id]);
        }

        return null;
    }

    public static function getPreviewUrl(object $attachment): ?string
    {
        if (!self::isPreviewable($attachment)) {
            return null;
        }

        $storage = $attachment->storage_path ?? '';
        $id = $attachment->id ?? null;

        if (empty($storage)) {
            return null;
        }

        if (Str::startsWith($storage, ['http://', 'https://'])) {
            return $storage;
        }

        if ($id) {
            return route('attachments.preview', ['attachment' => $id]);
        }

        return null;
    }
}
