import { useLocation } from "react-router-dom";

export function useCurrentPath() {
  const { pathname, search } = useLocation();
  return pathname + search;
}
