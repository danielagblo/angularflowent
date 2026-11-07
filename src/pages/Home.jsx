import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Flags from "../components/Flags";
import Icon from "../components/Icon";
import { CARS, carName } from "../data/lots";
import { SHOP, whatsapp } from "../lib/shop";
import { useTitle } from "../lib/useTitle";

const PORTS = [
  { type: "video", src: "/work/cover.mp4", alt: "Cover video" },
  { src: "/port/trailer.jpg", alt: "Several vehicles loaded on a car-carrier trailer", position: "62% center" },
  { src: "/work/tema-ships.jpg", alt: "Ships berthed at Tema harbour", position: "center top" },
  { src: "/work/tema-tanker.jpg", alt: "A tanker alongside at Tema harbour", position: "74% 16%" },
  { src: "/tema-port.jpg", alt: "Container cranes at Tema harbour, seen from the shore", position: "center 36%" },
  { src: "/work/tema-night.jpg", alt: "The container terminal at Tema at night", position: "center" },
  { src: "/work/dash.jpg", alt: "A man working inside a car beside the steering wheel", position: "center 18%" },
];

const SERVICES = [
  {
    icon: "car",
    title: "The car is chosen in Japan",
    text: "Toyota, Nissan, Honda, Mazda, and Suzuki. A Toyota Voxy or a Toyota Vitz can be named in advance. Steven Offei selects the car and arranges the purchase, then confirms it with you before any money is paid.",
  },
  {
    icon: "ship",
    title: "Tema gets the car, and you can see it first",
    text: "Forty percent starts the order. The other sixty percent is paid at the garage when the car arrives. Visit before that balance. The handover happens in Tema, with Steven.",
  },
  {
    icon: "wrench",
    title: "Right-hand drive is rebuilt for the left",
    text: "The garage moves the steering, the controls, the wiring, and the interior. Dashboards are sold from the same desk. This is the work the workshop is built around.",
  },
];

const PLACEHOLDERS = [
  { name: "Daniel Agblo", rating: 5, text: "The car I named was bought in Japan and handed over in Tema. Clear from the first call." },
  { name: "Ruth Biney", rating: 5, text: "I paid 40% to start and the rest at the garage, after I had seen the car." },
  { name: "Samuel Koomson", rating: 4, text: "The steering, controls, and dashboard were moved to the left. The car was ready when I visited." },
  { name: "Jasmine Dolon", rating: 5, text: "I named a Vitz. It was arranged in Japan and I collected it at the garage in Tema." },
  { name: "Emmanuel Baiden", rating: 4, text: "Shipping was explained before I paid. The car arrived, and I saw it before the balance." },
  { name: "Ben Asinu", rating: 5, text: "The workshop moved the steering to the left and fitted the interior. I dealt with Steven directly." },
];

