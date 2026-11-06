import { Link } from "react-router-dom";
import { useShop } from "../context/ShopState";
import { carName, getLot } from "../data/lots";
import { whatsapp } from "../lib/shop";
import { useTitle } from "../lib/useTitle";

export default function Compare() {
  useTitle("Compare");
  const { compare, toggleCompare } = useShop();
  const cars = compare.map((id) => getLot(id)).filter(Boolean);
  const names = cars.map((car) => carName(car)).join(", ");

  return (
    <section className="page">
      <div className="wrap">
        <h1>Compare</h1>
        {cars.length < 2 ? (
          <p className="muted">Pick two or three cars from the list. Use Compare on a card.</p>
        ) : (
          <p className="muted">Side by side. The price is confirmed before you pay.</p>
        )}
        {cars.length >= 2 && (
          <p>
            <a className="btn" href={whatsapp(`Hello, I am comparing these cars: ${names}. Which one do you recommend?`)}>
              Ask about these on WhatsApp
            </a>
          </p>
        )}
        <div className="grid">
          {cars.map((car) => (
            <article key={car.id} className="sheet">
              <img src={car.photo} alt="" />
              <h2>
                <Link to={`/cars/${car.id}`}>{carName(car)}</Link>
              </h2>
              <p>{car.blurb}</p>
              <button type="button" className="btn ghost" onClick={() => toggleCompare(car.id)}>
                Remove
              </button>
            </article>
          ))}
        </div>
        {cars.length === 0 && (
          <Link className="btn" to="/cars">
            Browse cars
          </Link>
        )}
      </div>
    </section>
  );
}
