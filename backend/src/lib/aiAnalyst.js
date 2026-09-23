// Calls Google Gemini's REST API directly (no SDK dependency needed for one
// endpoint) — chosen over a paid provider specifically because its free
// tier needs no billing setup. Requires GEMINI_API_KEY to be set; see
// routes/aiAnalyst.js for the "not configured" response when it isn't —
// per the project's own rule, this never fakes a response when the real
// integration isn't available.
const MODEL = 'gemini-3.5-flash-lite';
const MAX_OUTPUT_TOKENS = 1024;

const SYSTEM_PROMPT = `You are an analytics assistant for a website analytics dashboard. You will be given:
1. A JSON object containing REAL, verified analytics data for one client's website over a specific period.
2. A question from the client about their site.

Rules you must follow exactly:
- You may ONLY reference numbers, findings, and facts that appear in the provided JSON data. Never invent, estimate, round-trip-guess, or hallucinate any statistic that is not explicitly present in the data.
- If the data does not contain enough information to answer the question, say so plainly instead of guessing.
- When you state a number, cite it directly from the data (e.g. "your bounce rate was 42%").
- If a field is null or a sample size is small, mention that the data is limited rather than treating it as precise.
- Keep answers concise and actionable — a client wants to know what happened and what to do about it, not a data dump.
- Do not claim to know anything about search engine rankings, competitors, or any information not present in the provided data.`;

export async function askAiAnalyst({ question, context }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured.');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        {
          role: 'user',
          parts: [{ text: `Analytics data (JSON):\n${JSON.stringify(context)}\n\nQuestion: ${question}` }],
        },
      ],
      generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    const err = new Error(`Gemini API error (${response.status}): ${body}`);
    err.code = 'PROVIDER_ERROR';
    throw err;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('\n') || '';
  if (!text) {
    // A response can come back with no text if Gemini's safety filters
    // blocked it (finishReason: 'SAFETY') — surfaced honestly rather than
    // silently returning an empty answer.
    const finishReason = data.candidates?.[0]?.finishReason;
    const err = new Error(`Gemini returned no answer (finishReason: ${finishReason || 'unknown'}).`);
    err.code = 'PROVIDER_ERROR';
    throw err;
  }
  return text;
}
