import { useState, type ChangeEvent, type FormEvent } from "react";

interface EmailResponderProps {
  initialFrom?: string;
  initialTo?: string;
  initialSubject?: string;
  apiUrl?: string;
}

export default function EmailResponder({
  initialFrom = "",
  initialTo = "",
  initialSubject = "",
  apiUrl = "/api/email/respond",
}: EmailResponderProps) {
  const [from, setFrom] = useState<string>(initialFrom);
  const [to, setTo] = useState<string>(initialTo);
  const [subject, setSubject] = useState<string>(initialSubject);
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  function isRecord(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === "object" && obj !== null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!from || !body) {
      setError("Recipient (Reply To) and body are required");
      return;
    }

    const payload = { from, to, subject, body };

    try {
      setLoading(true);
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      let data: unknown = null;
      try {
        data = await res.json();
      } catch (err) {
        // ignore JSON parse errors - treat as null
        data = null;
      }

      if (!res.ok) {
        if (
          isRecord(data) &&
          (typeof data.message === "string" || typeof data.error === "string")
        ) {
          setError((data.message ?? data.error) as string);
        } else {
          setError(`Request failed with ${res.status}`);
        }
      } else if (
        isRecord(data) &&
        "success" in data &&
        (data as Record<string, unknown>).success === false
      ) {
        const rec = data as Record<string, unknown>;
        setError(rec.error ? String(rec.error) : JSON.stringify(rec));
      } else {
        const response =
          isRecord(data) && "data" in data
            ? (data as Record<string, unknown>).data
            : (data ?? { status: "ok" });
        setResult(response);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const resultString =
    result === null ? "" : typeof result === "string" ? result : JSON.stringify(result, null, 2);

  return (
    <div style={{ maxWidth: 720 }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12 }}>Reply To (recipient email)</label>
          <input
            type="email"
            value={from}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFrom(e.target.value)}
            placeholder="sender@example.com"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12 }}>
            Sender (optional - your from alias)
          </label>
          <input
            type="email"
            value={to}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value)}
            placeholder="you@yourdomain.com"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12 }}>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
            placeholder="Re: ..."
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12 }}>Body</label>
          <textarea
            value={body}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
            rows={8}
            placeholder="Your reply message"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: "8px 14px" }}>
            {loading ? "Sending..." : "Send Reply"}
          </button>
          <button
            type="button"
            onClick={() => {
              setBody("");
              setSubject("");
            }}
            style={{ padding: "8px 14px" }}
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {result != null && (
        <div style={{ marginTop: 12, background: "#f6f6f6", padding: 12 }}>
          <strong>Result:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{resultString}</pre>
        </div>
      )}
    </div>
  );
}
