import { useState } from 'react';
import { apiPost } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';

const EXAMPLE_QUESTIONS = [
  'What are my best pages?',
  'Which channel produces the most traffic?',
  'What should I fix first?',
  'What changed recently?',
  'Which pages need attention?',
];

export default function AiAnalyst() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [notConfigured, setNotConfigured] = useState(false);

  async function ask(q) {
    const text = (q ?? question).trim();
    if (!text || status === 'asking') return;
    setQuestion('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setStatus('asking');
    try {
      const data = await apiPost('/api/ai-analyst', { question: text });
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
      setStatus('idle');
    } catch (err) {
      if (err.status === 503) setNotConfigured(true);
      // err.message is now the server's actual human-readable message
      // (e.g. "not configured", "today's AI question limit reached") —
      // fall back to a generic line only for truly unexpected failures.
      const text = err.status === 503 || err.status === 429 ? err.message : 'Something went wrong answering that — try again.';
      setMessages((prev) => [...prev, { role: 'assistant', text }]);
      setStatus('idle');
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold">AI Analyst</h1>
      <p className="mt-1 text-xs text-slate-400">
        Answers are grounded only in your site's real, already-verified data — it will say so rather than guess if the
        data doesn't cover your question.
      </p>

      {notConfigured && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          Not configured yet — an administrator needs to add a Gemini API key on the server before this feature can
          answer questions.
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-500 hover:border-primary hover:text-primary dark:border-slate-700"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-[200px] space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {messages.length === 0 && <p className="text-sm text-slate-400">Ask a question about your site's traffic, conversions, or performance.</p>}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                m.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {status === 'asking' && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Spinner /> Thinking…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your traffic, conversions, performance…"
          maxLength={500}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <button
          type="submit"
          disabled={status === 'asking' || !question.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
