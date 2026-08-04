import axios from 'axios';

const SSL_LABS_ENDPOINT = 'https://api.ssllabs.com/api/v3/analyze';
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_MS = 45000;

const GRADE_SCORES = {
  'A+': 100,
  A: 95,
  'A-': 90,
  B: 80,
  C: 65,
  D: 50,
  E: 35,
  F: 20,
  T: 30,
  M: 30,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runSslCheck(hostname) {
  const startedAt = Date.now();
  let result = null;

  while (Date.now() - startedAt < MAX_POLL_MS) {
    const { data } = await axios.get(SSL_LABS_ENDPOINT, {
      params: { host: hostname, fromCache: 'on', maxAge: 24, all: 'done' },
      timeout: 20000,
    });
    result = data;

    if (data.status === 'READY' || data.status === 'ERROR') break;
    await sleep(POLL_INTERVAL_MS);
  }

  if (!result || result.status === 'ERROR' || !result.endpoints?.length) {
    return { status: result?.status ?? 'ERROR', grade: null, score: 40, protocols: [], certificate: null };
  }

  if (result.status !== 'READY') {
    return { status: 'IN_PROGRESS', grade: null, score: 60, protocols: [], certificate: null };
  }

  const endpoint = result.endpoints[0];
  const details = endpoint.details ?? {};
  const cert = result.certs?.[0];
  const protocols = (details.protocols ?? []).map((p) => `${p.name} ${p.version}`);

  return {
    status: 'READY',
    grade: endpoint.grade ?? null,
    score: GRADE_SCORES[endpoint.grade] ?? 50,
    protocols,
    certificate: cert
      ? {
          subject: cert.subject,
          issuer: cert.issuerSubject,
          notBefore: new Date(cert.notBefore).toISOString(),
          notAfter: new Date(cert.notAfter).toISOString(),
          daysUntilExpiry: Math.round((cert.notAfter - Date.now()) / (1000 * 60 * 60 * 24)),
          validNow: Date.now() < cert.notAfter && Date.now() > cert.notBefore,
        }
      : null,
  };
}
