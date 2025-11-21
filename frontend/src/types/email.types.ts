export interface EmailMessage {
  id: number;
  message_id: string;
  thread_id: string;
  from: string;
  from_name: string;
  to: Array<{ email: string; name: string }>;
  cc: Array<{ email: string; name: string }>;
  subject: string;
  body_preview: string;
  received_at: string;
  synced_at: string;
  unread: boolean;
  starred: boolean;
  important: boolean;
  priority: "high" | "normal" | "low";
  has_attachments: boolean;
  attachment_count: number;
  ai: {
    status: "completed" | "processing" | "pending" | "failed";
    summary: string | null;
    sentiment: {
      tone: string;
      urgency_score: number;
      business_potential: number;
    } | null;
    intent: "question" | "request" | "info" | "other";
    priority: "high" | "normal" | "low";
    entities: {
      dates: string[];
      people: string[];
      organizations: string[];
      locations: string[];
    };
    suggested_reply: string | null;
    action_items: string[];
    confidence: number;
    model: string;
    processed_at: string | null;
  } | null;
  attachments: Attachment[];
}

export interface Attachment {
  name: string;
  size_formatted: string;
}

export type BadgeType =
  | "status"
  | "sentiment"
  | "priority"
  | "intent"
  | "category"
  | "urgency"
  | "spam";

export type StatusValue = "completed" | "processing" | "pending" | "failed";
export type SentimentValue = "positive" | "neutral" | "negative" | "urgent";
export type PriorityValue = "high" | "normal" | "low";
export type IntentValue = "question" | "request" | "info" | "other";
export type CategoryValue =
  | "work"
  | "personal"
  | "newsletter"
  | "marketing"
  | "notification"
  | "social"
  | "finance"
  | "travel"
  | "shopping"
  | "other";
export type ComplexityLevel = "simple" | "moderate" | "complex";
export type UrgencyLevel = "critical" | "high" | "medium" | "low" | "none";
