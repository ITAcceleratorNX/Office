import { useState } from "react";
import { go } from "../navigation.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useTMK } from "../hooks/useTMK.js";
import { Ic } from "./ui-core.jsx";

export function HeroSearchBar() {
  const { t } = useI18n();
  const { districts, areaRanges, officeFormats } = useTMK();
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
            <span className="hero-search-label">{t("heroSearch.district")}</span>
            <select className="hero-search-control" value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="">{t("common.any")}</option>
              {districts.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </label>
          <label className="hero-search-field">
            <span className="hero-search-label">{t("heroSearch.area")}</span>
            <select className="hero-search-control" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">{t("common.any")}</option>
              {areaRanges.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
          <label className="hero-search-field">
            <span className="hero-search-label">{t("heroSearch.format")}</span>
            <select className="hero-search-control" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="">{t("common.any")}</option>
              {officeFormats.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary hero-search-btn">
          {t("common.pickOffice")} {Ic.arrow({ s: 16 })}
        </button>
      </div>
    </form>
  );
}
