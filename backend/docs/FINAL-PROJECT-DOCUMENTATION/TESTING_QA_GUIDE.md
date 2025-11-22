# TESTING & QUALITY ASSURANCE GUIDE
## AI Automation Productivity Hub - Kompletni Test Scenariji

---

## 1. USER ACCEPTANCE TEST SCENARIOS

### 1.1 Onboarding Flow Testing

#### TEST CASE: NEW-USER-001
**Naziv:** Prvi login i Gmail konekcija

**Preduslovi:**
- Novi korisnik bez postojećeg account-a
- Aktivan Gmail account

**Test Koraci:**

```
1. Otvori aplikaciju → Login stranica se prikazuje
   ✓ Logo je vidljiv
   ✓ Form polja su prazna
   ✓ "Sign in with Google" button je aktivan

2. Klik na "Sign in with Google"
   → Google OAuth popup se otvara
   ✓ Permissions lista je prikazana
   ✓ Gmail read/write permissions su jasno označene

3. Autorizuj pristup
   → Redirect na Dashboard
   ✓ Welcome modal se prikazuje
   ✓ Korisničko ime je ispravno prikazano
   ✓ Gmail sync počinje automatski

4. Prvi sync
   → Loading indikator (0-100%)
   ✓ "Syncing X of Y emails" counter
   ✓ Ne smije trajati duže od 2 min za 100 emailova
   
5. Sync završen
   → Inbox je popunjen
   ✓ Emailovi su sortirani po prioritetu
   ✓ AI analiza je započela
```

**Očekivani Rezultat:**
- Korisnik uspješno povezan
- Gmail emailovi učitani
- AI počinje analizu

**Edge Cases:**
- [ ] Gmail permissions odbijene → Error message + retry
- [ ] Sync timeout → Graceful error + partial data
- [ ] Duplicate account → Merge ili error

---

#### TEST CASE: GOAL-SETUP-001
**Naziv:** Postavljanje korisničkih ciljeva

**Test Flow:**

```
EKRAN: Goal Selection
┌────────────────────────┐
│ Šta želite postići?    │
│                        │
│ □ Revenue growth       │ → Klik
│ □ Time saving         │ → Klik
│ □ Better organization │
└────────────────────────┘

VALIDACIJA:
✓ Minimum 1 cilj mora biti izabran
✓ Maximum 3 cilja
✓ Ciljevi se čuvaju u user.settings
✓ AI odmah adaptira preporuke
```

---

### 1.2 Email Processing Tests

#### TEST CASE: EMAIL-PROCESS-001
**Naziv:** AI analiza business opportunity emaila

**Test Data:**
```
Subject: Partnership Proposal - Automation Services
From: ceo@bigcompany.com
Content: "We're interested in your automation services.
         Budget is €50,000. Need implementation by Q1 2026.
         Can we schedule a call this week?"
```

**Expected AI Analysis:**

```json
{
  "classification": {
    "primary": "business_opportunity",
    "confidence": 0.95
  },
  "sentiment": {
    "tone": "positive",
    "urgency": 8,
    "business_potential": 9
  },
  "extracted_data": {
    "budget": "€50,000",
    "timeline": "Q1 2026",
    "action_required": "schedule_call"
  },
  "recommended_actions": [
    {
      "type": "RESPOND",
      "priority": "urgent",
      "deadline": "today",
      "template": "Thank you for your interest..."
    }
  ]
}
```

**Validation Points:**
- [ ] Classification accuracy > 90%
- [ ] Budget correctly extracted
- [ ] Timeline identified
- [ ] Urgency score 7-9
- [ ] Action suggested within 2 seconds

---

#### TEST CASE: EMAIL-BULK-001  
**Naziv:** Bulk email processing

**Scenario:**
- 50 emails stignu odjednom
- Mix of priorities (10 urgent, 20 normal, 20 newsletters)

**Performance Requirements:**
```
Processing Time:
- First email visible: < 1 second
- All emails loaded: < 5 seconds  
- AI basic analysis: < 30 seconds for all
- Full AI analysis: < 2 minutes

Memory Usage:
- Browser RAM < 500MB
- No memory leaks after 1 hour
- Smooth scrolling (60fps)
```

---

### 1.3 Dashboard Functionality Tests

#### TEST CASE: DASH-001
**Naziv:** Morning Dashboard Load

