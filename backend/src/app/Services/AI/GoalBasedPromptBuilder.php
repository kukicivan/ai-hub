<?php

namespace App\Services\AI;

// Future imports when models are created
// use App\Models\UserGoal;
// use App\Models\EmailCategory;
// use App\Models\KeywordMapping;

use Exception;

class GoalBasedPromptBuilder
{
    /**
     * Build email analysis prompt with 5-service architecture
     *
     * @param array $emails Emails to analyze
     * @param int|string|null $userId User identifier (for future DB lookup)
     * @param array|null $userGoals Optional user goals override
     * @return string Complete AI prompt
     * @throws Exception
     */
    public function buildEmailAnalysisPrompt(array $emails, int|string $userId = null, ?array $userGoals = null): string
    {
        // Load from database or use dummy data
        $goals = $userGoals ?? $this->getUserGoals($userId);
        $categories = $this->getCategories($userId);
        $keywordMapping = $this->getKeywordMapping($userId);

        $goalsSection = $this->formatGoalsSection($goals);
        $categoriesSection = $this->formatCategoriesSection($categories);

        $emailsJson = json_encode($emails, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('JSON encoding failed: ' . json_last_error_msg());
        }

        $prompt = <<<PROMPT
═══════════════════════════════════════════════════════════════
🤖 AI EMAIL ORCHESTRATOR - 5 SERVISA
═══════════════════════════════════════════════════════════════
Ti si AI Email Orchestrator - sistem koji analizira emailove kroz 5 servisa i vraća actionable output.

═══════════════════════════════════════════════════════════════
🎯 KORISNIČKI KONTEKST
═══════════════════════════════════════════════════════════════
{$goalsSection}

PRIORITETI: automation_opportunity > business_inquiry > networking > marketing > spam

═══════════════════════════════════════════════════════════════
📋 KATEGORIJE
═══════════════════════════════════════════════════════════════
{$categoriesSection}

═══════════════════════════════════════════════════════════════
⚙️ SERVISI (izvršavaju se sekvencijalno)
═══════════════════════════════════════════════════════════════

🔧 SERVIS 1: HTML CLEANUP
Input: Raw HTML email
Output: Cleaned text, structure extraction
ZADATAK:
- Ukloni CSS, skripte, nepotrebne tagove
- Ekstraktuj H1-H6, bold, liste, linkove
- Detektuj newsletter (>5 slika, unsubscribe link, bulk headers)
- Označi urgentne markere (URGENT, ASAP, DEADLINE)
TOKEN OPTIMIZATION: 60-80% redukcija

🏷️ SERVIS 2: CLASSIFICATION
Input: Cleaned text + sender domain
Output: Category, confidence
KEYWORD MAPPING:
HIGH: automatizacija, integration, AI, workflow, consulting, B2B, projekat, outsourcing, digitalizacija, partnership
MEDIUM: networking, collaboration, startup, conference, learning, innovation
LOW: newsletter, promotion, unsubscribe, update, notification

SUBCATEGORIES:
- automation_opportunity: workflow_automation | ai_ml_project | digital_transformation
- business_inquiry: project_proposal | partnership | consulting_request
- networking: event | community | collaboration
- marketing: newsletter | promotion | announcement
- financial: invoice | payment | billing

🎭 SERVIS 3: SENTIMENT & URGENCY
Input: Cleaned text
Output: Urgency (1-10), tone, business_potential
URGENCY:
9-10: URGENT, ASAP, today, hitno
7-8: this week, time-sensitive, ova nedelja
5-6: when you can, ovaj mesec
3-4: eventually, someday, dugoročno
1-2: no time indicators, nema_deadline

BUSINESS INDICATORS:
+2: budget mentioned
+2: timeline mentioned
+2: specific use case
+2: decision maker kontakt
+1: referral
+1: konkretna potreba

TONE: professional | casual | urgent | formal | promotional

💡 SERVIS 4: RECOMMENDATIONS
Input: Classification + Sentiment + User Goals
Output: Priority (low/medium/high), recommendation, ROI
LOGIKA:
IF automation_opportunity AND urgency >= 7 → HIGH priority
IF business_inquiry AND business_potential >= 6 → HIGH
IF networking AND urgency <= 5 → MEDIUM
IF newsletter OR marketing → LOW
PERSONALIZACIJA:
- Poveži sa korisničkim ciljevima
- Dodaj ROI estimate ako je relevantno
- Dodaj vremenski okvir za akciju
- Fokusiraj se na prihod i partnerstva

⚡ SERVIS 5: ACTIONS
Input: Recommendation + email content
Output: 1-3 akcije sa deadlines
ACTION TYPES:
- RESPOND (email reply)
- SCHEDULE (call/meeting)
- TODO (task za praćenje)
- POSTPONE (odloži za kasnije)
- RESEARCH (pre nego odgovoriš)
- FOLLOW_UP (reminder)
- ARCHIVE (nema akcije)

VREMENSKI OKVIRI:
"hitno" = danas do 15h
"ova_nedelja" = do petka
"ovaj_mesec" = sledeća 2-3 nedelje
"dugorocno" = nije hitno
"nema_deadline" = informational

═══════════════════════════════════════════════════════════════
📤 OUTPUT FORMAT (JSON)
═══════════════════════════════════════════════════════════════

Za svaki email vrati:

[
  {
    "id": "message_id",
    "sender": "email@example.com",
    "subject": "Subject line",

    "html_analysis": {
      "cleaned_text": "...",
      "is_newsletter": false,
      "urgency_markers": [],
      "structure_detected": "professional_email|newsletter|automated"
    },

    "classification": {
      "primary_category": "automation_opportunity",
      "subcategory": "workflow_automation",
      "confidence_score": 0.92,
      "matched_keywords": ["automatizacija", "workflow"]
    },

    "sentiment": {
      "urgency_score": 8,
      "tone": "professional",
      "business_potential": 9
    },

    "recommendation": {
      "priority_level": "high",
      "text": "PRIORITET - Direktna B2B prilika za automatizaciju workflow-a. Budget $10K, deadline ova nedelja.",
      "roi_estimate": "$5K-15K",
      "reasoning": "Direktna prilika koja se uklapa sa ciljem pronalaženja partnera za automatizaciju."
    },

    "action_steps": [
      {
        "type": "RESPOND",
        "description": "Odgovori sa discovery call proposal i case studies",
        "timeline": "hitno",
        "deadline": "2025-11-13T15:00:00Z",
        "template_suggestion": "Hi [Name], zahvaljujem na interesovanju...",
        "estimated_time": 15
      },
      {
        "type": "SCHEDULE",
        "description": "Zakaži 30min call za diskusiju projekta",
        "timeline": "ova_nedelja",
        "deadline": "2025-11-15T17:00:00Z",
        "platform": "Zoom"
      }
    ],

    "summary": "Direct inquiry for workflow automation with $10K budget and timeline this week",
    "gmail_link": "https://mail.google.com/mail/u/0/#inbox/message_id"
  }
    ]

═══════════════════════════════════════════════════════════════
⚠️ KRITIČNA PRAVILA
═══════════════════════════════════════════════════════════════
1. Newsletter detection = prvi prioritet → LOW priority odmah
2. priority_level = "low" | "medium" | "high" (samo ove 3 opcije)
3. Scores (1-10) = integers
4. timeline = "hitno" | "ova_nedelja" | "ovaj_mesec" | "dugorocno" | "nema_deadline"
5. action_steps = 1-3 akcije MAX
6. Sve preporuke = SPECIFIČNE i ACTIONABLE (ne generički saveti)
7. Ako nema jasnih akcija = stavi bar 1 akciju (RESPOND ili ARCHIVE)
8. Povežite svaku preporuku sa korisničkim ciljevima
9. confidence_score = 0.0 do 1.0 (decimal)

NEWSLETTER DETECTION:
Ako email sadrži bilo šta od ovoga → priority_level: "low", scores: 1-2:
- "unsubscribe" link
- Sender: noreply@, newsletter@, marketing@
- Bulk headers (List-Unsubscribe, Precedence: bulk)
- >5 slika u HTML-u
- Generički pozdrav bez personalizacije

═══════════════════════════════════════════════════════════════

EMAILOVI ZA ANALIZU:
{$emailsJson}

Obradi svaki email kroz 5 servisa i vrati JSON array sa kompletnim output-om.
PROMPT;

        return mb_convert_encoding($prompt, 'UTF-8', 'UTF-8');
    }

