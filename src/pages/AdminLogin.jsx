export default function AdminLogin() {
    return (
      <>
        <h1>Admin Login</h1>
        <form style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
          <input placeholder="Email" />
          <input placeholder="Password" type="password" />
          <button type="button">Login</button>
        </form>
      </>
    );
  }