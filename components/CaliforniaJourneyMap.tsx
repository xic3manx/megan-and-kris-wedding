"use client";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PLACES,
  MEGAN_ROUTE,
  KRIS_ROUTE,
  MASTROS_ROUTE,
  CALIFORNIA_OUTLINE,
  type LatLng,
  type Place,
} from "@/data/journey";

const SIDE_COLOR: Record<Place["side"], string> = {
  megan: "rgb(184, 163, 201)", // lavender
  kris: "rgb(193, 75, 106)", // rose
  shared: "rgb(201, 166, 107)", // gold
  reception: "rgb(122, 184, 192)", // sea-glass teal — for the Mastro's leg
};

/* ------------------------------------------------------------------ */
/* Custom marker icons                                                 */
/* ------------------------------------------------------------------ */

function dotIcon(color: string, size = 16, ring = "rgba(251,246,236,0.95)") {
  return L.divIcon({
    className: "mk-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
      <span style="
        display:block; width:${size}px; height:${size}px;
        border-radius:50%;
        background:${color};
        border:2px solid ${ring};
        box-shadow: 0 0 14px ${color}, 0 0 2px rgba(0,0,0,0.6);
      "></span>
    `,
  });
}

function heroStarIcon() {
  return L.divIcon({
    className: "mk-pin mk-hero",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `
      <span class="mk-hero-rings">
        <span class="mk-hero-ring"></span>
        <span class="mk-hero-ring mk-hero-ring-2"></span>
      </span>
      <svg viewBox="0 0 32 32" width="32" height="32" style="position:relative; display:block;" aria-hidden="true">
        <path d="M16 2 L19 12 L29 13 L21.5 19.5 L24 29 L16 23.5 L8 29 L10.5 19.5 L3 13 L13 12 Z"
          fill="rgb(201,166,107)"
          stroke="rgba(251,246,236,0.95)" stroke-width="0.8" stroke-linejoin="round"/>
        <circle cx="16" cy="16" r="2" fill="rgb(193,75,106)"/>
      </svg>
    `,
  });
}

/* ------------------------------------------------------------------ */
/* Haversine helpers                                                   */
/* ------------------------------------------------------------------ */

const R_EARTH_M = 6_371_000;

function haversineMeters(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const φ1 = toRad(a[0]);
  const φ2 = toRad(b[0]);
  const dφ = toRad(b[0] - a[0]);
  const dλ = toRad(b[1] - a[1]);
  const h =
    Math.sin(dφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
  return 2 * R_EARTH_M * Math.asin(Math.sqrt(h));
}

/**
 * Cluster places whose great-circle distance is small enough that
 * they'll overlap on screen at the current zoom. Returns a list of
 * index-groups. Each group has length >= 1; groups of length > 1
 * spiderfy on click.
 *
 * Threshold = `pxRadius` screen pixels of separation. We convert the
 * haversine distance (meters) to pixels using the metersPerPixel
 * value at the cluster's mean latitude — equivalent to the Web
 * Mercator scale.
 */
function buildClusters(
  places: Place[],
  zoom: number,
  pxRadius = 36
): number[][] {
  const groups: number[][] = [];
  const used = new Set<number>();
  for (let i = 0; i < places.length; i++) {
    if (used.has(i)) continue;
    const group = [i];
    used.add(i);
    for (let j = i + 1; j < places.length; j++) {
      if (used.has(j)) continue;
      const closeToGroup = group.some((k) => {
        const d = haversineMeters(places[k].latlng, places[j].latlng);
        // Web Mercator: meters/px at lat = (cos(lat) * 2πR) / (256 * 2^zoom)
        const meanLat =
          (places[k].latlng[0] + places[j].latlng[0]) / 2;
        const metersPerPx =
          (Math.cos((meanLat * Math.PI) / 180) * 2 * Math.PI * R_EARTH_M) /
          (256 * 2 ** zoom);
        const px = d / metersPerPx;
        return px < pxRadius * 2; // 2× to account for marker radius on each side
      });
      if (closeToGroup) {
        group.push(j);
        used.add(j);
      }
    }
    groups.push(group);
  }
  return groups;
}

/** Compute spiderfy ring positions (in container pixels) around an anchor. */
function spiderfy(
  anchorPx: L.Point,
  count: number,
  radius = 56
): L.Point[] {
  if (count <= 1) return [anchorPx];
  if (count === 2) {
    // North & south for the pair case — reads vertically, less ambiguous.
    return [
      L.point(anchorPx.x, anchorPx.y - radius),
      L.point(anchorPx.x, anchorPx.y + radius),
    ];
  }
  const out: L.Point[] = [];
  for (let i = 0; i < count; i++) {
    const θ = (2 * Math.PI * i) / count - Math.PI / 2;
    out.push(
      L.point(anchorPx.x + radius * Math.cos(θ), anchorPx.y + radius * Math.sin(θ))
    );
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Inner map (subscribed to map state via hooks)                       */
/* ------------------------------------------------------------------ */

/**
 * On hover-capable devices, leave drag-to-pan on (mouse drag = pan).
 * On touch-only devices, REQUIRE two fingers to pan: single-finger
 * touches pass through to the page so guests can scroll past the
 * map without the map hijacking the gesture. Pinch-to-zoom is on
 * either way (handled separately by Leaflet's touchZoom).
 */
function useTouchPolicy(map: L.Map | null) {
  useEffect(() => {
    if (!map) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: none)").matches) return;

    const container = map.getContainer();
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        map.dragging.enable();
      } else {
        map.dragging.disable();
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) map.dragging.disable();
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });
    // Start disabled — single-finger swipe should scroll the page,
    // not pan the map.
    map.dragging.disable();

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
      // Restore default state on unmount.
      map.dragging.enable();
    };
  }, [map]);
}

function MapBody() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  useTouchPolicy(map);

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  // Recompute clusters when zoom changes
  const clusters = useMemo(() => buildClusters(PLACES, zoom), [zoom]);

  // Pre-compute spiderfied positions for every multi-member cluster.
  // Auto-fanned: no click needed, the legs and members stay visible
  // until the zoom is close enough that they naturally split.
  type SpiderState = {
    anchorLatLng: LatLng;
    positions: LatLng[];
    group: number[];
  };
  const spiderByCluster = useMemo<Record<number, SpiderState>>(() => {
    const out: Record<number, SpiderState> = {};
    clusters.forEach((group, idx) => {
      if (group.length < 2) return;
      let latSum = 0;
      let lngSum = 0;
      for (const i of group) {
        latSum += PLACES[i].latlng[0];
        lngSum += PLACES[i].latlng[1];
      }
      const anchorLatLng: LatLng = [
        latSum / group.length,
        lngSum / group.length,
      ];
      const anchorPx = map.latLngToContainerPoint(anchorLatLng);
      const positions = spiderfy(anchorPx, group.length).map((p) => {
        const ll = map.containerPointToLatLng(p);
        return [ll.lat, ll.lng] as LatLng;
      });
      out[idx] = { anchorLatLng, positions, group };
    });
    return out;
  }, [clusters, map, zoom]);

  return (
    <>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* California outline — thick gold border, faint lavender fill */}
      <Polygon
        positions={CALIFORNIA_OUTLINE}
        pathOptions={{
          color: "rgb(201, 166, 107)",
          weight: 3,
          opacity: 0.95,
          fillColor: "rgb(184, 163, 201)",
          fillOpacity: 0.06,
          lineJoin: "round",
        }}
      />
      {/* second pass — finer dashed inner trace for character */}
      <Polygon
        positions={CALIFORNIA_OUTLINE}
        pathOptions={{
          color: "rgb(251, 246, 236)",
          weight: 0.6,
          opacity: 0.45,
          dashArray: "2 6",
          fill: false,
        }}
      />

      {/* Routes */}
      <Polyline
        positions={MEGAN_ROUTE}
        pathOptions={{
          color: SIDE_COLOR.megan,
          weight: 3.5,
          opacity: 0.9,
          dashArray: "8 6",
          lineCap: "round",
        }}
      />
      <Polyline
        positions={KRIS_ROUTE}
        pathOptions={{
          color: SIDE_COLOR.kris,
          weight: 3.5,
          opacity: 0.9,
          dashArray: "6 5",
          lineCap: "round",
        }}
      />
      {/* Ceremony → reception: Pelican Hill across PCH to Mastro's.
          Solid (not dashed) to read as "day-of" rather than journey. */}
      <Polyline
        positions={MASTROS_ROUTE}
        pathOptions={{
          color: SIDE_COLOR.reception,
          weight: 3,
          opacity: 0.95,
          lineCap: "round",
        }}
      />

      {/* Marker rendering — singletons at real positions, clusters
          permanently fanned out around their centroid. */}
      {clusters.map((group, groupIdx) => {
        if (group.length === 1) {
          const place = PLACES[group[0]];
          return (
            <PlaceMarker key={place.id} place={place} alwaysOpenTooltip />
          );
        }
        const spider = spiderByCluster[groupIdx];
        if (!spider) return null;
        return (
          <SpiderfiedGroup
            key={`cluster-${groupIdx}`}
            group={group}
            positions={spider.positions}
            anchor={spider.anchorLatLng}
          />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Markers                                                             */
/* ------------------------------------------------------------------ */

function PlaceMarker({
  place,
  alwaysOpenTooltip,
}: {
  place: Place;
  alwaysOpenTooltip?: boolean;
}) {
  const icon =
    place.id === "pelican" ? heroStarIcon() : dotIcon(SIDE_COLOR[place.side]);
  return (
    <Marker position={place.latlng} icon={icon}>
      <Tooltip
        direction="right"
        offset={[14, 0]}
        opacity={1}
        permanent={alwaysOpenTooltip}
        className="mk-tooltip"
      >
        <div className="mk-tooltip-inner">
          <div className="mk-tooltip-name">{place.name}</div>
          {place.subtitle && (
            <div className="mk-tooltip-sub">{place.subtitle}</div>
          )}
        </div>
      </Tooltip>
    </Marker>
  );
}

function SpiderfiedGroup({
  group,
  positions,
  anchor,
}: {
  group: number[];
  positions: LatLng[];
  anchor: LatLng;
}) {
  return (
    <>
      {/* legs */}
      {positions.map((pos, i) => (
        <Polyline
          key={`leg-${group[i]}`}
          positions={[anchor, pos]}
          pathOptions={{
            color: "rgba(201, 166, 107, 0.7)",
            weight: 1,
            opacity: 0.7,
            dashArray: "2 3",
          }}
        />
      ))}
      {/* fanned-out markers */}
      {group.map((idx, i) => {
        const place = { ...PLACES[idx], latlng: positions[i] };
        return <PlaceMarker key={place.id} place={place} alwaysOpenTooltip />;
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

export default function CaliforniaJourneyMap() {
  // Fit bounds that contain all three places + a comfortable margin
  const bounds = useMemo<L.LatLngBoundsExpression>(
    () => [
      [32.4, -124.6],
      [42.1, -114.0],
    ],
    []
  );

  return (
    <div className="mk-map-shell relative">
      <MapContainer
        bounds={bounds}
        // Desktop: scroll-wheel zooms while the cursor is over the map.
        //   When the cursor leaves the map, the page resumes scrolling.
        // Mobile: pinch with two fingers zooms; one-finger drag pans.
        //   The +/- control still works for either input mode.
        scrollWheelZoom
        touchZoom
        doubleClickZoom
        zoomControl
        attributionControl
        zoomSnap={0.5}
        zoomDelta={0.5}
        wheelDebounceTime={40}
        wheelPxPerZoomLevel={120}
        style={{ height: "640px", width: "100%" }}
        className="mk-map"
      >
        <MapBody />
      </MapContainer>

      {/* legend overlay */}
      <div className="mk-map-legend">
        <span className="mk-legend-row">
          <span className="mk-legend-dot" style={{ background: SIDE_COLOR.megan }} />
          Megan · from Eureka
        </span>
        <span className="mk-legend-row">
          <span className="mk-legend-dot" style={{ background: SIDE_COLOR.kris }} />
          Kris · from Irvine
        </span>
        <span className="mk-legend-row">
          <span className="mk-legend-dot mk-legend-dot--star" />
          Pelican Hill · 07.14.2026
        </span>
        <span className="mk-legend-row">
          <span className="mk-legend-dot" style={{ background: SIDE_COLOR.reception }} />
          Mastro's · reception
        </span>
      </div>

      {/* gesture hint — only meaningful on touch devices */}
      <p className="mk-map-touch-hint">
        Use two fingers to pan or pinch to zoom
      </p>
    </div>
  );
}
