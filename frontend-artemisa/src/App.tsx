// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { AuthProvider } from './context/AuthContext';
import { ProductDetail } from './pages/ProductDetail';
import { CartProvider } from './context/CartContext';
import { CartPage } from './pages/CartPage';
import { AdminGuard } from './components/Admi/AdminGuard';
import { AdminLayout } from './components/Admi/AdminLayout' // Importamos el nuevo Layout
import { AdminDashboard } from './pages/admi/AdminDashboard';
import { CreateProductPage } from './pages/admi/CreateProductPage';
import { AdminProductsPage } from './pages/admi/AdminProductsPage';
import { UpdateProductPage } from './pages/admi/UpdateProductPage';
import { AdminCategoriesPage } from './pages/admi/AdminCategoriesPage';
import { AdminOffersPage } from './pages/admi/AdminOffersPage';
import { AdminBannersPage } from './pages/admi/AdminBannersPage';
import { Checkout } from './pages/Checkout';
import { AdminOrders } from './pages/admi/AdminOrders';
import { Faq } from './pages/Faq';
import { Footer } from './components/Footer';
import ScrollToTop from './ScrollToTop';

// Un sub-componente rápido para envolver las páginas del admin dentro de su estructura visual
const AdminLayoutWrapper = () => {
  return (
    <AdminLayout>
      <Outlet /> {/* Aquí se renderizarán dinámicamente AdminDashboard, CreateProductPage, etc. */}
    </AdminLayout>
  );
};

// Un sub-componente para las páginas públicas que SÍ llevan el Header común
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            
            {/* GRUPO DE RUTAS PÚBLICAS (Llevan el Header tradicional) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/productos/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/ayuda" element={<Faq />} />
              <Route path="/checkout" element={<Checkout />} />

            </Route>

            {/* GRUPO DE RUTAS DE ADMINISTRACIÓN (Protegidas y con Sidebar propio) */}
            <Route element={<AdminGuard />}>
              <Route element={<AdminLayoutWrapper />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/productos" element={<AdminProductsPage />} />
                <Route path="/admin/productos/nuevo" element={<CreateProductPage />} />
                <Route path="/admin/productos/editar/:id" element={<UpdateProductPage />} />
                <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
                <Route path="/admin/ordenes" element={<AdminOrders />} />
                <Route path="/admin/ofertas" element={<AdminOffersPage />} />
                <Route path="/admin/banners" element={<AdminBannersPage />} />
              </Route>
            </Route>

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;