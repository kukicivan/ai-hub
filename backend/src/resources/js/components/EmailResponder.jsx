import React, { useState } from 'react';

/**
 * EmailResponder
 * Minimal React component to post a reply to the Laravel endpoint:
 *   POST /api/email/respond
 * Payload shape sent: { from, to, subject, body }
 *
 * Props:
 *  - initialFrom    (string)  -> prefill recipient (the original sender) -> maps to `from`
 *  - initialTo      (string)  -> optional sender identity (maps to `to`)
 *  - initialSubject (string)
 *  - apiUrl         (string)  -> default '/api/email/respond'
 *
 * Usage: import and render in your app. This component is intentionally minimal.
 */

export default function EmailResponder({
  initialFrom = '',
  initialTo = '',
  initialSubject = '',
  apiUrl = '/api/email/respond'
}) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Basic client-side validation
    if (!from || !body) {
      setError('Recipient (Reply To) and body are required');
      return;
    }

    const payload = { from, to, subject, body };

    try {
      setLoading(true);

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // Add auth headers here if your API requires them
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || data?.error || `Request failed with ${res.status}`);
      } else if (data && data.success === false) {
        setError(data.error || JSON.stringify(data));
      } else {
        setResult(data.data || data);
      }

    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12 }}>Reply To (recipient email)</label>
          <input
            type="email"
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder="sender@example.com"
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12 }}>Sender (optional - your from alias)</label>
          <input
            type="email"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="you@yourdomain.com"
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12 }}>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Re: ..."
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12 }}>Body</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={8}
            placeholder="Your reply message"
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 14px' }}>
            {loading ? 'Sending...' : 'Send Reply'}
          </button>
          <button type="button" onClick={() => { setBody(''); setSubject(''); }} style={{ padding: '8px 14px' }}>
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: 12, color: 'crimson' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 12, background: '#f6f6f6', padding: 12 }}>
          <strong>Result:</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
