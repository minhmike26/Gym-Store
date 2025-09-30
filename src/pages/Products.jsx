import { Link } from 'react-router-dom';

export default function Products() {
  // Placeholder list
  const items = [
    { _id: '1', name: 'Whey Gold', price: 49.99 },
    { _id: '2', name: 'Whey Isolate', price: 59.99 },
  ];
  return (
    <>
      <h1>Products</h1>
      <ul>
        {items.map(p => (
          <li key={p._id}>
            <Link to={`/products/${p._id}`}>{p.name}</Link> - ${p.price}
          </li>
        ))}
      </ul>
    </>
  );
}