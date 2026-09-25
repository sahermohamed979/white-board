import { createHmac, timingSafeEqual } from "node:crypto";

export const OWNER_CAPABILITY_COOKIE = "sketchly_owner_capability";

export function getOwnerCapabilityCookieName(sessionId: string): string {
  return `sketchly_owner_${sessionId}`;
}

function getCapabilitySecret(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXTAUTH_SECRET ?? null;
}

function signSessionId(sessionId: string): string | null {
  const secret = getCapabilitySecret();
  if (!secret) return null;

  return createHmac("sha256", secret).update(sessionId).digest("hex");
}

export function createOwnerCapability(sessionId: string): string | null {
  const signature = signSessionId(sessionId);
  return signature ? `${sessionId}.${signature}` : null;
}

export function isOwnerCapabilityValid(
  capability: string | undefined,
  sessionId: string,
): boolean {
  if (!capability) return false;

  const separatorIndex = capability.lastIndexOf(".");
  if (separatorIndex <= 0) return false;

  const capabilitySessionId = capability.slice(0, separatorIndex);
  const providedSignature = capability.slice(separatorIndex + 1);
  const expectedSignature = signSessionId(sessionId);

  if (
    capabilitySessionId !== sessionId ||
    !expectedSignature ||
    providedSignature.length !== expectedSignature.length
  ) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(providedSignature),
    Buffer.from(expectedSignature),
  );
}
