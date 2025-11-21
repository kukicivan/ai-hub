<?php

namespace App\Services\AI;

use Exception;

/**
 * Normalizes AI responses to a consistent array format
 * Handles various response structures: single objects, arrays, wrapped responses
 */
class AiResponseNormalizer
{
    /**
     * Normalize AI response to an array of items
     *
     * @param string $jsonContent Raw JSON string from AI
     * @return array Normalized array of items
     * @throws Exception If JSON is invalid
     */
    public function normalize(string $jsonContent): array
    {
        // Clean Markdown code blocks
        $content = preg_replace('/```json\s*/i', '', $jsonContent);
        $content = preg_replace('/```\s*/i', '', $content);

        // Extract JSON from mixed text+JSON responses
        // Handle cases where AI adds explanatory text before/after the JSON
        $content = $this->extractJsonFromText($content);

        $parsed = json_decode(trim($content), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON from AI: ' . json_last_error_msg());
        }

        return $this->normalizeStructure($parsed);
    }

    /**
     * Extract JSON content from text that may contain explanatory text
     * Handles AI responses that include text before/after the actual JSON
     *
     * @param string $content Raw content from AI
     * @return string Extracted JSON string
     */
    private function extractJsonFromText(string $content): string
    {
        // Try to find JSON array or object boundaries
        // Look for the first [ or { and the last ] or }

        $firstBracket = strpos($content, '[');
        $firstBrace = strpos($content, '{');

        // Determine which comes first
        $startPos = false;
        $endChar = '';

        if ($firstBracket !== false && ($firstBrace === false || $firstBracket < $firstBrace)) {
            $startPos = $firstBracket;
            $endChar = ']';
        } elseif ($firstBrace !== false) {
            $startPos = $firstBrace;
            $endChar = '}';
        }

        if ($startPos === false) {
            return $content; // No JSON structure found, return as-is
        }

        // Find the last occurrence of the closing character
        $endPos = strrpos($content, $endChar);

        if ($endPos === false || $endPos <= $startPos) {
            return $content; // Invalid structure, return as-is
        }

        // Extract the JSON portion
        $extracted = substr($content, $startPos, $endPos - $startPos + 1);

        return $extracted;
    }

    /**
     * Normalize the parsed structure to an array of items
     *
     * @param mixed $parsed Parsed JSON data
     * @return array Normalized array of items
     */
    private function normalizeStructure(mixed $parsed): array
    {
        $normalizedItems = [];

        if (!is_array($parsed)) {
            return $normalizedItems;
        }

        // Case 1: Check for wrapped lists under common keys
        $normalizedItems = $this->extractFromWrapperKeys($parsed);
        if (!empty($normalizedItems)) {
            return $normalizedItems;
        }

        // Case 2: Direct single object with 'id' field
        if (isset($parsed['id'])) {
            return [$parsed];
        }

        // Case 3: Direct indexed array of objects
        if (function_exists('array_is_list') && array_is_list($parsed)) {
            return $this->extractArrayItems($parsed);
        }

        // Case 4: Fallback - unwrap single array value
        $normalizedItems = $this->extractSingleArrayValue($parsed);
        if (!empty($normalizedItems)) {
            return $normalizedItems;
        }

        return [];
    }

    /**
     * Extract items from common wrapper keys
     */
    private function extractFromWrapperKeys(array $parsed): array
    {
        $items = [];
        $wrapperKeys = ['emails', 'data', 'results', 'items'];

        foreach ($wrapperKeys as $key) {
            if (isset($parsed[$key]) && is_array($parsed[$key])) {
                foreach ($parsed[$key] as $item) {
                    if (is_array($item)) {
                        $items[] = $item;
                    }
                }
            }
        }

        return $items;
    }

    /**
     * Extract items from an indexed array
     */
    private function extractArrayItems(array $parsed): array
    {
        $items = [];

        foreach ($parsed as $item) {
            if (is_array($item)) {
                $items[] = $item;
            }
        }

        return $items;
    }

    /**
     * Fallback: extract from a single array value
     */
    private function extractSingleArrayValue(array $parsed): array
    {
        $onlyArrayValues = array_values(array_filter($parsed, 'is_array'));

        if (count($onlyArrayValues) === 1 && is_array($onlyArrayValues[0])) {
            return $this->extractArrayItems($onlyArrayValues[0]);
        }

        return [];
    }
}
