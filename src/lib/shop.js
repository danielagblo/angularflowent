export const SHOP = {
  name: "Anguah Flow Enterprise",
  owner: "Steven Offei",
  role: "Boss",
  phoneDisplay: "+233 546 739 181",
  phoneTel: "+233546739181",
  wa: "233546739181",
  address: "Garage in Tema, Ghana",
};

export function whatsapp(text) {
  return `https://wa.me/${SHOP.wa}?text=${encodeURIComponent(text)}`;
}
