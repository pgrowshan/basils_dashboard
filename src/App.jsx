import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import CategoriesPage from "./admin/CategoriesPage";
import ProductsPage from "./admin/ProductsPage";
import OrdersPage from "./admin/OrdersPage";
import PromosPage from "./admin/PromosPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/promos" element={<PromosPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/categories" replace />} />
    </Routes>
  );
}

export default App;
