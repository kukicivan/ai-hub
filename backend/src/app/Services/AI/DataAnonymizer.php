<?php

namespace App\Services\AI;

class DataAnonymizer
{
    private array $emailCache = [];
    private array $nameCache = [];

    public function anonymizeMessage(array $messageData): array
    {
        return [
            'id' => $messageData['id'],
            'sender' => $this->anonymizeEmail($messageData['sender']['email'] ?? 'unknown'),
            'recipients' => $this->anonymizeRecipients($messageData['recipients'] ?? []),
            'subject' => $this->anonymizeText($messageData['metadata']['subject'] ?? ''),
            'content' => $this->anonymizeText($messageData['content']['text'] ?? ''),
            'attachment_count' => $messageData['attachment_count'] ?? 0,
            'timestamp' => $messageData['timestamp'] ?? now()->toIso8601String(),
        ];
    }

    private function anonymizeEmail(string $email): string
    {
        if (isset($this->emailCache[$email])) {
            return $this->emailCache[$email];
        }

        $hash = substr(md5($email), 0, 8);
        $domain = substr(strstr($email, '@'), 1);
        $anonymized = "user_{$hash}@{$this->anonymizeDomain($domain)}";

        $this->emailCache[$email] = $anonymized;
        return $anonymized;
    }

    private function anonymizeDomain(string $domain): string
    {
        // Keep common domains, anonymize custom
        $commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

        if (in_array($domain, $commonDomains)) {
            return $domain;
        }

        return 'company_' . substr(md5($domain), 0, 6) . '.com';
    }

    private function anonymizeRecipients(array $recipients): array
    {
        $anonymized = [];

        foreach (['to', 'cc', 'bcc'] as $type) {
            if (isset($recipients[$type])) {
                $anonymized[$type] = array_map(
                    fn($r) => $this->anonymizeEmail($r['email'] ?? $r),
                    is_array($recipients[$type]) ? $recipients[$type] : []
                );
            }
        }

        return $anonymized;
    }

    private function anonymizeText(string $text): string
    {
        // Remove emails
        $text = preg_replace('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', '[EMAIL]', $text);

        // Remove phone numbers (various formats)
        $text = preg_replace('/\+?[0-9]{1,4}?[-.\s]?\(?[0-9]{1,3}?\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}/', '[PHONE]', $text);

        // Remove URLs
        $text = preg_replace('/https?:\/\/[^\s]+/', '[URL]', $text);

        // Remove potential names (capitalized words, but keep common words)
        $text = $this->anonymizeNames($text);

        return $text;
    }

    private function anonymizeNames(string $text): string
    {
        // Common words to preserve
        $preserveWords = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December', 'Dear', 'Hi', 'Hello', 'Thanks'];

        $words = explode(' ', $text);
        $result = [];

        foreach ($words as $word) {
            // Skip if it's a common word or not capitalized
            if (in_array($word, $preserveWords) || !preg_match('/^[A-Z][a-z]+$/', $word)) {
                $result[] = $word;
                continue;
            }

            // Cache names
            if (isset($this->nameCache[$word])) {
                $result[] = $this->nameCache[$word];
            } else {
                $replacement = 'Person_' . substr(md5($word), 0, 4);
                $this->nameCache[$word] = $replacement;
                $result[] = $replacement;
            }
        }

        return implode(' ', $result);
    }
}
