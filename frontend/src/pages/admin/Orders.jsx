import { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [id, setId] = useState('')

  async function loadOne() {
    const res = await api.get(`/orders/${id}`)
    setOrders([res.data])
  }

  return (
    <div>
      <h2>Admin: Orders</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="Order ID" value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={loadOne}>Load Order</button>
      </div>
      <ul>
        {orders.map((o) => (
          <li key={o._id}>
            {o._id} — {o.status} — Total ${o.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  )
}


