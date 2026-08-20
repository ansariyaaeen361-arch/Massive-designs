import axios from 'axios';
import tls from 'node:tls';

const SSL_LABS_ENDPOINT = 'https://api.ssllabs.com/api/v3/analyze';
const POLL_INTERVAL_MS = 5000;
// SSL Labs' full assessment of a host it hasn't scanned recently (no cached
// result) commonly takes 60-180s to finish. Blocking the whole audit on that
// isn't a reasonable trade for a nicer A-F letter grade, so this budget is
// just long enough to pick up an already-cached result, not a fresh scan.
const MAX_POLL_MS = 25000;
const TLS_HANDSHAKE_TIMEOUT_MS = 8000;

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

// A direct handshake is what a real visitor's browser does: connect, and see
// whether the certificate is trusted, matches the hostname, and isn't
// expired. It resolves in a second or two regardless of whether a third-party
// grading service happens to have scanned this host before, so it's the
// source of truth for "is HTTPS actually working here" while SSL Labs' grade
// is layered on top only when it's available quickly.
function checkCertificateDirectly(hostname) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, timeout: TLS_HANDSHAKE_TIMEOUT_MS },
      () => {
        const cert = socket.getPeerCertificate();
        const authorized = socket.authorized;
        const authorizationError = socket.authorizationError;
        socket.end();

        if (!cert || Object.keys(cert).length === 0) {
          reject(new Error('The server did not present a certificate.'));
          return;
        }

        const notBefore = new Date(cert.valid_from).getTime();
        const notAfter = new Date(cert.valid_to).getTime();

        resolve({
          authorized,
          authorizationError: authorized ? null : String(authorizationError ?? 'Certificate not trusted'),
          subject: cert.subject?.CN ?? null,
          issuer: cert.issuer?.O ?? cert.issuer?.CN ?? null,
          notBefore,
          notAfter,
        });
      },
    );
    socket.on('error', reject);
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('The TLS handshake timed out.'));
    });
  });
}

async function fetchSslLabsGrade(hostname) {
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

  if (!result || result.status !== 'READY' || !result.endpoints?.length) return null;

  const endpoint = result.endpoints[0];
  if (!endpoint.grade) return null;

  return {
    grade: endpoint.grade,
    protocols: (endpoint.details?.protocols ?? []).map((p) => `${p.name} ${p.version}`),
  };
}

export async function runSslCheck(hostname) {
  let directCheck;
  try {
    directCheck = await checkCertificateDirectly(hostname);
  } catch (err) {
    return { status: 'ERROR', grade: null, score: 20, protocols: [], certificate: null, error: err.message };
  }

  const daysUntilExpiry = Math.round((directCheck.notAfter - Date.now()) / (1000 * 60 * 60 * 24));
  const validNow = Date.now() < directCheck.notAfter && Date.now() > directCheck.notBefore;
  const certificate = {
    subject: directCheck.subject,
    issuer: directCheck.issuer,
    notBefore: new Date(directCheck.notBefore).toISOString(),
    notAfter: new Date(directCheck.notAfter).toISOString(),
    daysUntilExpiry,
    validNow,
  };

  // A real, browser-trusted, unexpired certificate is a solid baseline score
  // on its own; SSL Labs' letter grade (cipher/protocol strength) refines it
  // upward or downward when we can get it within budget, but a slow or
  // uncached SSL Labs lookup should never turn an actually-valid certificate
  // into a false "needs attention" warning.
  let score = directCheck.authorized && validNow ? 85 : 30;
  let grade = null;
  let protocols = [];

  if (directCheck.authorized && validNow) {
    const sslLabs = await fetchSslLabsGrade(hostname).catch(() => null);
    if (sslLabs) {
      grade = sslLabs.grade;
      protocols = sslLabs.protocols;
      score = GRADE_SCORES[sslLabs.grade] ?? score;
    }
  }

  return {
    status: 'READY',
    grade,
    score,
    protocols,
    certificate,
    authorized: directCheck.authorized,
    authorizationError: directCheck.authorizationError,
  };
}