**Test at 8:00 AM:**
```
1. Open Dashboard
   Measure: Time to First Paint < 1s
   Measure: Time to Interactive < 2s

2. Check Welcome Widget
   ✓ Correct greeting (morning/afternoon/evening)
   ✓ Today's date accurate
   ✓ Weather (if enabled) current

3. Priority Inbox
   ✓ Urgent emails on top (red border)
   ✓ Unread count accurate
   ✓ AI summaries visible

4. Actions Panel  
   ✓ Today's tasks listed
   ✓ Checkboxes functional
   ✓ Progress bar updates on check

5. AI Insights
   ✓ Productivity score calculated
   ✓ Time saved displayed
   ✓ Recommendations relevant
```

---

### 1.4 Mobile Responsive Tests

#### TEST CASE: MOBILE-001
**Naziv:** iPhone 14 Pro Experience

**Device Specs:**
- Screen: 390 x 844px
- Browser: Safari iOS 16+

**Test Points:**

```
Portrait Mode:
┌─────────────────┐
│                 │
│  Should fit     │ ✓ No horizontal scroll
│  perfectly      │ ✓ Text readable (min 14px)
│                 │ ✓ Buttons tappable (44x44px)
│                 │
└─────────────────┘

Landscape Mode:
┌─────────────────────────────┐
│  Two column layout kicks in  │
└─────────────────────────────┘

Gestures:
→ Swipe right: Mark important
← Swipe left: Archive
↓ Pull down: Refresh
Long press: Options menu
```

**Network Conditions:**
- [ ] 3G: Usable (< 5s load)
- [ ] 4G: Smooth (< 2s load)
- [ ] Offline: Cached data visible

---

## 2. INTEGRATION TESTING

### 2.1 Gmail API Integration

#### TEST CASE: GMAIL-INT-001
**Naziv:** Gmail sync reliability

**Test Matrix:**

| Scenario | Expected Result | Timeout |
|----------|----------------|---------|
| 0 emails | Empty state shown | 5s |
| 100 emails | All synced | 30s |
| 1000 emails | Paginated sync | 2min |
| 10,000 emails | Progressive load | 5min |
| Attachment >25MB | Handled gracefully | - |
| Rate limit hit | Retry with backoff | - |
| Connection lost | Resume from last | - |

**Error Scenarios:**
```javascript
// Test invalid token
await gmailSync({ token: 'invalid' });
// Expected: 401 error, redirect to reauth

// Test expired token  
await gmailSync({ token: expiredToken });
// Expected: Auto-refresh attempt, then reauth

// Test network timeout
mockNetwork.simulateTimeout();
await gmailSync();
// Expected: Retry 3x, then user notification
```

---

### 2.2 AI Service Integration

#### TEST CASE: AI-INT-001
**Naziv:** Multi-model validation

**Test Setup:**
```python
emails = [
  high_value_opportunity,
  spam_email,
  newsletter,
  urgent_client_issue,
  meeting_request
]

for email in emails:
    # Run through all models
    gpt4_result = analyze_with_gpt4(email)
    claude_result = analyze_with_claude(email)
    gemini_result = analyze_with_gemini(email)
    
    # Validate consensus
    assert consensus_score(
      gpt4_result, 
      claude_result, 
      gemini_result
    ) > 0.8
```

**Divergence Handling:**
- If models disagree > 20% → Flag for human review
- If confidence < 70% → Use conservative classification
- If cost > $0.50/email → Alert admin

---

## 3. PERFORMANCE TESTING

### 3.1 Load Testing

#### TEST CASE: LOAD-001
**Naziv:** Peak hour simulation

**Scenario:** 
- 100 concurrent users
- Each processing 50 emails/minute
- 8:00 AM - 9:00 AM window

**Metrics to Track:**

```
API Response Times:
- /api/emails GET: < 200ms (p95)
- /api/analyze POST: < 2s (p95)
- WebSocket latency: < 100ms

Database Performance:
- Query time: < 50ms
- Connection pool: < 80% utilized
- Deadlocks: 0

AI Service:
- Queue depth: < 100 items
- Processing time: < 3s/email
- Token usage: < $500/hour
```

