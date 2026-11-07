import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import CarCard from "../components/CarCard";
import { useShop } from "../context/ShopState";
import { carName, getLot, relatedLots } from "../data/lots";
import { SHOP, whatsapp } from "../lib/shop";
import { useTitle } from "../lib/useTitle";
import NotFound from "./NotFound";

export default function Car() {
  const { id } = useParams();
  const lot = getLot(id);
  const name = lot ? carName(lot) : "";
  useTitle(lot ? name : "Not found");
  const { isSaved, toggleSaved, inCompare, toggleCompare } = useShop();
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!lot) return <NotFound />;

  const saved = isSaved(lot.id);
  const message = `Hello ${SHOP.name}, I would like to order a ${name} from Japan.`;

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="page">
      <div className="wrap">
        <p className="crumb">
          <Link to="/cars">Cars</Link>
        </p>
        <div className="split">
          <div>
            <h1>{name}</h1>
            <p className="muted">{lot.blurb}</p>
            {failed ? (
              <div className="photo fallback large">{name}</div>
            ) : (
              <img className="hero-photo" src={lot.photo} alt={name} onError={() => setFailed(true)} />
            )}
            <p>
              {SHOP.name} confirms the car and the price before you pay. The start is 40%, and the rest is paid at the garage in Tema. If the car arrives as right-hand drive, the garage can move the steering.
            </p>
          </div>
          <aside className="sheet">
            <p className="muted">Order from Japan</p>
            <p className="total">Ask for the price</p>
            <a className="btn wide" href={whatsapp(message)}>
              Ask on WhatsApp
            </a>
            <div className="row-btns">
              <button type="button" className="btn ghost" onClick={() => toggleSaved(lot.id)}>
                {saved ? "Saved" : "Save"}
              </button>
              <button type="button" className="btn ghost" onClick={() => toggleCompare(lot.id)}>
                {inCompare(lot.id) ? "In compare" : "Compare"}
              </button>
              <button type="button" className="btn ghost" onClick={onShare}>
                {copied ? "Copied" : "Share"}
              </button>
            </div>
          </aside>
        </div>
        <h2>Other cars</h2>
        <div className="grid three">
          {relatedLots(lot).map((item) => (
            <CarCard key={item.id} lot={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
