import { useState } from "react";
import TMK from "../data.js";
import { go } from "../navigation.js";
import { Ic } from "./ui-core.jsx";

export function HeroSearchBar() {
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [format, setFormat] = useState("");

  function submit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (district) params.set("district", district);
    if (area) params.set("area", area);
    if (format) params.set("format", format);
    const qs = params.toString();
    go(qs ? `/catalog?${qs}` : "/catalog");
  }

  return (
    <form className="hero-search" onSubmit={submit}>
      <div className="hero-search-panel">
        <div className="hero-search-fields">
          <label className="hero-search-field">
            <span className="hero-search-label">Район</span>
            <select className="hero-search-control" value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="">Любой</option>
              {TMK.districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="hero-search-field">
            <span className="hero-search-label">Площадь</span>
            <select className="hero-search-control" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">Любой</option>
              {TMK.areaRanges.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
          <label className="hero-search-field">
            <span className="hero-search-label">Формат</span>
            <select className="hero-search-control" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="">Любой</option>
              {TMK.officeFormats.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary hero-search-btn">
          Подобрать офис {Ic.arrow({ s: 16 })}
        </button>
      </div>
    </form>
  );
}