function Stars({ count }) {
  return (
    <span className="stars" aria-label={`${count} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" aria-hidden="true" className={index < count ? "on" : undefined}>
          <path d="M10 1.6 12.5 7l5.7.5-4.3 3.7 1.4 5.5L10 13.7 4.7 16.7l1.4-5.5L1.8 7.5 7.5 7z" />
        </svg>
      ))}
    </span>
  );
}

function PortHero() {
  const frame = useRef(null);
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [shift, setShift] = useState(0);
  const [sound, setSound] = useState(true);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    let tick = 0;
    let origin = null;
    function onScroll() {
      window.cancelAnimationFrame(tick);
      tick = window.requestAnimationFrame(() => {
        const el = frame.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (origin == null) origin = top;
        const moved = origin - top;
        setShift(Math.max(-80, Math.min(80, moved * 0.35)));
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(tick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    if (PORTS[index]?.type !== "video") {
      video.pause();
      return undefined;
    }
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    setSound(true);
    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        video.muted = true;
        setSound(false);
        video.play().catch(() => {});
      });
    }
    return undefined;
  }, [index]);

  useEffect(() => {
    const hero = frame.current;
    const video = videoRef.current;
    if (!hero || !video) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (PORTS[index]?.type !== "video") return;
      if (document.fullscreenElement || document.webkitFullscreenElement) return;
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.45;
      if (visible) {
        if (!video.ended) video.play().catch(() => {});
        return;
      }
      video.pause();
    }, { threshold: [0, 0.45, 0.75] });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    function onFull() {
      setFull(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFull);
    document.addEventListener("webkitfullscreenchange", onFull);
    return () => {
      document.removeEventListener("fullscreenchange", onFull);
      document.removeEventListener("webkitfullscreenchange", onFull);
    };
  }, []);

  useEffect(() => {
    if (paused || PORTS[index]?.type === "video") return undefined;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % PORTS.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused, index]);

  function go(next) {
    setIndex((next + PORTS.length) % PORTS.length);
  }

  function openFull(event) {
    if (event.target.closest(".cover-tools")) return;
    const box = event.currentTarget;
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    const request = box.requestFullscreen || box.webkitRequestFullscreen;
    if (request) {
      Promise.resolve(request.call(box)).catch(() => {});
      return;
    }
    const video = videoRef.current;
    if (video && video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  }

  function closeFull(event) {
    event.stopPropagation();
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) Promise.resolve(exit.call(document)).catch(() => {});
  }

  function toggleSound(event) {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) video.volume = 1;
    setSound(!video.muted);
    video.play().catch(() => {});
  }

  return (
    <section
      ref={frame}
      className="port-hero"
      aria-roledescription="carousel"
      aria-label="Cover"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {PORTS.map((item, i) => (
        item.type === "video" ? (
          <div
            key={item.src}
            className={`cover-video${i === index ? " on" : ""}`}
            onClick={openFull}
          >
            <video
              ref={videoRef}
              src={item.src}
              style={{ transform: full ? "none" : `translate3d(0, ${shift}px, 0) scale(1.16)` }}
              playsInline
              autoPlay
              preload="auto"
              onCanPlay={(event) => {
                const video = event.currentTarget;
                if (index !== i || !video.paused) return;
                video.muted = false;
                video.volume = 1;
                video.play().catch(() => {});
              }}
              aria-label={item.alt}
              onEnded={() => {
                if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                setIndex((current) => (current + 1) % PORTS.length);
              }}
            />
            {i === index && (
              <div className="cover-tools">
                {full && (
                  <button type="button" onClick={closeFull}>
                    Back
                  </button>
                )}
                <button type="button" onClick={toggleSound}>
                  {sound ? "Mute" : "Unmute"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <img
            key={item.src}
            src={item.src}
            alt={i === index ? item.alt : ""}
            className={i === index ? "on" : undefined}
            style={{ objectPosition: item.position, transform: `translate3d(0, ${shift}px, 0) scale(1.16)` }}
            aria-hidden={i === index ? undefined : true}
          />
        )
      ))}
      <button type="button" className="port-nav prev" aria-label="Previous photo" onClick={() => go(index - 1)}>
        <Icon name="left" />
      </button>
      <button type="button" className="port-nav next" aria-label="Next photo" onClick={() => go(index + 1)}>
        <Icon name="right" />
      </button>
      <div className="port-dots">
        {PORTS.map((item, i) => (
          <button
            key={item.src}
            type="button"
            className={i === index ? "on" : undefined}
            aria-label={item.type === "video" ? "Show video" : `Show photo ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  useTitle(null);
  const hello = whatsapp(`Hello ${SHOP.owner}, I would like to speak about a car from Japan.`);

  return (
    <>
      <section className="ceo">
        <div className="wrap ceo-row">
          <img className="ceo-photo" src="/brand/steven.jpg" alt={SHOP.owner} />
          <div className="ceo-copy">
            <p className="eyebrow">Consultancy</p>
            <h1>{SHOP.owner}</h1>
            <p>Founder and consultant at {SHOP.name}. The advice, the Japan purchase, and the Tema handover sit on his desk.</p>
            <ul className="ceo-meta">
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
          <a className="btn" href={hello}>
            <Icon name="chat" />
            Speak with {SHOP.owner}
          </a>
        </div>
      </section>

      <PortHero />

      <section className="firm-block alt">
        <div className="wrap">
          <p className="eyebrow">Services</p>
          <h2>The consultancy handles the whole job</h2>
          <p className="lede">
            {SHOP.owner} buys the car in Japan, brings it to Tema, and, when you need it, turns a right-hand-drive car into a left-hand-drive car.
          </p>
          <div className="firm-history">
            {SERVICES.map((item, index) => (
              <article key={item.title} className={["teal", "amber", "coral"][index]}>
                <span className="mark"><Icon name={item.icon} /></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="firm-block wash" id="japan-cars">
        <div className="wrap">
          <p className="eyebrow">From Japan</p>
          <h2>Cars we can outsource</h2>
          <p className="lede">
            {SHOP.owner} can arrange these models from Japan. He confirms the car and the price before you pay.
          </p>
          <div className="grid three">
            {CARS.map((car) => {
              const name = carName(car);
              return (
                <article className="card" key={car.id}>
                  <img src={car.photo} alt={name} />
                  <div>
                    <h3>{name}</h3>
                    <p className="muted">{car.blurb}</p>
                    <a href={whatsapp(`Hello ${SHOP.owner}, I would like to outsource a ${name} from Japan.`)}>
                      Ask about this car
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="firm-block">
        <div className="wrap firm-split">
          <div>
            <p className="eyebrow">Founder</p>
            <h2>{SHOP.owner}</h2>
          </div>
          <div className="firm-prose">
            <p>
              {SHOP.owner} is the founder of {SHOP.name} and the consultant clients deal with. He works from the garage in Tema.
            </p>
            <p>
              His work is the import itself: choosing the car in Japan, arranging the shipping, and handing the car over in Tema. When a car arrives as right-hand drive, the garage converts the dashboard to left-hand drive under his desk.
            </p>
            <p>
              Clients reach him directly on {SHOP.phoneDisplay}. A car that is not already in discussion can be requested, with a photo, on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="firm-block alt">
        <div className="wrap">
          <p className="eyebrow">Company</p>
          <h2>A Tema consultancy for cars from Japan</h2>
          <ol className="route">
            <li className="route-origins">
              <Flags />
            </li>
            <li className="route-line" aria-hidden="true" />
            <li>
              <span className="mark"><Icon name="ship" /></span>
              <span>Shipped by sea</span>
            </li>
            <li className="route-line" aria-hidden="true" />
            <li>
              <span className="mark"><Icon name="pin" /></span>
              <span>Collected in Tema</span>
            </li>
          </ol>
          <div className="firm-history">
            <article className="teal">
              <span className="mark"><Icon name="desk" /></span>
              <h3>The desk</h3>
              <p>
                {SHOP.name} is the consultancy clients deal with. Each order is confirmed with {SHOP.owner} before money is paid. The desk is at the garage in Tema.
              </p>
            </article>
            <article className="amber">
              <span className="mark"><Icon name="ship" /></span>
              <h3>The route</h3>
              <p>
                Cars are bought in Japan and brought to Tema. The published terms are 40% before the car arrives, and 60% at the garage.
              </p>
            </article>
            <article className="coral">
              <span className="mark"><Icon name="wrench" /></span>
              <h3>The workshop</h3>
              <p>
                The speciality at the garage is correcting a dashboard from the right side to the left: steering, controls, wiring, and the interior. Clients may visit before they pay.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="firm-block warm">
        <div className="wrap">
          <p className="eyebrow">Placeholder</p>
          <h2>Reviews</h2>
          <p className="lede">
            Sample lines for this test layout. These are not reviews from clients.
          </p>
          <div className="review-grid">
            {PLACEHOLDERS.map((item) => (
              <article key={item.name}>
                <Stars count={item.rating} />
                <p>{item.text}</p>
                <h3>{item.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="firm-block alt">
        <div className="wrap firm-close">
          <div>
            <h2>Speak with the founder</h2>
            <p>
              {SHOP.owner}, {SHOP.address}. {SHOP.phoneDisplay}.
            </p>
          </div>
          <div className="home-links">
            <a className="btn" href={hello}>
              <Icon name="chat" />
              WhatsApp
            </a>
            <Link className="btn ghost" to="/request">
              <Icon name="car" />
              Request a car
            </Link>
          </div>
        </div>
        <p className="wrap fine">
          Harbour photographs by Ibrahim Achiri, CC BY-SA 4.0, and SteKrueBe, CC BY-SA 3.0, via Wikimedia Commons.
        </p>
      </section>
    </>
  );
}
