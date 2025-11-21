# GoalBasedPromptBuilder - Usage Documentation

## Overview
Nova implementacija AI Email Orchestrator-a sa 5-servisnom arhitekturom koja omogućava fleksibilno upravljanje korisničkim ciljevima i kategorijama.

## Arhitektura

### 5 Servisa
1. **HTML Cleanup** - Čisti i ekstraktuje strukturu emaila
2. **Classification** - Kategorizuje email sa confidence score-om
3. **Sentiment & Urgency** - Analizira ton, hitnost i biznis potencijal
4. **Recommendations** - Generiše personalizovane preporuke
5. **Actions** - Predlaže konkretne akcije sa deadlines

## Usage

### Osnovna upotreba
```php
use App\Services\AI\GoalBasedPromptBuilder;

$builder = new GoalBasedPromptBuilder();

// Prosledite emailove za analizu
$emails = [
    [
        'id' => 'msg123',
        'from' => 'client@company.com',
        'subject' => 'Automation project inquiry',
        'body' => 'We need help with workflow automation...'
    ]
];

// Generiši prompt (koristi default korisničke ciljeve)
$prompt = $builder->buildEmailAnalysisPrompt($emails);
```

### Sa specifičnim korisnikom (za buduću implementaciju)
```php
// UserID će se koristiti za učitavanje iz baze
$userId = 123;
$prompt = $builder->buildEmailAnalysisPrompt($emails, $userId);
```

### Sa custom korisničkim ciljevima
```php
$customGoals = [
    'main_focus' => 'Razvoj AI rešenja za enterprise klijente',
    'key_goal' => 'Potpisivanje 2 velika klijenta u Q4',
    'secondary_project' => 'SaaS platforma za email automatizaciju',
    'strategy' => 'Fokus na Fortune 500 kompanije',
    'situation' => 'Ekspanzija tima i skaliranje operacija',
    'target_clients' => 'Enterprise sa $50K+ budgetom',
    'expertise' => 'AI/ML, Enterprise integrations, Cloud architecture'
];

$prompt = $builder->buildEmailAnalysisPrompt($emails, null, $customGoals);
```

## Output Format

AI vraća JSON sa detaljnom analizom:

```json
{
  "id": "msg123",
  "sender": "client@company.com",
  "subject": "Automation project inquiry",
  
  "html_analysis": {
    "cleaned_text": "We need help with workflow automation for our sales team...",
    "is_newsletter": false,
    "urgency_markers": ["this week"],
    "structure_detected": "professional_email"
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
    "text": "PRIORITET - Direktna B2B prilika za automatizaciju...",
    "roi_estimate": "$10K-20K",
    "reasoning": "Uklapa se sa ciljem pronalaženja automation partnera"
  },
  
  "action_steps": [
    {
      "type": "RESPOND",
      "description": "Odgovori sa case studies i discovery call predlogom",
      "timeline": "hitno",
      "deadline": "2025-11-13T15:00:00Z",
      "template_suggestion": "Hi [Name], ...",
      "estimated_time": 15
    }
  ],
  
  "summary": "Direct automation inquiry with $10K budget, needs response this week",
  "gmail_link": "https://mail.google.com/mail/u/0/#inbox/msg123"
}
```

## Buduća implementacija - Database

### User Goals (tabela: `user_goals`)
```sql
CREATE TABLE user_goals (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    main_focus TEXT,
    key_goal TEXT,
    secondary_project TEXT,
    strategy TEXT,
    situation TEXT,
    target_clients TEXT,
    expertise TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Categories (tabela: `email_categories`)
```sql
CREATE TABLE email_categories (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    priority ENUM('low', 'medium', 'high'),
    user_id BIGINT NULL, -- NULL = default categories
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE email_subcategories (
    id BIGINT PRIMARY KEY,
    category_id BIGINT,
    name VARCHAR(255),
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES email_categories(id)
);
```

### Keyword Mapping (tabela: `keyword_mappings`)
```sql
CREATE TABLE keyword_mappings (
    id BIGINT PRIMARY KEY,
    keyword VARCHAR(255),
    priority ENUM('low', 'medium', 'high'),
    category_id BIGINT,
    user_id BIGINT NULL,
    weight DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES email_categories(id)
);
```

## Promene od prethodne verzije

### Dodato:
✅ 5-servisna arhitektura jasno definisana
✅ Fleksibilna podrška za više korisnika (`$userId` parametar)
✅ Custom user goals sa override-om
✅ Strukturirane kategorije sa subcategories
✅ Keyword mapping sistem
✅ Detaljniji output sa `html_analysis`, `classification`, `sentiment`
✅ ROI estimate i reasoning u recommendations
✅ Template suggestions za akcije
✅ Confidence score za klasifikaciju

### Uklonjeno:
❌ `automation_relevance` (zamenjeno sa `business_potential`)
❌ Stari flat format output-a
❌ Hard-coded kategorije u promtu

### Izmenjeno:
🔄 Output format - strukturiraniji JSON
🔄 Korisnički ciljevi - fleksibilniji i detaljniji
🔄 Prioritizacija - bazirana na 5 servisa umesto pravila

## Testiranje

```php
// Test sa različitim tipovima emailova
$testEmails = [
    // Newsletter - treba da detektuje i da LOW priority
    [
        'id' => 'newsletter1',
        'from' => 'newsletter@techcrunch.com',
        'subject' => 'Weekly Tech Digest',
        'body' => '<html>...unsubscribe link...</html>'
    ],
    
    // Business inquiry - HIGH priority
    [
        'id' => 'business1',
        'from' => 'ceo@startup.com',
        'subject' => 'Partnership opportunity',
        'body' => 'We have $50K budget for automation project...'
    ],
    
    // Networking - MEDIUM priority
    [
        'id' => 'network1',
        'from' => 'organizer@conference.com',
        'subject' => 'Speaking opportunity at AI Summit',
        'body' => 'Would you be interested in speaking...'
    ]
];

$prompt = $builder->buildEmailAnalysisPrompt($testEmails);
// Pošalji AI-u i analiziraj rezultate
```

## Napomene

1. **Token optimization**: HTML Cleanup servis smanjuje tokene za 60-80%
2. **Personalizacija**: Sve preporuke se povezuju sa korisničkim ciljevima
3. **Skalabilnost**: Spremno za multi-user environment
4. **Database ready**: Struktura metoda pripremljena za DB integration
5. **Dummy data**: Trenutno koristi dummy data u `getUserGoals()`, `getCategories()`, `getKeywordMapping()`

## TODO

- [ ] Implementirati database tables
- [ ] Kreirati User Goals management UI
- [ ] Dodati Category & Keyword management
- [ ] Implementirati A/B testing za različite prompte
- [ ] Dodati analytics za tracking AI accuracy
- [ ] Kreirati API endpoints za user preferences
