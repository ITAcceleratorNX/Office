import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { openObject } from "../navigation.js";
import { useCurrentPath } from "../hooks/useCurrentPath.js";
import { useMatchMedia } from "../hooks/useMatchMedia.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ALMATY = [43.238, 76.945];
const MOBILE_MQ = "(max-width: 660px)";

function mapPadding(mobile) {
  return mobile ? [36, 20] : [48, 48];
}

function buildPopup(o, { withButton = true, fromRef } = {}) {
  const wrap = L.DomUtil.create("div", "map-leaflet-popup");
  wrap.innerHTML = `<strong>${o.title}</strong><p>${o.district}</p><p>${o.address}</p>`;
  if (withButton) {
    const btn = L.DomUtil.create("button", "map-leaflet-popup-btn", wrap);
    btn.type = "button";
    btn.textContent = "Подробнее";
    L.DomEvent.on(btn, "click", (ev) => {
      L.DomEvent.stopPropagation(ev);
      openObject(o.slug, fromRef?.current);
    });
  }
  return wrap;
}

function setMapInteraction(map, enabled) {
  if (enabled) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
  } else {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
  }
}

export function MapLeaflet({ objects, single = false }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const mobile = useMatchMedia(MOBILE_MQ);
  const [interact, setInteract] = useState(false);
  const from = useCurrentPath();
  const fromRef = useRef(from);
  fromRef.current = from;

  useEffect(() => {
    setInteract(false);
  }, [mobile]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const list = objects.filter((o) => o.coords != null);
    const map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: !mobile,
      tap: true,
      bounceAtZoomLimits: false,
    }).setView(ALMATY, 12);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map);

    const bounds = L.latLngBounds([]);
    list.forEach((o) => {
      const latlng = [o.coords.lat, o.coords.lng];
      bounds.extend(latlng);
      L.marker(latlng)
        .addTo(map)
        .bindPopup(buildPopup(o, { withButton: !single, fromRef }), {
          maxWidth: mobile ? 260 : 320,
          autoPanPadding: mobile ? [24, 24] : [48, 48],
        });
    });

    const fit = () => {
      if (list.length > 1) {
        map.fitBounds(bounds, {
          padding: mapPadding(mobile),
          maxZoom: mobile ? 12 : 13,
        });
      } else if (list.length === 1) {
        const zoom = single ? (mobile ? 15 : 16) : (mobile ? 14 : 15);
        map.setView([list[0].coords.lat, list[0].coords.lng], zoom);
      }
    };
    fit();
    setMapInteraction(map, !mobile);

    const onResize = () => {
      map.invalidateSize({ animate: false });
      fit();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
    };
  }, [objects, mobile, single]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    setMapInteraction(map, !mobile || interact);
    if (interact) map.invalidateSize({ animate: false });
  }, [interact, mobile]);

  const showOverlay = mobile && !interact;

  return (
    <div className={`map-ph map-leaflet-wrap${showOverlay ? " is-idle" : ""}`}>
      <div ref={containerRef} className="map-leaflet" />
      {showOverlay && (
        <div className="map-leaflet-overlay" aria-hidden="false">
          <button
            type="button"
            className="map-leaflet-overlay-btn"
            onClick={() => setInteract(true)}
            aria-label="Активировать карту"
          >
            <span className="ic">{IcPin()}</span>
            <span className="tx">Коснитесь, чтобы перемещать карту</span>
          </button>
        </div>
      )}
    </div>
  );
}

function IcPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
