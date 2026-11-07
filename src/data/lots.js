export const CARS = [
  {
    id: "landcruiser",
    make: "Toyota",
    model: "Land Cruiser",
    photo: "/work/landcruiser.jpg",
    blurb: "A large Toyota wagon. It can be pre-ordered from Japan.",
  },
  {
    id: "corolla",
    make: "Toyota",
    model: "Corolla",
    photo: "/work/corolla.jpg",
    blurb: "A Toyota sedan, ordered from Japan.",
  },
  {
    id: "prado",
    make: "Toyota",
    model: "Prado",
    photo: "/work/prado.jpg",
    blurb: "A Toyota wagon. It can be pre-ordered from Japan.",
  },
  {
    id: "vitz",
    make: "Toyota",
    model: "Vitz",
    photo: "/work/vitz.jpg",
    blurb: "A small Toyota hatchback. It can be pre-ordered from Japan.",
  },
  {
    id: "yaris",
    make: "Toyota",
    model: "Yaris",
    photo: "/work/yaris.jpg",
    blurb: "A small Toyota hatchback, ordered from Japan.",
  },
  {
    id: "voxy",
    make: "Toyota",
    model: "Voxy",
    photo: "/work/voxy.jpg",
    blurb: "A Toyota people-carrier. It can be pre-ordered from Japan.",
  },
  {
    id: "fit",
    make: "Honda",
    model: "Fit",
    photo: "/work/fit.jpg",
    blurb: "A Honda hatchback, ordered from Japan.",
  },
  {
    id: "note",
    make: "Nissan",
    model: "Note",
    photo: "/work/note.jpg",
    blurb: "A Nissan hatchback, ordered from Japan.",
  },
  {
    id: "swift",
    make: "Suzuki",
    model: "Swift",
    photo: "/work/swift.jpg",
    blurb: "A Suzuki hatchback, ordered from Japan.",
  },
];

export function getLot(id) {
  return CARS.find((car) => car.id === id) ?? null;
}

export function relatedLots(car) {
  return CARS.filter((item) => item.id !== car.id).slice(0, 3);
}

export function carName(car) {
  return `${car.make} ${car.model}`;
}
