Odličan progres! 🎉 Razumem izazove - newsletter kao "jako važan" je klasičan AI problem. Hajde da razradimo strategiju za produkciju sa besplatnim modelima.

🎯 KRITIČNI PROBLEMI & REŠENJA
------------------------------

### 1\. **Newsletter Hype Problem**

Prompt mora biti **mnogo strožiji** sa negativnim primerima:

    NEWSLETTER DETECTION (KRITIČNO):
    Ako email sadrži bilo šta od ovoga, automatski stavi scores 1-2:
    - "unsubscribe" link u body-ju
    - Sender: noreply@, newsletter@, marketing@, info@
    - Bulk email headers (List-Unsubscribe, Precedence: bulk)
    - HTML sa mnogo image tagova (>5)
    - Generički content bez personalizacije
    
    PRIMERI NEWSLETTERA (automatski LOW priority):
    ❌ "Weekly digest from...", "Monthly newsletter", "Top stories"
    ❌ "Hi there" (generičko obraćanje bez imena)
    ❌ Marketinške fraze: "Don't miss out", "Limited time", "Act now"
    
    PRIMERI VAŽNIH EMAILOVA (HIGH priority):
    ✅ Direktno obraćanje sa imenom: "Hi Stefan,"
    ✅ Specifična pitanja/zahtevi
    ✅ Business proposal sa konkretnim detaljiama
    ✅ Follow-up na prethodni razgovor

### 2\. **Token Limit Problem - Batching Strategy**

Ovo je KLJUČNO za free tier:

    Free Tier Limits:
    - llama-3.1-8b-instant: 14,400 tokens/day
    - llama-3.3-70b: 14,400 tokens/day  
    - gemma2-9b: 7,200 tokens/day
    TOTAL: 36,000 tokens/day
    
    Prosečan email sa promptom: ~6,000 tokens
    Capacity: 6 emails/dan sa jednim modelom = 18 emails/dan total

**REŠENJE: Smart Batching + Model Rotation**

php

    // NEW SERVICE: AIBatchProcessor
    
    class AIBatchProcessor 
    {
        const TOKENS_PER_EMAIL = 6000; // Conservative estimate
        const BATCH_STRATEGIES = [
            'single' => 1,    // 1 email per call
            'micro' => 2,     // 2 emails per call (safest for free tier)
            'small' => 3,     // 3 emails per call
            'medium' => 5,    // 5 emails per call (risky)
        ];
        
        public function processBatch(array $emails): array 
        {
            $strategy = $this->selectBatchStrategy($emails);
            $batches = array_chunk($emails, self::BATCH_STRATEGIES[$strategy]);
            $results = [];
            
            foreach ($batches as $batch) {
                // Rotate through models
                $model = $this->getNextAvailableModel();
                
                if (!$model) {
                    // All models exhausted - queue for tomorrow
                    $this->queueForTomorrow($batch);
                    continue;
                }
                
                try {
                    $result = $this->processWithModel($batch, $model);
                    $results = array_merge($results, $result);
                    
                    // Track tokens used
                    $this->trackTokenUsage($model, $batch);
                    
                    // Small delay between calls
                    usleep(100000); // 100ms
                    
                } catch (RateLimitException $e) {
                    // Model exhausted, try next
                    $this->markModelExhausted($model);
                    continue;
                }
            }
            
            return $results;
        }
        
        private function selectBatchStrategy(array $emails): string
        {
            $count = count($emails);
            
            // Ultra-safe for free tier: process 1 by 1
            if ($count <= 10) return 'single';
            
            // Micro batches for 10-30 emails
            if ($count <= 30) return 'micro';
            
            // Small batches for 30+
            return 'small';
        }
    }

### 3\. **Prompt Optimization - Token Reduction**

Trenutni prompt je **previše dugačak**. Možemo smanjiti za 40-50%:

**BEFORE:** ~4000 tokens **AFTER:** ~2000 tokens

Kako:

*   Skraćeni system prompt (bez ponavljanja)
*   Kompresovani primeri
*   JSON format bez dodatnih komentara
*   Samo **neophodna polja** u email payload-u

php

    // OPTIMIZED EMAIL PAYLOAD
    $emailsForAnalysis = $messagesToProcess->map(function($msg) {
        return [
            'id' => $msg->message_id,
            's' => $msg->sender['email'],              // Skraćeno: sender
            'sub' => $msg->metadata['subject'] ?? '',  // Skraćeno: subject
            'txt' => substr($msg->content_text, 0, 300), // Max 300 chars!
            'att' => $msg->attachment_count > 0,       // Boolean umesto broja
        ];
    })->toArray();

### 4\. **Model Rotation Logic**

php

    class ModelRotationService
    {
        private array $modelQueue = [
            'llama-3.1-8b-instant',
            'llama-3.3-70b-versatile',
            'gemma2-9b-it',
        ];
        
        public function getNextModel(): ?string
        {
            foreach ($this->modelQueue as $model) {
                if ($this->hasTokensAvailable($model)) {
                    return $model;
                }
            }
            
            return null; // All exhausted
        }
        
        private function hasTokensAvailable(string $model): bool
        {
            $used = Cache::get("tokens_{$model}_" . date('Y-m-d'), 0);
            $limit = config("ai.groq.models.{$model}.daily_token_limit");
            
            return ($limit - $used) > 6000; // Need at least 6k tokens
        }
    }

