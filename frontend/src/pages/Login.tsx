import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <form onSubmit={handleSubmit} style={s.card}>
        <h2 style={s.title}>Sign In</h2>
        {error && <p style={s.error}>{error}</p>}
        <label style={s.label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={s.input}
          required
          autoFocus
        />
        <label style={s.label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={s.input}
          required
        />
        <button type="submit" style={s.btn} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <p style={s.footer}>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page:   { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  card:   { display: 'flex', flexDirection: 'column', gap: 10, width: 340, padding: 32, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,.06)' },
  title:  { marginBottom: 8, fontSize: 22, fontWeight: 700 },
  label:  { fontSize: 13, fontWeight: 600, color: '#374151' },
  input:  { padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, outline: 'none' },
  btn:    { marginTop: 6, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  error:  { color: '#dc2626', fontSize: 13, margin: 0 },
  footer: { textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 4 },
}