**Load Test Script:**
```javascript
// k6 load test
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '5m', target: 100 }, // Ramp up
    { duration: '30m', target: 100 }, // Stay at 100
    { duration: '5m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% under 2s
    http_req_failed: ['rate<0.1'], // Error rate under 10%
  }
};

export default function() {
  // Login
  let loginRes = http.post('https://api.ai-hub.com/auth/login', {
    email: `test${__VU}@example.com`,
    password: 'test123'
  });
  
  check(loginRes, {
    'login successful': (r) => r.status === 200
  });
  
  let token = loginRes.json('token');
  
  // Fetch emails
  let emailsRes = http.get('https://api.ai-hub.com/emails', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  check(emailsRes, {
    'emails loaded': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 2000
  });
}
```

---

### 3.2 Stress Testing

#### TEST CASE: STRESS-001
**Naziv:** System breaking point

**Gradual Increase:**
```
Users:     10 → 50 → 100 → 500 → 1000
Emails/min: 100 → 500 → 1000 → 5000 → 10000

Monitor:
- First errors at: ___ users
- Response degradation at: ___ emails/min
- System crash at: ___ load
- Recovery time: ___ minutes
```

---

## 4. SECURITY TESTING

### 4.1 Authentication Tests

#### TEST CASE: SEC-AUTH-001
**Naziv:** JWT token validation

```javascript
// Test expired token
const expiredToken = generateToken({ exp: Date.now() - 1000 });
const response = await api.get('/emails', { 
  headers: { Authorization: `Bearer ${expiredToken}` }
});
assert(response.status === 401);

// Test tampered token
const validToken = generateToken({ userId: 1 });
const tamperedToken = validToken.slice(0, -1) + 'X';
const response2 = await api.get('/emails', {
  headers: { Authorization: `Bearer ${tamperedToken}` }
});
assert(response2.status === 401);

// Test token for different user
const userAToken = generateToken({ userId: 1 });
const response3 = await api.get('/users/2/emails', {
  headers: { Authorization: `Bearer ${userAToken}` }
});
assert(response3.status === 403); // Forbidden
```

---

### 4.2 Data Privacy Tests

#### TEST CASE: SEC-PRIV-001
**Naziv:** Email content isolation

**Test Scenarios:**
```sql
-- User A should not see User B's emails
SELECT * FROM messaging_messages 
WHERE user_id = 2 
-- When logged in as User 1
-- Expected: 0 results

-- Soft-deleted emails not visible
UPDATE messaging_messages 
SET deleted_at = NOW() 
WHERE id = 'msg_123';

SELECT * FROM messaging_messages 
WHERE id = 'msg_123';
-- Expected: Not found

-- Encrypted sensitive data
SELECT credentials FROM messaging_channels;
-- Expected: Encrypted strings, not plaintext
```

---

## 5. USABILITY TESTING

### 5.1 User Task Completion

#### TEST CASE: USAB-001
**Naziv:** First-time user tasks

**Tasks to Complete (with timer):**

| Task | Target Time | Success Rate |
|------|-------------|--------------|
| Login & Connect Gmail | < 2 min | > 95% |
| Find urgent emails | < 30 sec | > 90% |
| Reply to email with AI | < 1 min | > 85% |
| Set up goals | < 2 min | > 90% |
| Complete daily actions | < 5 min | > 80% |

**Observation Points:**
- Where do users hesitate?
- What questions do they ask?
- Which features are not discovered?
- What errors do they make?

---

### 5.2 A/B Testing

#### TEST CASE: AB-001
**Naziv:** Dashboard layout optimization

**Variant A:** Current layout
```
[Welcome] [Inbox] [Actions]
```

**Variant B:** Alternative
```
[Inbox] [Actions] [Insights]
```

**Metrics:**
- Time to first action
- Email response rate
- Daily active usage
- User satisfaction (NPS)

**Sample Size:** 500 users per variant
**Duration:** 2 weeks
**Success Criteria:** >10% improvement in engagement

---

## 6. REGRESSION TESTING

### 6.1 Automated Test Suite

