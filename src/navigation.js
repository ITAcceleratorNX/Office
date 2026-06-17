let _navigate = null;

export function setNavigate(fn) {
  _navigate = fn;
}

/** Navigate to an app route. Accepts `/catalog` or legacy `#/catalog`. */
export function go(route) {
  const path = route.replace(/^#\/?/, "/") || "/";
  if (_navigate) _navigate(path);
  else window.location.assign(path);
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