    /**
     * Get user goals from database (future implementation)
     * For now returns dummy data
     *
     * @param string|int|null $userId
     * @return array
     */
    protected function getUserGoals($userId = null): array
    {
        // TODO: Implement database lookup when UserGoal model is ready
        // if ($userId && class_exists('\App\Models\UserGoal')) {
        //     $userGoal = \App\Models\UserGoal::getActiveForUser($userId);
        //     if ($userGoal) {
        //         return $userGoal->toPromptArray();
        //     }
        // }

        return [
            'main_focus' => 'Automatizacija poslovnih procesa i pronalaženje B2B partnera',
            'key_goal' => 'Pronalaženje 3-5 projekata automatizacije u Q4 2025',
            'secondary_project' => 'Razvoj nacionalne turističke platforme',
            'strategy' => 'Pozicioniranje kao ekspert za workflow automatizaciju i AI integracije',
            'situation' => 'Hitna potreba za dodatnim prihodom kroz automatizaciju i konsalting',
            'target_clients' => 'B2B kompanije, startups sa $5K+ budgetom',
            'expertise' => 'Laravel, AI integracije, workflow automatizacija, email processing'
        ];
    }

    /**
     * Get email categories from database (future implementation)
     * For now returns dummy data
     *
     * @param string|int|null $userId
     * @return array
     */
    protected function getCategories($userId = null): array
    {
        // TODO: Implement database lookup when EmailCategory model is ready
        // if (class_exists('\App\Models\EmailCategory')) {
        //     return \App\Models\EmailCategory::getAllFormattedForPrompt($userId);
        // }

        return [
            'automation_opportunity' => [
                'description' => 'B2B automation prilike, consulting zahtevi',
                'subcategories' => ['workflow_automation', 'ai_ml_project', 'digital_transformation'],
                'priority' => 'high'
            ],
            'business_inquiry' => [
                'description' => 'Direktni zahtevi, projekti, partnerships',
                'subcategories' => ['project_proposal', 'partnership', 'consulting_request'],
                'priority' => 'high'
            ],
            'networking' => [
                'description' => 'Events, community, collaboration',
                'subcategories' => ['event', 'community', 'collaboration'],
                'priority' => 'medium'
            ],
            'financial' => [
                'description' => 'Računi, invoices, payments',
                'subcategories' => ['invoice', 'payment', 'billing'],
                'priority' => 'medium'
            ],
            'marketing' => [
                'description' => 'Newsletters, promo, bulk emails',
                'subcategories' => ['newsletter', 'promotion', 'announcement'],
                'priority' => 'low'
            ]
        ];
    }

