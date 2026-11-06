import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { money } from "../lib/format";

const ShopContext = createContext(null);
const FALLBACK_RATE = 15.4;

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function ShopProvider({ children }) {
  const [currency, setCurrency] = useState(() => (localStorage.getItem("tla-currency") === "GHS" ? "GHS" : "USD"));
  const [rate, setRate] = useState(FALLBACK_RATE);
  const [rateLive, setRateLive] = useState(false);
  const [saved, setSaved] = useState(() => readList("tla-saved"));
  const [compare, setCompare] = useState(() => readList("tla-compare").slice(0, 3));

  useEffect(() => {
    localStorage.setItem("tla-currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("tla-saved", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem("tla-compare", JSON.stringify(compare));
  }, [compare]);

  useEffect(() => {
    let gone = false;
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((response) => response.json())
      .then((data) => {
        const ghs = data?.rates?.GHS;
        if (!gone && Number.isFinite(ghs) && ghs > 0) {
          setRate(ghs);
          setRateLive(true);
        }
      })
      .catch(() => {});
    return () => {
      gone = true;
    };
  }, []);

  const value = useMemo(() => {
    function ghs(usd) {
      return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        maximumFractionDigits: 0,
      }).format(Math.round((Number(usd) || 0) * rate));
    }

    function format(usd) {
      return currency === "GHS" ? ghs(usd) : money(usd);
    }

    function toUsd(amount) {
      const n = Number(amount) || 0;
      return currency === "GHS" ? n / rate : n;
    }

    return {
      currency,
      setCurrency,
      rate,
      rateLive,
      format,
      ghs,
      toUsd,
      saved,
      isSaved: (id) => saved.includes(id),
      toggleSaved: (id) =>
        setSaved((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id])),
      compare,
      inCompare: (id) => compare.includes(id),
      toggleCompare: (id) =>
        setCompare((prev) => {
          if (prev.includes(id)) return prev.filter((item) => item !== id);
          if (prev.length >= 3) return [...prev.slice(1), id];
          return [...prev, id];
        }),
      clearCompare: () => setCompare([]),
    };
  }, [currency, rate, rateLive, saved, compare]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside ShopProvider");
  return value;
}
