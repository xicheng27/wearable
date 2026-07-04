/**
 * Accessibility helpers for the live profile mirror (the quiz avatar).
 * Pure functions so the aria output is unit-testable without rendering.
 */

export const AVATAR_ZONE_LABELS: Record<string, string> = {
  shoulders: "shoulders",
  arms: "arms",
  hands: "hands",
  chest: "chest",
  waist: "waist and abdomen",
  hips: "hips and seated area",
  legs: "legs",
  feet: "feet",
  skin: "skin and fabric comfort",
};

/**
 * Builds the avatar's aria-label so the highlighted state is available to
 * screen readers, never only visually, e.g.:
 * "Interactive adaptive clothing fit preview. Highlighted areas: hands,
 *  feet. Seated posture. Caregiver support shown."
 */
export function buildAvatarAriaLabel(
  zones: string[],
  options: { seated?: boolean; helper?: boolean } = {}
): string {
  const parts = ["Interactive adaptive clothing fit preview."];
  const labels = Array.from(
    new Set(zones.map((zone) => AVATAR_ZONE_LABELS[zone]).filter(Boolean))
  );
  parts.push(
    labels.length > 0
      ? `Highlighted areas: ${labels.join(", ")}.`
      : "No areas highlighted yet — answers update this preview."
  );
  if (options.seated) parts.push("Seated posture.");
  if (options.helper) parts.push("Caregiver support shown.");
  return parts.join(" ");
}

/** Readable chip labels for the active zones (shown as text beside the avatar). */
export function avatarZoneChips(zones: string[]): string[] {
  return Array.from(
    new Set(zones.map((zone) => AVATAR_ZONE_LABELS[zone]).filter(Boolean))
  );
}
