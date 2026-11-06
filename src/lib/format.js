export function money(n) {
  const value = Math.round(Number(n) || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function miles(n) {
  return `${new Intl.NumberFormat("en-US").format(n)} mi`;
}

export function saleWhen(iso) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function lotTiming(iso) {
  const hours = (new Date(iso).getTime() - Date.now()) / 36e5;
  if (hours <= 36) return "Bids soon";
  return "On the calendar";
}

export function multipleLabel(multiple) {
  if (!multiple) return "—";
  return `${multiple.toFixed(2)}×`;
}

export function pct(rate) {
  const n = Math.round(rate * 1000) / 10;
  return Number.isInteger(n) ? `${n}%` : `${n.toFixed(1)}%`;
}
