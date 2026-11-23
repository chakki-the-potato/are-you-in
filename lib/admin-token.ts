import { SignJWT, jwtVerify } from 'jose'

const ENCODER = new TextEncoder()

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')
  return ENCODER.encode(secret)
}

const TTL_SECONDS = 60 * 60 // 1h

export async function signAdminToken(eventId: string): Promise<string> {
  return new SignJWT({ scope: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(eventId)
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(getSecret())
}

export async function verifyAdminToken(
  token: string,
  eventId: string
): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256'],
    })
    return payload.sub === eventId && payload.scope === 'admin'
  } catch {
    return false
  }
}
