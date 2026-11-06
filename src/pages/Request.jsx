import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useShop } from "../context/ShopState";
import { SHOP, whatsapp } from "../lib/shop";
import { useTitle } from "../lib/useTitle";

function carMessage({ name, phone, year, make, model, budget, currency, notes, hasPhoto }) {
  const lines = [
    `Car request for ${SHOP.owner}, ${SHOP.name}`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Car: ${[year, make, model].filter(Boolean).join(" ")}`,
  ];
  if (budget) lines.push(`Budget: ${budget} ${currency}`);
  if (notes) lines.push(`Notes: ${notes}`);
  if (hasPhoto) lines.push("I have a photo of the car and will send it in this chat.");
  return lines.join("\n");
}

export default function Request() {
  useTitle("Request a car");
  const [params] = useSearchParams();
  const { currency } = useShop();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onPhoto(event) {
    const file = event.target.files?.[0];
    setNotice("");
    if (preview) URL.revokeObjectURL(preview);
    if (!file) {
      setPreview("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Choose a photo, not another kind of file.");
      event.target.value = "";
      setPreview("");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Use a photo under 12 MB.");
      event.target.value = "";
      setPreview("");
      return;
    }
    setError("");
    setPreview(URL.createObjectURL(file));
  }

  function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const year = String(data.get("year") || "").trim();
    const make = String(data.get("make") || "").trim();
    const model = String(data.get("model") || "").trim();
    const budget = String(data.get("budget") || "").trim();
    const notes = String(data.get("notes") || "").trim();
    const file = form.photo.files?.[0] || null;

    if (name.length < 2) {
      setError("Add your name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      setError("Add a phone number we can reach.");
      return;
    }
    if (make.length < 2 || model.length < 1) {
      setError("Add the make and model you want.");
      return;
    }
    setError("");

    const text = carMessage({
      name,
      phone,
      year,
      make,
      model,
      budget,
      currency,
      notes,
      hasPhoto: Boolean(file),
    });
    const href = whatsapp(`Hello ${SHOP.owner},\n\n${text}`);
    const opened = window.open(href, "_blank");
    if (opened) opened.opener = null;
    else window.location.assign(href);
    setNotice(
      file
        ? `Your details are in ${SHOP.owner}'s WhatsApp. Add the photo in that chat.`
        : `Your details are in ${SHOP.owner}'s WhatsApp.`,
    );
  }

  return (
    <section className="page request-page">
      <div className="wrap request-layout">
        <div>
          <p className="eyebrow">Request</p>
          <h1>Request a car</h1>
          <p className="lede">
            Name the Japanese car you want. The details go to {SHOP.owner} at {SHOP.name}. On a phone, the photo can go with them.
          </p>
        </div>
        <form className="sheet" onSubmit={onSubmit}>
          <label>
            Your name
            <input name="name" autoComplete="name" />
          </label>
          <label>
            Your phone
            <input name="phone" autoComplete="tel" inputMode="tel" />
          </label>
          <div className="form-grid">
            <label>
              Year
              <input name="year" inputMode="numeric" placeholder="2019" defaultValue={params.get("year") || ""} />
            </label>
            <label>
              Make
              <input name="make" placeholder="Toyota" defaultValue={params.get("make") || ""} />
            </label>
            <label>
              Model
              <input name="model" placeholder="Voxy" defaultValue={params.get("model") || ""} />
            </label>
          </div>
          <label>
            Budget in {currency}
            <input name="budget" inputMode="decimal" placeholder="Optional" defaultValue={params.get("budget") || ""} />
          </label>
          <label>
            Notes
            <textarea name="notes" rows={3} placeholder="Colour, or where you saw it" defaultValue={params.get("body") ? `Body: ${params.get("body")}` : ""} />
          </label>
          <label>
            Photo
            <input name="photo" type="file" accept="image/*" onChange={onPhoto} />
          </label>
          {preview && <img className="preview" src={preview} alt="The car you want to send" />}
          {error && <p className="err">{error}</p>}
          {notice && <p className="fine">{notice}</p>}
          <button className="btn wide" type="submit">
            Send request
          </button>
        </form>
      </div>
    </section>
  );
}
