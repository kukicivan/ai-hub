# Email Management V3 Component

## Opis
Email Management V3 komponenta prikazuje email poruke sa AI analizom. Komponenta je dizajnirana da prikaže postojeće poruke identično kao ranije, sa dodatkom AI analize ispod horizontalne linije.

## Struktura

### 1. TypeScript Interfaces
Fajl: `src/types/email.types.ts`

Definiše tipove za email poruke i badge komponente.

### 2. AIBadge Component
Fajl: `src/components/ui/AIBadge.tsx`

Reusable badge komponenta koja prikazuje različite statuse, sentimente, prioritete i intencije sa odgovarajućim bojama i ikonama.

**Badge stilovi:**
- **Status**: completed (zeleno), processing (žuto), pending (sivo), failed (crveno)
- **Sentiment**: positive (zeleno), neutral (plavo), negative (crveno), urgent (crveno sa animacijom)
- **Priority**: high (crveno), normal (plavo), low (sivo)
- **Intent**: question (?), request (!), info (i), other (bez ikone)

### 3. EmailManagementV3 Component
Fajl: `src/components/email-management-v3.tsx`

Glavna komponenta koja prikazuje email poruke sa AI analizom.

## Upotreba

### Osnovna upotreba
```jsx
import EmailManagementV3 from './components/email-management-v3';

function App() {
  return <EmailManagementV3 />;
}
```

### Struktura prikaza

```
┌─────────────────────────────────────┐
│  POSTOJEĆI MESSAGE BOX              │
│  - Subject                          │
│  - From Name                        │
│  - Body Preview                     │
│  - Received Date                    │
└─────────────────────────────────────┘
────────────────────────────────────── <-- AI Divider
┌─────────────────────────────────────┐
│  AI ANALYSIS BOX                    │
│  [Status] [Sentiment] [Priority]    │
│  [Intent]                           │
│                                     │
│  Sažetak: ...                       │
│                                     │
│  Predloženi odgovor: ... (optional) │
│                                     │
│  Akcije: (optional)                 │
│  • Akcija 1                         │
│  • Akcija 2                         │
└─────────────────────────────────────┘
```

## Primer podataka

```json
{
  "id": 41,
  "message_id": "19a4771d036e219c",
  "thread_id": "19a4771a3d4cade5",
  "from": "noreply@mcc.software",
  "from_name": "noreply@mcc.software",
  "subject": "Anstehende Arbeitssicherheitstermine...",
  "body_preview": "ANSTEHENDE ARBEITSSICHERHEITSTERMINE...",
  "received_at": "2025-11-03T02:00:31+00:00",
  "ai": {
    "status": "completed",
    "summary": "Obavijest o nadolazećim rokovima za sigurnosne obuke...",
    "sentiment": "neutral",
    "intent": "other",
    "priority": "normal",
    "entities": {
      "dates": [],
      "people": [],
      "organizations": [],
      "locations": []
    },
    "suggested_reply": null,
    "action_items": []
  }
}
```

## Features

✅ **Postojeći message box - netaknut dizajn**
✅ **AI Divider - tanka linija (1px solid #e0e0e0)**
✅ **AI Analysis Box - isti box-shadow i border-radius**
✅ **Badge-ovi**: status, sentiment, priority, intent
✅ **Summary prikazan**
✅ **Suggested reply prikazan (ako postoji)**
✅ **Action items prikazani (ako postoje)**
✅ **Loading state** za status !== "completed"
✅ **Empty state** ako nema ai objekta
✅ **Responsive** - badge-ovi wrap na mobilnim uređajima
✅ **Fade-in animacija** - smooth transition (300ms)
✅ **Entities prikazani** (datumi, osobe, organizacije, lokacije)

## Stilovi

Svi stilovi su dodati u `src/index.css` sa:
- Fade-in animacija
- AI divider styling
- Badge hover efekti
- Responsive design
- Smooth transitions

## Napomene

- Komponenta koristi `useMessages` hook za preuzimanje podataka
- Badge komponenta je potpuno reusable i može se koristiti i van ove komponente
- Ako `message.ai` ne postoji, prikazuje se "AI analiza nije dostupna"
- Ako `message.ai.status !== "completed"`, prikazuje se spinner sa "AI analiza u toku..."
- Svi elementi su responsive i prilagođavaju se mobilnim uređajima
