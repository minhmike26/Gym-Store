import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminUsers from './pages/admin/Users'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'

export default function App() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <h1 style={{ marginRight: 'auto' }}>
          <Link to="/">Gym Store</Link>
        </h1>
        <Link to="/cart">Cart</Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/admin/products">Admin</Link>
      </header>
      <main style={{ marginTop: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/admin">
            <Route index element={<Navigate to="products" replace />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}


