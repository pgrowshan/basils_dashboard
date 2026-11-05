import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import HomePage from "./admin/HomePage";
import CategoriesPage from "./admin/CategoriesPage";
import ProductsPage from "./admin/ProductsPage";
import OrdersPage from "./admin/OrdersPage";
import PromosPage from "./admin/PromosPage";
import SpecialOfferPage from "./admin/SpecialOfferPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/promos" element={<PromosPage />} />
        <Route path="/special-offer" element={<SpecialOfferPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