```javascript
// cypress/integration/regression.spec.js
describe('Core Functionality Regression', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
  });
  
  it('Dashboard loads correctly', () => {
    cy.visit('/dashboard');
    cy.contains('Welcome').should('be.visible');
    cy.get('[data-cy=inbox]').should('exist');
    cy.get('[data-cy=actions]').should('exist');
  });
  
  it('Email list displays and sorts', () => {
    cy.get('[data-cy=email-list]').should('have.length.gt', 0);
    cy.get('[data-cy=sort-priority]').click();
    cy.get('[data-cy=email-list]').first()
      .should('have.class', 'priority-urgent');
  });
  
  it('AI analysis completes', () => {
    cy.get('[data-cy=email-list]').first().click();
    cy.get('[data-cy=ai-analysis]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Classification:')
      .and('contain', 'Sentiment:')
      .and('contain', 'Actions:');
  });
  
  it('Actions can be completed', () => {
    cy.get('[data-cy=action-item]').first()
      .find('[data-cy=checkbox]')
      .click();
    cy.get('[data-cy=progress-bar]')
      .should('have.attr', 'aria-valuenow')
      .and('be.gt', 0);
  });
});
```

---

## 7. ACCESSIBILITY TESTING

### 7.1 WCAG 2.1 Compliance

#### TEST CASE: A11Y-001
**Naziv:** Screen reader navigation

**Tools:** NVDA, JAWS, VoiceOver

**Test Flow:**
```
1. Navigate with Tab key only
   ✓ All interactive elements reachable
   ✓ Focus order logical
   ✓ Focus visible

2. Screen reader announces:
   ✓ "Welcome to AI Hub Dashboard"
   ✓ "Priority inbox, 3 urgent emails"
   ✓ "Email from John Doe, subject: Partnership"
   
3. Form inputs:
   ✓ Labels properly associated
   ✓ Error messages announced
   ✓ Required fields indicated

4. Color contrast:
   ✓ Text: 4.5:1 minimum
   ✓ Large text: 3:1 minimum
   ✓ Interactive elements: 3:1
```

---

## 8. PRODUCTION MONITORING

### 8.1 Health Check Endpoints

```javascript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2025-11-21T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected", 
    "gmail_api": "operational",
    "ai_service": "operational",
    "websocket": "connected"
  },
  "metrics": {
    "active_users": 147,
    "emails_processed_today": 12847,
    "avg_response_time": "234ms",
    "error_rate": "0.02%"
  }
}

// GET /api/health/detailed
{
  "database": {
    "connections": 45,
    "pool_size": 100,
    "avg_query_time": "23ms"
  },
  "ai_service": {
    "queue_depth": 34,
    "avg_processing_time": "2.3s",
    "tokens_used_today": 1234567,
    "cost_today": "$37.89"
  }
}
```

---

## 9. BUG TRACKING TEMPLATE

```markdown
### BUG-2025-001

**Title:** AI analysis fails for emails with emojis

**Severity:** Medium
**Priority:** P2
**Component:** AI Service / Text Processing

**Description:**
When email subject contains emojis, AI classification 
returns error 500.

**Steps to Reproduce:**
1. Send email with subject "Meeting tomorrow 😊"
2. Wait for sync
3. Check AI analysis

**Expected Result:**
Email classified normally

**Actual Result:**
Error: "Unicode decode error"

**Environment:**
- Browser: Chrome 119
- OS: Windows 11
- User Role: Standard
- Email Count: ~500

**Logs:**
```
Error: UnicodeDecodeError at ai_service.py:234
'utf-8' codec can't decode byte 0xf0
```

**Fix Verification:**
- [ ] Unit test added
- [ ] Integration test passes
- [ ] Regression test updated
- [ ] Deployed to staging
- [ ] Verified in production
```

---

## 10. TEST METRICS & KPIs

### Test Coverage Goals

| Component | Target Coverage | Current |
|-----------|----------------|---------|
| Frontend (React) | 80% | ___ |
| Backend (Laravel) | 85% | ___ |
| AI Services | 75% | ___ |
| Integration Tests | 70% | ___ |

### Quality Metrics

```
Defect Density: < 5 bugs per 1000 lines
Test Pass Rate: > 95%
Regression Rate: < 2%
Mean Time to Detect: < 24 hours
Mean Time to Fix: < 48 hours
Customer Found Defects: < 0.1%
```

### Performance Baselines

```
Page Load: < 2 seconds (p95)
API Response: < 500ms (p95)
AI Processing: < 5 seconds (p95)
Database Query: < 100ms (p95)
WebSocket Latency: < 200ms (p95)
```

---

Ovaj dokument osigurava da aplikacija radi pouzdano, brzo i bez grešaka u svim scenarijima korištenja!