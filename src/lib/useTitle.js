import { useEffect } from "react";
import { SHOP } from "./shop";

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SHOP.name}` : SHOP.name;
  }, [title]);
}
