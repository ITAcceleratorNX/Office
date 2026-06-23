import { openObject } from "../navigation.js";
import { useCurrentPath } from "./useCurrentPath.js";

export function useOpenObject() {
  const from = useCurrentPath();
  return (slug) => openObject(slug, from);
}
