export async function verifyRecaptcha(token, remoteIp) {
  if (!token) return false;

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
      remoteip: remoteIp ?? '',
    }),
  });

  const data = await response.json();
  return Boolean(data.success);
}
