import { Link, useSearchParams } from "react-router-dom";
import CarCard from "../components/CarCard";
import { useShop } from "../context/ShopState";
import { CARS } from "../data/lots";
import { SHOP } from "../lib/shop";
import { useTitle } from "../lib/useTitle";

export default function Cars() {
  useTitle("Cars");
  const [params] = useSearchParams();
  const { saved } = useShop();
  const savedOnly = params.get("saved") === "1";
  const cars = savedOnly ? CARS.filter((car) => saved.includes(car.id)) : CARS;

  return (
    <section className="page">
      <div className="wrap">
        <h1>{savedOnly ? "Saved cars" : "Cars"}</h1>
        <p className="muted intro">
          Six models ordered from Japan. {SHOP.name} confirms the car and the price before you pay.
        </p>
        {cars.length === 0 ? (
          <p>
            You have not saved a car yet. <Link to="/cars">See the cars</Link>
          </p>
        ) : (
          <div className="grid three">
            {cars.map((car) => (
              <CarCard key={car.id} lot={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
