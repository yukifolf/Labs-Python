import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role } from '../types'

const ROLE_BADGE: Record<Role, React.CSSProperties> = {
  admin:   { background: '#fee2e2', color: '#991b1b' },
  manager: { background: '#fef9c3', color: '#92400e' },
  driver:  { background: '#dcfce7', color: '#166534' },
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <span style={s.logo}>Fleet Management</span>
        <button onClick={handleLogout} style={s.logoutBtn}>Sign Out</button>
      </header>
      <main style={s.main}>
        <h1 style={s.heading}>Dashboard</h1>
        {user && (
          <div style={s.card}>
            <div style={s.row}>
              <span style={s.key}>Name</span>
              <span>{user.first_name} {user.last_name}</span>
            </div>
            <div style={s.row}>
              <span style={s.key}>Email</span>
              <span>{user.email}</span>
            </div>
            <div style={s.row}>
              <span style={s.key}>Role</span>
              <span style={{ ...s.badge, ...ROLE_BADGE[user.role] }}>{user.role}</span>
            </div>
            <div style={s.row}>
              <span style={s.key}>Member since</span>
              <span>{new Date(user.date_joined).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page:      { minHeight: '100vh', background: '#f5f5f5' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', height: 56, background: '#fff', borderBottom: '1px solid #e5e7eb' },
  logo:      { fontWeight: 700, fontSize: 16 },
  logoutBtn: { padding: '6px 14px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  main:      { maxWidth: 600, margin: '40px auto', padding: '0 16px' },
  heading:   { fontSize: 24, fontWeight: 700, marginBottom: 24 },
  card:      { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 },
  row:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 },
  key:       { color: '#6b7280', fontWeight: 600 },
  badge:     { padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' },
}
