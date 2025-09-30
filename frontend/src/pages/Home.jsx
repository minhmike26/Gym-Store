import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function Home() {
  const [q, setQ] = useState('')
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products', { params: q ? { q } : undefined }).then((res) => setProducts(res.data))
  }, [q])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search whey, brand..."
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16, marginTop: 16 }}>
        {products.map((p) => (
          <div key={p._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            )}
            <h3 style={{ margin: '8px 0' }}>
              <Link to={`/product/${p.slug}`}>{p.name}</Link>
            </h3>
            <div style={{ color: '#666' }}>{p.brand}</div>
            <strong>${p.price?.toFixed(2)}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}


