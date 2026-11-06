const WEEKS = {
  east: "5–7 weeks",
  florida: "6–8 weeks",
  gulf: "6–8 weeks",
  central: "7–9 weeks",
  west: "8–10 weeks",
};

export function weeksToTema(region) {
  return WEEKS[region] || "6–9 weeks";
}

export function deposit(total) {
  const start = Math.round(total * 0.4);
  return { start, later: total - start };
}
