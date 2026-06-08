import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { go } from "../navigation.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ALMATY = [43.238, 76.945];

function buildPopup(o) {
  const wrap = L.DomUtil.create("div", "map-leaflet-popup");
  wrap.innerHTML = `<strong>${o.title}</strong><p>${o.district} · ${o.address}</p>`;
  const btn = L.DomUtil.create("button", "map-leaflet-popup-btn", wrap);
  btn.type = "button";
  btn.textContent = "Подробнее";
  L.DomEvent.on(btn, "click", (ev) => {
    L.DomEvent.stopPropagation(ev);
    go("/objects/" + o.slug);
  });
  return wrap;
}

export function MapLeaflet({ objects, height = 520 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const list = objects.filter((o) => o.coords);
    const map = L.map(el, { scrollWheelZoom: false }).setView(ALMATY, 12);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const bounds = L.latLngBounds([]);
    list.forEach((o) => {
      const latlng = [o.coords.lat, o.coords.lng];
      bounds.extend(latlng);
      L.marker(latlng).addTo(map).bindPopup(buildPopup(o));
    });

    if (list.length > 1) {
      map.fitBounds(bounds, { padding: [48, 48] });
    } else if (list.length === 1) {
      map.setView([list[0].coords.lat, list[0].coords.lng], 15);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [objects]);

  return (
    <div className="map-ph map-leaflet-wrap" style={{ height }}>
      <div ref={containerRef} className="map-leaflet" />
    </div>
  );
}
