import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { ShopProvider } from "./context/ShopState";
import Home from "./pages/Home";
import Request from "./pages/Request";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cars" element={<Navigate to="/#japan-cars" replace />} />
            <Route path="cars/:id" element={<Navigate to="/#japan-cars" replace />} />
            <Route path="compare" element={<Navigate to="/#japan-cars" replace />} />
            <Route path="inventory" element={<Navigate to="/#japan-cars" replace />} />
            <Route path="lot/:id" element={<Navigate to="/#japan-cars" replace />} />
            <Route path="request" element={<Request />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  );
}
