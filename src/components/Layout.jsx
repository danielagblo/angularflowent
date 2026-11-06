import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { SHOP, whatsapp } from "../lib/shop";

function WaAgent() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(false);
  const href = whatsapp(`Hello ${SHOP.owner}, I want to ask about a car.`);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const openAt = window.setTimeout(() => setOpen(true), reduce ? 0 : 600);
    const typeAt = window.setTimeout(() => setTyped(true), reduce ? 0 : 1600);
    return () => {
      window.clearTimeout(openAt);
      window.clearTimeout(typeAt);
    };
  }, []);

  return (
    <div className={`wa-agent${open ? " open" : ""}`}>
      {open && (
        <div className="wa-card" role="dialog" aria-label={`Message from ${SHOP.owner}`}>
          <div className="wa-card-head">
            <img src="/brand/steven.jpg" alt="" />
            <div>
              <strong>{SHOP.owner}</strong>
              <span>Consultant</span>
            </div>
            <button type="button" className="wa-close" aria-label="Close message" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div className="wa-card-body">
            {typed ? (
              <p>Hello. Tell me the car you want from Japan, and I will confirm it before you pay.</p>
            ) : (
              <p className="wa-typing" aria-label="Typing">
                <span />
                <span />
                <span />
              </p>
            )}
          </div>
          <a className="wa-go" href={href} target="_blank" rel="noopener noreferrer">
            Continue on WhatsApp
          </a>
        </div>
      )}
      <button
        type="button"
        className={`wa-float${open ? " quiet" : ""}`}
        aria-expanded={open}
        aria-label={open ? "Hide WhatsApp message" : "Open WhatsApp message"}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="whatsapp" size={30} />
      </button>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <>
      <header>
        <div className="wrap bar">
          <Link to="/" className="logo">
            <img src="/brand/mark.png" alt="" />
            <span>{SHOP.name}</span>
          </Link>
          <nav>
            <a href="/#japan-cars">Cars</a>
            <Link to="/request" className={pathname === "/request" ? "active" : undefined}>
              Request
            </Link>
            <Link to="/contact" className={pathname === "/contact" ? "active" : undefined}>
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <div className="wrap foot">
          <div>
            <strong>{SHOP.name}</strong>
            <ul className="foot-lines">
              <li>
                <Icon name="user" />
                <span>{SHOP.owner}, {SHOP.role.toLowerCase()}</span>
              </li>
              <li>
                <Icon name="pin" />
                <span>{SHOP.address}</span>
              </li>
              <li>
                <Icon name="phone" />
                <a href={`tel:${SHOP.phoneTel}`}>{SHOP.phoneDisplay}</a>
              </li>
            </ul>
          </div>
          <p className="fine">
            Japan orders are confirmed with the consultant before you pay. The price of a car is agreed then, not taken from a list.
          </p>
        </div>
      </footer>
      <WaAgent />
    </>
  );
}
