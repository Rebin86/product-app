import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

export default function App() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}

