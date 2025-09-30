import { useState } from 'react'
import api from '../lib/api'

export default function Checkout() {
  const [orderId, setOrderId] = useState('')
  const [url, setUrl] = useState('')

  async function createPayment() {
    const res = await api.post('/payments/vnpay/create', { orderId })
    setUrl(res.data.url)
  }

  return (
    <div>
      <h2>Checkout (Demo)</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        <button onClick={createPayment}>Create VNPAY Payment</button>
      </div>
      {url && (
        <p>
          Payment URL: <a href={url} target="_blank" rel="noreferrer">Open</a>
        </p>
      )}
    </div>
  )
}


