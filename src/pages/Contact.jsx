import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { SHOP, whatsapp } from "../lib/shop";
import { useTitle } from "../lib/useTitle";

export default function Contact() {
  useTitle("Contact");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (name.length < 2) {
      setError("Add your name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      setError("Add a phone number we can call.");
      return;
    }
    if (message.length < 5) {
      setError("Tell us which car you want.");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <section className="page">
      <div className="wrap split">
        <div>
          <h1>Contact</h1>
          <p>
            {SHOP.owner} is the {SHOP.role.toLowerCase()} at {SHOP.name}.
          </p>
          <ul className="fact-list">
            <li>
              <Icon name="pin" />
              <span>{SHOP.address}</span>
            </li>
            <li>
              <Icon name="ship" />
              <span>Japanese cars from Japan, and right-hand drive converted to left-hand drive.</span>
            </li>
            <li>
              <Icon name="phone" />
              <a href={`tel:${SHOP.phoneTel}`}>{SHOP.phoneDisplay}</a>
            </li>
          </ul>
          <p>
            <Link to="/request">Request a car from Japan</Link>
          </p>
          <a className="btn" href={whatsapp(`Hello ${SHOP.owner}, I want to ask about a car.`)}>
            <Icon name="chat" />
            WhatsApp
          </a>
        </div>
        <form className="sheet contact-form" onSubmit={onSubmit}>
          {sent ? (
            <p>Thanks. This note stays in your browser. Call or WhatsApp us if you need a reply today.</p>
          ) : (
            <>
              <label>
                Name
                <input name="name" autoComplete="name" />
              </label>
              <label>
                Phone
                <input name="phone" autoComplete="tel" inputMode="tel" />
              </label>
              <label>
                Message
                <textarea name="message" rows={4} />
              </label>
              {error && <p className="err">{error}</p>}
              <button className="btn wide" type="submit">
                Send
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
