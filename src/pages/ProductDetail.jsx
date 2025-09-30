import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  return (
    <>
      <h1>Product Detail</h1>
      <p>Product ID: {id}</p>
      <button>Add to Cart</button>
      <p><Link to="/products">Back to Products</Link></p>
    </>
  );
}