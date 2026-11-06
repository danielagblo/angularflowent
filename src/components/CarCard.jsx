import { useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopState";
import { carName } from "../data/lots";

export default function CarCard({ lot }) {
  const [failed, setFailed] = useState(false);
  const { isSaved, toggleSaved, inCompare, toggleCompare } = useShop();
  const name = carName(lot);
  const saved = isSaved(lot.id);
  const picked = inCompare(lot.id);

  return (
    <article className="card">
      <div className="photo-wrap">
        <Link to={`/cars/${lot.id}`}>
          {failed ? (
            <div className="photo fallback">
              {name}
            </div>
          ) : (
            <img src={lot.photo} alt={name} onError={() => setFailed(true)} />
          )}
        </Link>
        <button
          type="button"
          className={saved ? "save on" : "save"}
          aria-pressed={saved}
          onClick={() => toggleSaved(lot.id)}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <div>
        <h3>
          <Link to={`/cars/${lot.id}`}>{name}</Link>
        </h3>
        <p className="muted">{lot.blurb}</p>
        <p className="price">
          Price confirmed before you pay
        </p>
        <button type="button" className={picked ? "text-btn on" : "text-btn"} onClick={() => toggleCompare(lot.id)}>
          {picked ? "In compare" : "Compare"}
        </button>
      </div>
    </article>
  );
}
