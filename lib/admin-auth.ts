export function verifyAdminPin(request: Request) {
  const configuredPin = process.env.ADMIN_PIN;
  if (!configuredPin) {
    return { ok: false, status: 500, error: 'ADMIN_PIN is not set in Vercel Environment Variables yet.' };
  }
  const suppliedPin = request.headers.get('x-admin-pin') || '';
  if (suppliedPin !== configuredPin) {
    return { ok: false, status: 401, error: 'Invalid admin PIN.' };
  }
  return { ok: true, status: 200, error: '' };
}
