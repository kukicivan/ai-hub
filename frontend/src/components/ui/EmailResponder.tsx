import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRespondToEmailMutation } from "@/redux/features/email/emailApi";
import { toast } from "sonner";

interface EmailResponderProps {
  initialFrom?: string;
  initialTo?: string;
  initialSubject?: string;
}

// Updated to use RTK Query instead of direct fetch per SRS 12.2 standardization
export default function EmailResponder({
  initialFrom = "",
  initialTo = "",
  initialSubject = "",
}: EmailResponderProps) {
  const [from, setFrom] = useState<string>(initialFrom);
  const [to, setTo] = useState<string>(initialTo);
  const [subject, setSubject] = useState<string>(initialSubject);
  const [body, setBody] = useState<string>("");
  const [result, setResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use RTK Query mutation instead of direct fetch
  const [respondToEmail, { isLoading: loading }] = useRespondToEmailMutation();

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
      const response = await respondToEmail(payload).unwrap();

      // Handle SRS 12.2 standardized response format
      if (response.success) {
        setResult(response.data);
        toast.success(response.message || "Email response sent successfully");
      } else {
        setError(response.message || "Failed to send email response");
        toast.error("Failed", { description: response.message });
      }
    } catch (err: unknown) {
      // Handle RTK Query error format
      const apiError = err as {
        data?: { message?: string; errors?: Record<string, string[]> };
      };

      if (apiError?.data?.errors) {
        const firstField = Object.keys(apiError.data.errors)[0];
        const errorMessage = apiError.data.errors[firstField]?.[0];
        setError(errorMessage || "Validation error");
        toast.error("Failed", { description: errorMessage });
      } else {
        const message = apiError?.data?.message || "Failed to send email response";
        setError(message);
        toast.error("Failed", { description: message });
      }
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
