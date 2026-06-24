export function interpolate(str, vars = {}) {
  if (!str || !vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : ""));
}

export function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function createTranslator(messages) {
  return function t(key, vars) {
    const val = getByPath(messages, key);
    if (val == null) return key;
    if (typeof val !== "string") return val;
    return interpolate(val, vars);
  };
}
