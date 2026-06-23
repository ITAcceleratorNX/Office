export function SectionHead({ eyebrow, title, text, dark, center }) {
  return (
    <div className={"section-head" + (center ? " mx-auto center" : "")} style={center ? { marginInline: "auto" } : null}>
      {eyebrow && <span className={"eyebrow" + (dark ? " on-dark" : "")}>{eyebrow}</span>}
      <h2 style={dark ? { color: "#fff" } : null}>{title}</h2>
      {text && <p style={dark ? { color: "rgba(255,255,255,0.74)" } : null}>{text}</p>}
    </div>
  );
}
