import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';
import AnimatedBackground from './components/AnimatedBackground';
import { CartProvider } from './contexts/CartContext';
import CartDrawer from './components/CartDrawer';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AnimatedBackground />
        <div className="min-h-screen flex flex-col bg-transparent relative z-0">
          <Navbar />
          <CartDrawer />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/order/:productId" element={<OrderPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
