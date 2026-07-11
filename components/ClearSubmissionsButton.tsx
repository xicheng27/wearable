"use client";

import { useState } from "react";

const storageKey = "xis-submitted-items";

/**
 * Lets a visitor delete the product suggestions saved in this browser. Because
 * submissions never leave the device, this is the complete deletion path.
 */
export default function ClearSubmissionsButton() {
  const [done, setDone] = useState(false);

  function clear() {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Storage unavailable — nothing to remove.
    }
    setDone(true);
  }

  if (done) {
    return (
      <p role="status" className="text-sm leading-6 text-ink/70">
        Any item suggestions saved in this browser have been deleted.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={clear}
      className="text-sm font-semibold text-ink/70 underline underline-offset-4 hover:text-ink"
    >
      Delete item suggestions saved on this device
    </button>
  );
}
