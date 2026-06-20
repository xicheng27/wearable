/**
 * ============================================================================
 * IMAGE METADATA NOTE
 * ============================================================================
 * Xi's may display product and brand images for identification, accessibility
 * reference, recommendation, and shopping comparison. Keep image URLs tied to
 * the exact product listing whenever possible, and keep the public disclaimer
 * visible so users understand the site is independent from the brands shown.
 *
 * `permissionStatus` remains as an internal provenance/review field. It no
 * longer gates display by itself; ProductImage falls back only when a URL is
 * missing or fails to load.
 * ============================================================================
 */

export type ImageLicenseType =
  | "brand-permission"
  | "affiliate-feed"
  | "press-kit"
  | "own-photo"
  | "licensed-stock"
  | "identification-reference"
  | "placeholder";

export type PermissionStatus = "approved" | "pending" | "needs-review";

export interface ImageMeta {
  imageUrl: string;
  imageAlt: string;
  /** Human label for where the image came from, e.g. "Tommy Hilfiger". */
  imageSource: string;
  imageLicenseType: ImageLicenseType;
  /** Optional attribution/disclosure text for approved or licensed assets. */
  attributionText: string;
  permissionStatus: PermissionStatus;
  /** The page the image was found on, for re-verification. */
  sourcePageUrl: string;
  /** ISO date the image/source was last verified. */
  lastVerifiedDate: string;
}

/**
 * Retained for older callers that want only fully approved/licensed assets.
 * The main product UI does not use this gate anymore.
 */
export function clearedImage(meta?: ImageMeta | null): ImageMeta | null {
  return meta && meta.permissionStatus === "approved" ? meta : null;
}
