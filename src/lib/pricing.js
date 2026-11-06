import { money, pct } from "./format.js";

export const YARD_FEE = 95;
export const DOC_FEE = 65;
const INSURANCE_RATE = 0.012;

const FEE_TIERS = [
  { max: 99.99, fee: 45, label: "Under $100" },
  { max: 199.99, fee: 80, label: "$100–$199" },
  { max: 299.99, fee: 130, label: "$200–$299" },
  { max: 399.99, fee: 160, label: "$300–$399" },
  { max: 499.99, fee: 185, label: "$400–$499" },
  { max: 599.99, fee: 225, label: "$500–$599" },
  { max: 699.99, fee: 250, label: "$600–$699" },
  { max: 799.99, fee: 270, label: "$700–$799" },
  { max: 899.99, fee: 295, label: "$800–$899" },
  { max: 999.99, fee: 320, label: "$900–$999" },
  { max: 1199.99, fee: 360, label: "$1,000–$1,199" },
  { max: 1499.99, fee: 410, label: "$1,200–$1,499" },
  { max: 1999.99, fee: 480, label: "$1,500–$1,999" },
  { max: 2499.99, fee: 540, label: "$2,000–$2,499" },
  { max: 2999.99, fee: 600, label: "$2,500–$2,999" },
  { max: 3999.99, fee: 700, label: "$3,000–$3,999" },
  { max: 4999.99, fee: 780, label: "$4,000–$4,999" },
  { max: 5999.99, fee: 860, label: "$5,000–$5,999" },
  { max: 6999.99, fee: 940, label: "$6,000–$6,999" },
  { max: 7999.99, fee: 1020, label: "$7,000–$7,999" },
  { max: 8999.99, fee: 1100, label: "$8,000–$8,999" },
  { max: 9999.99, fee: 1180, label: "$9,000–$9,999" },
  { max: 14999.99, fee: 1450, label: "$10,000–$14,999" },
];

export const BODIES = [
  { id: "sedan", label: "Sedan or coupe", short: "Sedan" },
  { id: "suv", label: "SUV or crossover", short: "SUV" },
  { id: "pickup", label: "Pickup", short: "Pickup" },
  { id: "van", label: "Van", short: "Van" },
];

export const REGIONS = [
  { id: "east", label: "East Coast", detail: "Newark, Philadelphia, Savannah", inland: 420 },
  { id: "florida", label: "Florida", detail: "Miami, Tampa", inland: 510 },
  { id: "gulf", label: "Gulf", detail: "Houston yards to the Houston dock", inland: 360 },
  { id: "central", label: "Central", detail: "Dallas, Chicago, Denver", inland: 940 },
  { id: "west", label: "West Coast", detail: "Los Angeles, Phoenix, Sacramento", inland: 1120 },
];

export const DESTINATIONS = [
  {
    id: "poti",
    city: "Poti",
    country: "Georgia",
    freight: { sedan: 1480, suv: 1890, pickup: 2140, van: 1980 },
    duty: 0.08,
    dutyLabel: "Excise allowance",
    vat: 0.18,
    vatLabel: "VAT",
    port: 260,
    broker: 140,
    note: "Black Sea hub. Georgian excise follows age and engine size. Eight percent is a planning allowance, not the customs table.",
  },
  {
    id: "klaipeda",
    city: "Klaipėda",
    country: "Lithuania",
    freight: { sedan: 1180, suv: 1520, pickup: 1760, van: 1640 },
    duty: 0.1,
    dutyLabel: "EU customs duty",
    vat: 0.21,
    vatLabel: "VAT",
    port: 360,
    broker: 230,
    note: "EU entry. Duty on the dock value, then VAT. A salvage title can clear customs and still fail registration.",
  },
  {
    id: "jebel",
    city: "Jebel Ali",
    country: "UAE",
    freight: { sedan: 1780, suv: 2240, pickup: 2480, van: 2320 },
    duty: 0.05,
    dutyLabel: "Customs duty",
    vat: 0.05,
    vatLabel: "VAT",
    port: 320,
    broker: 190,
    note: "Gulf delivery. Repairable titles are the usual path. Confirm the model-year rule before you bid.",
  },
  {
    id: "durres",
    city: "Durrës",
    country: "Albania",
    freight: { sedan: 1420, suv: 1840, pickup: 2060, van: 1920 },
    duty: 0.1,
    dutyLabel: "Customs duty",
    vat: 0.2,
    vatLabel: "VAT",
    port: 250,
    broker: 150,
    note: "Adriatic port used for late-model US salvage. Duty here is a flat planning rate.",
  },
  {
    id: "constanta",
    city: "Constanța",
    country: "Romania",
    freight: { sedan: 1280, suv: 1640, pickup: 1880, van: 1760 },
    duty: 0.1,
    dutyLabel: "EU customs duty",
    vat: 0.19,
    vatLabel: "VAT",
    port: 310,
    broker: 200,
    note: "EU Black Sea entry. Same duty idea as Klaipėda, with Romanian VAT.",
  },
  {
    id: "lagos",
    city: "Lagos",
    country: "Nigeria",
    freight: { sedan: 2380, suv: 2920, pickup: 3180, van: 3040 },
    duty: 0.2,
    dutyLabel: "Customs duty",
    vat: 0.075,
    vatLabel: "VAT",
    port: 460,
    broker: 210,
    note: "Age limits are enforced and they change. This sheet prices the lot. It does not clear the age rule.",
  },
];

