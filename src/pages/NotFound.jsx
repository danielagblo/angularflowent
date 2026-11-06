import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle";

export default function NotFound() {
  useTitle("Not found");
  return (
    <section className="page">
      <div className="wrap">
        <h1>That page is not here.</h1>
        <p className="muted">The page you asked for is not on this site.</p>
        <Link className="btn" to="/">
          Back to the homepage
        </Link>
      </div>
    </section>
  );
}
