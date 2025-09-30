import { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function AdminUsers() {
  const [token, setToken] = useState('')
  const [users, setUsers] = useState([])

  async function load() {
    const res = await api.get('/users', { headers: { Authorization: `Bearer ${token}` } })
    setUsers(res.data)
  }

  return (
    <div>
      <h2>Admin: Users</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Admin JWT" value={token} onChange={(e) => setToken(e.target.value)} />
        <button onClick={load}>Load</button>
      </div>
      <ul>
        {users.map((u) => (
          <li key={u._id}>{u.name} - {u.email} {u.isAdmin ? '(Admin)' : ''}</li>
        ))}
      </ul>
    </div>
  )
}


