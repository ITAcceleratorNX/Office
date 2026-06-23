import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { readScrollKey, saveScrollKey, scrollStorageKey } from "./navigation.js";

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
