let _navigate = null;

export function setNavigate(fn) {
  _navigate = fn;
}

/** Navigate to an app route. Accepts `/catalog` or legacy `#/catalog`. */
export function go(route, options) {
  const path = route.replace(/^#\/?/, "/") || "/";
  if (_navigate) _navigate(path, options);
  else window.location.assign(path);
}

/** Open object page and remember where the user came from (for back navigation). */
export function openObject(slug, from) {
  go(`/objects/${slug}`, from ? { state: { from } } : undefined);
}

/** Catalog breadcrumb / return link from location.state.from */
export function catalogLinkFrom(from) {
  return from?.startsWith("/catalog") ? from : "/catalog";
}

export function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function navSection(id) {
  if (document.getElementById(id)) {
    smoothScrollTo(id);
    return;
  }
  const path = window.location.pathname;
  if (path !== "/" && path !== "") {
    go("/");
    setTimeout(() => smoothScrollTo(id), 220);
  } else {
    smoothScrollTo(id);
  }
}

const SCROLL_PREFIX = "tmk-scroll:";

export function saveScrollKey(key) {
  sessionStorage.setItem(SCROLL_PREFIX + key, String(window.scrollY));
}

export function readScrollKey(key) {
  const raw = sessionStorage.getItem(SCROLL_PREFIX + key);
  return raw == null ? null : Number(raw);
}

export function scrollStorageKey(pathname, search) {
  return pathname + search;
}
