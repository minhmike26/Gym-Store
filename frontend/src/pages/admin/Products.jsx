import { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function AdminProducts() {
  const [token, setToken] = useState('')
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', slug: '', brand: '', price: 0, stock: 0 })

  async function load() {
    const res = await api.get('/products')
    setProducts(res.data)
  }

  async function create() {
    const res = await api.post('/products', form, { headers: { Authorization: `Bearer ${token}` } })
    setProducts([res.data, ...products])
  }

  async function remove(id) {
    await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    setProducts(products.filter((p) => p._id !== id))
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <h2>Admin: Products</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Admin JWT" value={token} onChange={(e) => setToken(e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
        <button onClick={create}>Create</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Brand</th>
            <th align="right">Price</th>
            <th align="right">Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td align="right">${p.price?.toFixed(2)}</td>
              <td align="right">{p.stock}</td>
              <td><button onClick={() => remove(p._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


