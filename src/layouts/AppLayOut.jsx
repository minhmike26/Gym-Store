import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
          borderBottom: "1px solid #eee",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/admin/login">Admin</Link>
        <span style={{ marginLeft: "auto" }} />
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
