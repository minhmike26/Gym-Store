import { Link } from 'react-router-dom';

export default function Cart() {
  return (
    <>
      <h1>Cart</h1>
      <p>No items yet.</p>
      <Link to="/checkout">Go to Checkout</Link>
    </>
  );
}