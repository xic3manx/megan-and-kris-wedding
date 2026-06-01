"use client";

import dynamic from "next/dynamic";

/**
 * Leaflet needs `window`, so the real map component has to load
 * client-only. This wrapper handles that.
 */
const CaliforniaJourneyMap = dynamic(
  () => import("@/components/CaliforniaJourneyMap"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="mk-map-skeleton"
        style={{ height: 640 }}
      />
    ),
  }
);

export default function CaliforniaMapLoader() {
  return <CaliforniaJourneyMap />;
}
