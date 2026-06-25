import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { readScrollKey, saveScrollKey, scrollStorageKey } from "./navigation.js";

function catalogParamsEqualExceptPage(prevKey, nextKey) {
  if (!prevKey.startsWith("/catalog") || !nextKey.startsWith("/catalog")) return false;
  const prevSearch = prevKey.includes("?") ? prevKey.slice(prevKey.indexOf("?") + 1) : "";
  const nextSearch = nextKey.includes("?") ? nextKey.slice(nextKey.indexOf("?") + 1) : "";
  const prevParams = new URLSearchParams(prevSearch);
  const nextParams = new URLSearchParams(nextSearch);
  prevParams.delete("page");
  nextParams.delete("page");
  return prevParams.toString() === nextParams.toString();
}

export function ScrollRestoration() {
  const { pathname, search } = useLocation();
  const navType = useNavigationType();
  const key = scrollStorageKey(pathname, search);
  const prevKey = useRef(key);

  useEffect(() => {
    if (navType === "POP") {
      const y = readScrollKey(key);
      if (y != null) {
        requestAnimationFrame(() => window.scrollTo(0, y));
        return;
      }
    }
    if (catalogParamsEqualExceptPage(prevKey.current, key)) return;
    window.scrollTo(0, 0);
  }, [key, navType]);

  useEffect(() => {
    const prev = prevKey.current;
    if (prev !== key) saveScrollKey(prev);
    prevKey.current = key;

    const onScroll = () => saveScrollKey(key);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      saveScrollKey(key);
    };
  }, [key]);

  return null;
}