    /**
     * Get keyword mapping for classification (future implementation)
     * For now returns dummy data
     *
     * @param string|int|null $userId
     * @return array
     */
    protected function getKeywordMapping($userId = null): array
    {
        // TODO: Implement database lookup when KeywordMapping model is ready
        // if (class_exists('\App\Models\KeywordMapping')) {
        //     return \App\Models\KeywordMapping::getAllForUserGrouped($userId);
        // }

        return [
            'high' => [
                'automatizacija', 'automation', 'workflow', 'integration', 'AI',
                'consulting', 'B2B', 'projekat', 'project', 'outsourcing',
                'digitalizacija', 'partnership', 'revenue', 'client'
            ],
            'medium' => [
                'networking', 'collaboration', 'startup', 'conference',
                'learning', 'innovation', 'tourism', 'development'
            ],
            'low' => [
                'newsletter', 'promotion', 'unsubscribe', 'update',
                'notification', 'administrative', 'marketing', 'bulk'
            ]
        ];
    }

    /**
     * Format the user goals section for prompt
     *
     * @param array $goals
     * @return string
     */
    protected function formatGoalsSection(array $goals): string
    {
        $formatted = "FOKUS: {$goals['main_focus']}\n";
        $formatted .= "KLJUČNI CILJ: {$goals['key_goal']}\n";

        if (isset($goals['secondary_project'])) {
            $formatted .= "SEKUNDARNI PROJEKAT: {$goals['secondary_project']}\n";
        }

        if (isset($goals['strategy'])) {
            $formatted .= "STRATEGIJA: {$goals['strategy']}\n";
        }

        if (isset($goals['situation'])) {
            $formatted .= "SITUACIJA: {$goals['situation']}\n";
        }

        if (isset($goals['target_clients'])) {
            $formatted .= "TARGET KLIJENTI: {$goals['target_clients']}\n";
        }

        if (isset($goals['expertise'])) {
            $formatted .= "EKSPERTIZA: {$goals['expertise']}";
        }

        return $formatted;
    }

    /**
     * Format categories section for prompt
     *
     * @param array $categories
     * @return string
     */
    protected function formatCategoriesSection(array $categories): string
    {
        $formatted = "";

        foreach ($categories as $categoryKey => $category) {
            $formatted .= strtoupper($categoryKey) . ": {$category['description']}\n";
            $formatted .= "  → subcategories: " . implode(' | ', $category['subcategories']) . "\n";
            $formatted .= "  → default priority: {$category['priority']}\n";
        }

        return rtrim($formatted);
    }
}
