export interface ParticipantIdentity {
  participantId: string;
  name: string;
}

function getStorageKey(sessionKey: string): string {
  return `sketchly:participant:${sessionKey}`;
}

export function getParticipantIdentity(
  sessionKey: string,
): ParticipantIdentity | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(getStorageKey(sessionKey));
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "participantId" in parsed &&
      "name" in parsed &&
      typeof parsed.participantId === "string" &&
      typeof parsed.name === "string"
    ) {
      return { participantId: parsed.participantId, name: parsed.name };
    }
  } catch {
    return null;
  }

  return null;
}

export function saveParticipantIdentity(
  sessionKey: string,
  name: string,
): ParticipantIdentity {
  const identity: ParticipantIdentity = {
    participantId: crypto.randomUUID(),
    name: name.trim(),
  };

  try {
    window.localStorage.setItem(getStorageKey(sessionKey), JSON.stringify(identity));
  } catch {
    // The identity remains available for the current page when storage is blocked.
  }

  return identity;
}
