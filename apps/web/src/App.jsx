import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import {
  AdminContentPage,
  AdminDashboardPage,
  AdminEnquiriesPage,
  AdminLayout,
  AdminLoginPage,
  AdminProductsPage
} from "./pages/admin-pages.jsx";
import {
  AboutPage,
  CatalogPage,
  ContactPage,
  HomePage,
  ProductDetailPage,
  PublicLayout,
  ServiceRequestPage
} from "./pages/public-pages.jsx";
import { Container, EmptyPanel } from "./components/ui.jsx";

const ADMIN_TOKEN_KEY = "mechnnovation_admin_token";

function NotFoundPage() {
  return (
    <Container className="py-20">
      <EmptyPanel title="Page not found" body="The page you are looking for does not exist." />
    </Container>
  );
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      return;
    }

    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/service-request" element={<ServiceRequestPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage token={token} onLogin={setToken} />} />
        <Route path="/admin" element={<AdminLayout token={token} onLogout={() => setToken("")} />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