🎯 AKCIONI PLAN ZA SUTRA
------------------------

### Priority 1: PROMPT ENGINEERING (2-3h)

**Fokus:**

1.  Newsletter detection rules (strožije)
2.  Score calibration (ne sve može biti 8-9)
3.  Token optimization (skrati prompt 50%)

**Testovi:**

*   20 newslettera → Svi moraju biti score 1-2
*   10 business emailova → Score 6-9
*   5 casual emailova → Score 3-5

### Priority 2: BATCHING IMPLEMENTATION (2h)

**Tasks:**

1.  Kreirati `AIBatchProcessor` service
2.  Implementirati `ModelRotationService`
3.  Update `EmailAnalyzerService` da koristi batching
4.  Test sa 50+ emailova

### Priority 3: MONITORING (1h)

**Dashboard za token tracking:**

    Model Status:
    llama-3.1-8b:     █████░░░░░ 5,200 / 14,400 (36%)
    llama-3.3-70b:    ███░░░░░░░ 3,800 / 14,400 (26%)
    gemma2-9b:        ██░░░░░░░░ 1,500 / 7,200  (21%)
    
    Available capacity: ~7 emails remaining today
    Next reset: 23:45:12

📋 SUGESTIJE ZA OPTIMIZACIJU
----------------------------

### 1\. Pre-filtering (Before AI)

php

    // Skip očigledne newslettere BEZ AI poziva
    $messagesToProcess = $messages->filter(function($msg) {
        $sender = $msg->sender['email'];
        $subject = $msg->metadata['subject'] ?? '';
        
        // Auto-skip patterns
        if (str_contains($sender, 'noreply')) return false;
        if (str_contains($sender, 'newsletter')) return false;
        if (str_contains($subject, 'Unsubscribe')) return false;
        if ($msg->metadata['labels'] ?? [] contains 'CATEGORY_PROMOTIONS') return false;
        
        return true;
    });
    
    // Ovo može uštedjeti 30-50% AI poziva!

### 2\. Tiered Processing

php

    // Process u 3 nivoa prioriteta
    $tier1 = $messages->filter(fn($m) => $m->is_unread && $m->is_important);
    $tier2 = $messages->filter(fn($m) => $m->is_unread && !$m->is_important);
    $tier3 = $messages->filter(fn($m) => !$m->is_unread);
    
    // Process tier 1 odmah, tier 2 kasnije, tier 3 samo ako ima tokena

### 3\. Cached Sender Analysis

php

    // Ako je sender već analiziran, koristi pattern
    Cache::remember("sender_pattern_{$sender}", 86400, function() {
        // AI call samo prvi put
        return $this->analyzeSenderPattern($sender);
    });
    
    // Svi newsletteri od istog sendera dobijaju isti score

### 4\. Summarization umesto Full Analysis

Za manje važne emailove, ne treba puna analiza:

php

    if ($isNewsletter || $isNotification) {
        return [
            'summary' => 'Newsletter - ' . $subject,
            'priority_level' => 'low',
            'business_potential' => 1,
            'urgency_score' => 1,
            'recommendation' => 'Archive or read when free',
            'action_steps' => [],
        ];
    }

🧪 TESTING FRAMEWORK
--------------------

Kreiraj test suite sa realnim primerima:

php

    // tests/Feature/AIAnalysisTest.php
    class AIAnalysisTest extends TestCase
    {
        /** @test */
        public function it_detects_newsletters_correctly()
        {
            $newsletter = $this->createNewsletterMessage();
            $result = $this->aiAnalyzer->analyzeEmails([$newsletter]);
            
            $this->assertLessThanOrEqual(2, $result['data'][0]['business_potential']);
            $this->assertLessThanOrEqual(2, $result['data'][0]['urgency_score']);
            $this->assertEquals('low', $result['data'][0]['priority_level']);
        }
        
        /** @test */
        public function it_prioritizes_business_emails()
        {
            $businessEmail = $this->createBusinessMessage();
            $result = $this->aiAnalyzer->analyzeEmails([$businessEmail]);
            
            $this->assertGreaterThanOrEqual(7, $result['data'][0]['business_potential']);
            $this->assertEquals('high', $result['data'][0]['priority_level']);
        }
    }

💡 FINAL RECOMMENDATIONS
------------------------

1.  **Start conservative** - 1 email per call danas, povećaj sutra
2.  **Track everything** - Log every token spent
3.  **Fail gracefully** - Ako nema tokena, queue za sutra
4.  **User feedback loop** - Dodaj "Was this helpful?" button na svaku analizu
5.  **Prompt versioning** - Git track prompt changes, A/B test

Da li želiš da krenem sa implementacijom nekog od ovih delova? Možemo fokusirati na:

*   ✅ Optimizovan prompt (newsletter detection + token reduction)
*   ✅ Batching service
*   ✅ Model rotation
*   ✅ Pre-filtering logic

Šta je prioritet? 🎯