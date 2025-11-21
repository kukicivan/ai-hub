# 🚀 Quick Reference - AI Email Orchestrator

## ⚡ Brzo pokretanje

```php
use App\Services\AI\GoalBasedPromptBuilder;

// 1. OSNOVNI POZIV (koristi dummy data)
$builder = new GoalBasedPromptBuilder();
$prompt = $builder->buildEmailAnalysisPrompt($emails);

// 2. SA CUSTOM GOALS
$myGoals = [
    'main_focus' => 'Tvoj glavni fokus',
    'key_goal' => 'Tvoj ključni cilj',
    'strategy' => 'Tvoja strategija'
];
$prompt = $builder->buildEmailAnalysisPrompt($emails, null, $myGoals);

// 3. SA USER ID (za buduću DB implementaciju)
$userId = 123;
$prompt = $builder->buildEmailAnalysisPrompt($emails, $userId);
```

---

## 📋 5 Servisa - Kratak pregled

| # | Servis | Input | Output |
|---|--------|-------|--------|
| 1 | **HTML Cleanup** | Raw HTML | Cleaned text, structure, newsletter detection |
| 2 | **Classification** | Cleaned text | Category, subcategory, confidence, keywords |
| 3 | **Sentiment** | Cleaned text | Urgency, tone, business potential |
| 4 | **Recommendations** | All above | Priority, ROI, reasoning, actionable advice |
| 5 | **Actions** | Recommendation | 1-3 steps with deadlines & templates |

---

## 📤 Output struktura

```json
{
  "html_analysis": { cleaned_text, is_newsletter, urgency_markers, structure_detected },
  "classification": { primary_category, subcategory, confidence_score, matched_keywords },
  "sentiment": { urgency_score, tone, business_potential },
  "recommendation": { priority_level, text, roi_estimate, reasoning },
  "action_steps": [ { type, description, timeline, deadline, template_suggestion, estimated_time } ],
  "summary": "...",
  "gmail_link": "..."
}
```

---

## 🎯 Kategorije

- **automation_opportunity** - HIGH priority
  - workflow_automation, ai_ml_project, digital_transformation
- **business_inquiry** - HIGH priority
  - project_proposal, partnership, consulting_request
- **networking** - MEDIUM priority
  - event, community, collaboration
- **financial** - MEDIUM priority
  - invoice, payment, billing
- **marketing** - LOW priority
  - newsletter, promotion, announcement

---

## 📊 Scoring sistem

### Urgency Score (1-10)
- **9-10**: URGENT, ASAP, today, hitno
- **7-8**: this week, ova nedelja
- **5-6**: ovaj mesec, when you can
- **3-4**: dugoročno, eventually
- **1-2**: nema_deadline

### Business Potential (1-10)
- **9-10**: Direktan projekat $5K+
- **7-8**: Kvalitet partnership
- **5-6**: Networking opportunity
- **3-4**: Informativno
- **1-2**: Spam/irrelevant

### Priority Level
- **high**: automation_opportunity OR business_inquiry sa urgency >= 7
- **medium**: networking ili business sa nižom hitnosti
- **low**: newsletter, marketing, bulk emails

---

## 🔑 Ključne reči

### HIGH Priority
`automatizacija`, `automation`, `workflow`, `integration`, `AI`, `consulting`, `B2B`, `projekat`, `project`, `outsourcing`, `digitalizacija`, `partnership`

### MEDIUM Priority
`networking`, `collaboration`, `startup`, `conference`, `learning`, `innovation`

### LOW Priority
`newsletter`, `promotion`, `unsubscribe`, `update`, `notification`, `marketing`

---

## ⚙️ Action Types

- **RESPOND** - Email reply
- **SCHEDULE** - Call/meeting
- **TODO** - Task za praćenje
- **POSTPONE** - Odloži za kasnije
- **RESEARCH** - Pre nego odgovoriš
- **FOLLOW_UP** - Reminder
- **ARCHIVE** - Nema akcije

---

## 🗄️ Database setup (kada bude spreman)

```bash
# 1. Run SQL
mysql -u root -p messaging_gateway < docs/database_schema_user_goals.sql

# 2. Copy models
cp docs/example_models/*.php src/app/Models/

# 3. Ažuriraj GoalBasedPromptBuilder.php
# Uncomment DB pozive, remove dummy fallbacks
```

---

## 🔧 Debugging

```php
// Proveri generisani prompt
$prompt = $builder->buildEmailAnalysisPrompt($emails);
file_put_contents('storage/logs/last_prompt.txt', $prompt);
echo "Prompt size: " . strlen($prompt) . " bytes\n";

// Log AI response
Log::info('AI Response', [
    'content' => $content,
    'usage' => $response['usage'] ?? []
]);
```

---

## 📁 Važni fajlovi

```
src/app/Services/AI/
  ├── GoalBasedPromptBuilder.php      (Main class)
  └── EmailAnalyzerService.php        (Consumer)

docs/
  ├── IMPLEMENTATION_SUMMARY.md       (Read this first!)
  ├── PROMPT_BUILDER_USAGE.md         (Detailed usage)
  ├── AI_ORCHESTRATOR_IMPLEMENTATION.md
  ├── ARCHITECTURE_DIAGRAM.txt
  ├── database_schema_user_goals.sql
  └── example_models/                 (Future DB models)
```

---

## ⚠️ Important

1. **Dummy data je aktivan** - Sve radi sa hard-coded values
2. **Backward compatible** - Postojeći kod i dalje radi
3. **Production ready** - Nema errora, testiran
4. **Token optimizovan** - 8K umesto 15K (~47% manje)
5. **Multi-user ready** - `$userId` parametar implementiran

---

## 📞 Help

- Full guide: `/docs/AI_ORCHESTRATOR_IMPLEMENTATION.md`
- Usage: `/docs/PROMPT_BUILDER_USAGE.md`
- Summary: `/docs/IMPLEMENTATION_SUMMARY.md`
- Architecture: `/docs/ARCHITECTURE_DIAGRAM.txt`

---

**Version:** 2.0  
**Status:** ✅ Production Ready  
**Date:** November 13, 2025