export function getDest(id) {
  return DESTINATIONS.find((d) => d.id === id) ?? DESTINATIONS[0];
}

export function getRegion(id) {
  return REGIONS.find((r) => r.id === id) ?? REGIONS[0];
}

export function bodyShort(id) {
  return BODIES.find((b) => b.id === id)?.short ?? "Vehicle";
}

export function buyerFee(bid) {
  const n = Math.max(0, Number(bid) || 0);
  if (n <= 0) return { amount: 0, band: "No bid yet" };
  if (n > 15000) {
    return {
      amount: Math.max(1450, Math.round(n * 0.09)),
      band: "9% over $15,000",
    };
  }
  const tier = FEE_TIERS.find((t) => n <= t.max);
  if (!tier) return { amount: Math.round(n * 0.09), band: "Open band" };
  return { amount: tier.fee, band: tier.label };
}

export function buildQuote({
  bid,
  body = "sedan",
  destinationId = "poti",
  region = "east",
  includeVat = true,
  repair = 0,
}) {
  const dest = getDest(destinationId);
  const yard = getRegion(region);
  const hammer = Math.max(0, Math.round(Number(bid) || 0));
  const fee = buyerFee(hammer);
  const ocean = dest.freight[body] ?? dest.freight.sedan;
  const preInsurance = hammer + fee.amount + YARD_FEE + DOC_FEE + yard.inland + ocean;
  const insurance = Math.round(preInsurance * INSURANCE_RATE);
  const cif = preInsurance + insurance;
  const duty = Math.round(cif * dest.duty);
  const vatBase = cif + duty + dest.port + dest.broker;
  const vat = includeVat ? Math.round(vatBase * dest.vat) : 0;
  const repairAmt = Math.max(0, Math.round(Number(repair) || 0));

  const groups = [
    {
      id: "auction",
      label: "At the auction",
      lines: [
        { id: "hammer", label: "Hammer", amount: hammer, note: "The bid you plan to win at" },
        { id: "buyer", label: "Buyer fee", amount: fee.amount, note: `Planning card · ${fee.band}` },
        { id: "yard", label: "Yard and gate", amount: YARD_FEE, note: "Gate, environmental, pull-out" },
        { id: "doc", label: "Title handling", amount: DOC_FEE, note: "US paperwork and mailing" },
      ],
    },
    {
      id: "water",
      label: "Across the water",
      lines: [
        { id: "inland", label: "US truck to port", amount: yard.inland, note: yard.detail },
        {
          id: "ocean",
          label: "Ocean freight",
          amount: ocean,
          note: `${bodyShort(body)} to ${dest.city}`,
        },
        {
          id: "ins",
          label: "Cargo insurance",
          amount: insurance,
          note: `${(INSURANCE_RATE * 100).toFixed(1)}% before duty`,
        },
      ],
    },
    {
      id: "border",
      label: "At the border",
      note: `Dock value ${money(cif)}. Duty is charged on this, not on the hammer alone.`,
      lines: [
        {
          id: "duty",
          label: dest.dutyLabel,
          amount: duty,
          note: `${pct(dest.duty)} of dock value`,
        },
        { id: "port", label: "Port and handling", amount: dest.port, note: dest.city },
        { id: "broker", label: "Broker", amount: dest.broker, note: "Clearance desk" },
        {
          id: "vat",
          label: includeVat ? dest.vatLabel : `${dest.vatLabel} left off`,
          amount: vat,
          note: includeVat
            ? `${pct(dest.vat)} on dock value, duty, port, and broker`
            : "Turn this on if you cannot reclaim it",
        },
      ],
    },
  ];

  for (const group of groups) {
    group.total = group.lines.reduce((sum, line) => sum + line.amount, 0);
  }

  const landed = groups.reduce((sum, group) => sum + group.total, 0);

  return {
    dest,
    yard,
    hammer,
    fee,
    groups,
    cif,
    landed,
    repair: repairAmt,
    onRoad: landed + repairAmt,
    multiple: hammer > 0 ? landed / hammer : 0,
    includeVat,
    body,
  };
}

export function quoteLot(lot, destinationId, extras = {}) {
  return buildQuote({
    bid: lot.bid,
    body: lot.body,
    region: lot.region,
    destinationId,
    repair: extras.repair ?? 0,
    includeVat: extras.includeVat ?? true,
  });
}

const TEMA_FREIGHT = { sedan: 2200, suv: 2650, pickup: 2900, van: 2750 };
const TEMA_PORT = 380;

export function temaQuote(lot) {
  const fee = buyerFee(lot.bid);
  const yard = getRegion(lot.region);
  const ocean = TEMA_FREIGHT[lot.body] ?? TEMA_FREIGHT.sedan;
  const insurance = Math.round((lot.bid + fee.amount + yard.inland + ocean) * INSURANCE_RATE);
  const shipping = fee.amount + YARD_FEE + DOC_FEE + yard.inland + ocean + insurance;
  const cif = lot.bid + shipping;
  const duty = Math.round(cif * 0.1);
  const levies = Math.round(cif * 0.05);
  const vat = Math.round((cif + duty + levies) * 0.15);
  const taxes = duty + levies + vat + TEMA_PORT;
  return { bid: lot.bid, shipping, taxes, total: cif + taxes };
}
