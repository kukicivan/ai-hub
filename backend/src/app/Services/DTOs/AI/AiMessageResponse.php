<?php

namespace App\Services\DTOs\AI;

/**
 * Data Transfer Object for AI message analysis response
 * Standardized structure for AI analysis results with validation
 */
class AiMessageResponse
{
    public function __construct(
        public readonly string $id,
        public readonly string $sender,
        public readonly string $subject,
        public readonly array $htmlAnalysis,
        public readonly array $classification,
        public readonly array $sentiment,
        public readonly array $recommendation,
        public readonly array $actionSteps,
        public readonly string $summary,
        public readonly string $gmailLink,
    ) {}

    /**
     * Create from an AI API response array with validation
     */
    public static function fromArray(array $data): self
    {
        // Validate required fields
        self::validate($data);

        return new self(
            id: $data['id'],
            sender: $data['sender'],
            subject: $data['subject'],
            htmlAnalysis: $data['html_analysis'] ?? [],
            classification: $data['classification'] ?? [],
            sentiment: $data['sentiment'] ?? [],
            recommendation: $data['recommendation'] ?? [],
            actionSteps: $data['action_steps'] ?? [],
            summary: $data['summary'] ?? '',
            gmailLink: $data['gmail_link'] ?? '',
        );
    }

    /**
     * Validate AI response data structure
     */
    protected static function validate(array $data): void
    {
        $required = ['id', 'sender', 'subject'];

        foreach ($required as $field) {
            if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
                throw new \InvalidArgumentException("Missing or empty required field: {$field}");
            }
        }

        // Validate html_analysis structure if present
        if (isset($data['html_analysis'])) {
            if (!is_array($data['html_analysis'])) {
                throw new \InvalidArgumentException("html_analysis must be an array");
            }
        }

        // Validate classification structure if present
        if (isset($data['classification'])) {
            if (!is_array($data['classification'])) {
                throw new \InvalidArgumentException("classification must be an array");
            }
            if (isset($data['classification']['confidence_score'])) {
                $score = $data['classification']['confidence_score'];
                if (!is_numeric($score) || $score < 0 || $score > 1) {
                    throw new \InvalidArgumentException("confidence_score must be between 0 and 1");
                }
            }
        }

        // Validate sentiment structure if present
        if (isset($data['sentiment'])) {
            if (!is_array($data['sentiment'])) {
                throw new \InvalidArgumentException("sentiment must be an array");
            }
            if (isset($data['sentiment']['urgency_score'])) {
                $score = $data['sentiment']['urgency_score'];
                if (!is_numeric($score) || $score < 1 || $score > 10) {
                    throw new \InvalidArgumentException("urgency_score must be between 1 and 10");
                }
            }
            if (isset($data['sentiment']['business_potential'])) {
                $score = $data['sentiment']['business_potential'];
                if (!is_numeric($score) || $score < 1 || $score > 10) {
                    throw new \InvalidArgumentException("business_potential must be between 1 and 10");
                }
            }
        }

        // Validate recommendation structure if present
        if (isset($data['recommendation'])) {
            if (!is_array($data['recommendation'])) {
                throw new \InvalidArgumentException("recommendation must be an array");
            }
            $validPriorities = ['low', 'medium', 'high'];
            if (isset($data['recommendation']['priority_level']) &&
                !in_array($data['recommendation']['priority_level'], $validPriorities)) {
                throw new \InvalidArgumentException("priority_level must be one of: " . implode(', ', $validPriorities));
            }
        }

        // Validate action_steps structure if present
        if (isset($data['action_steps'])) {
            if (!is_array($data['action_steps'])) {
                throw new \InvalidArgumentException("action_steps must be an array");
            }
            foreach ($data['action_steps'] as $step) {
                if (!is_array($step)) {
                    throw new \InvalidArgumentException("Each action step must be an array");
                }
                if (isset($step['timeline'])) {
                    $validTimelines = ['hitno', 'ova_nedelja', 'ovaj_mesec', 'dugorocno', 'nema_deadline'];
                    if (!in_array($step['timeline'], $validTimelines)) {
                        throw new \InvalidArgumentException("timeline must be one of: " . implode(', ', $validTimelines));
                    }
                }
            }
        }
    }

    /**
     * Convert to array format for database storage
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'sender' => $this->sender,
            'subject' => $this->subject,
            'html_analysis' => $this->htmlAnalysis,
            'classification' => $this->classification,
            'sentiment' => $this->sentiment,
            'recommendation' => $this->recommendation,
            'action_steps' => $this->actionSteps,
            'summary' => $this->summary,
            'gmail_link' => $this->gmailLink,
        ];
    }

    /**
     * Convert array of AI responses to DTOs
     */
    public static function fromArrayBatch(array $dataArray): array
    {
        return array_map(fn($data) => self::fromArray($data), $dataArray);
    }
}
