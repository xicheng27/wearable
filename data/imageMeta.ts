/**
 * ============================================================================
 * COPYRIGHT-SAFE IMAGE SYSTEM — ADMIN / DATA NOTE
 * ============================================================================
 * Product and brand photographs are copyrighted by the brand or photographer.
 * Do NOT scrape, hotlink, or copy images from Google, Instagram, Pinterest, or
 * brand websites and mark them "approved" without WRITTEN permission, an
 * affiliate/product feed that grants display rights, a press-kit licence, our
 * own photography, or a paid stock licence.
 *
 * Until an image is cleared, set `permissionStatus` to "needs-review" (or
 * "pending"). The frontend will then show a clean first-party placeholder
 * instead of the copyrighted image. Only flip an image to "approved" once the
 * licence/permission is recorded in `imageLicenseType` + `attributionText`.
 * ============================================================================
 */

export type ImageLicenseType =
  | "brand-permission" // written permission from the brand
  | "affiliate-feed" // image rights granted via an affiliate/product feed
  | "press-kit" // brand press/media kit with display licence
  | "own-photo" // photographed by us
  | "licensed-stock" // paid stock licence
  | "placeholder"; // first-party illustration / generated tile

export type PermissionStatus = "approved" | "pending" | "needs-review";

export interface ImageMeta {
  imageUrl: string;
  imageAlt: string;
  /** Human label for where the image came from, e.g. "Tommy Hilfiger". */
  imageSource: string;
  imageLicenseType: ImageLicenseType;
  /** Shown subtly under the image / on the detail page when approved. */
  attributionText: string;
  permissionStatus: PermissionStatus;
  /** The page the image was found on (for re-verification). */
  sourcePageUrl: string;
  /** ISO date the permission/licence was last verified. */
  lastVerifiedDate: string;
}

/**
 * Returns the image metadata only when it is cleared to display.
 * Anything pending or needs-review returns null so the UI falls back to a
 * first-party placeholder.
 */
export function clearedImage(meta?: ImageMeta | null): ImageMeta | null {
  return meta && meta.permissionStatus === "approved" ? meta : null;
}
