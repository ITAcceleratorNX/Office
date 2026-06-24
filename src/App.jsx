import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { setNavigate } from "./navigation";
import { ScrollRestoration } from "./ScrollRestoration.jsx";
import { I18nProvider } from "./i18n/I18nContext.jsx";
import { Header, Footer, WhatsAppFloat } from "./components/ui-core";
import { Home, Catalog, ObjectPage, ThankYou } from "./pages";

function NavigateBridge() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return null;
}

function ObjectRoute() {
  const { slug } = useParams();
  return <ObjectPage slug={slug} />;
}

function AppShell({ children, overlay = true }) {
  return (
    <>
      <Header overlay={overlay} />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <NavigateBridge />
        <ScrollRestoration />
        <Routes>
          <Route path="/" element={<AppShell><Home /></AppShell>} />
          <Route path="/catalog" element={<AppShell overlay={false}><Catalog /></AppShell>} />
          <Route path="/objects/:slug" element={<AppShell overlay={false}><ObjectRoute /></AppShell>} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
