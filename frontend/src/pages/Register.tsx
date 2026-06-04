import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { RegisterData, Role } from '../types'

export default function Register() {
  const [form, setForm] = useState<RegisterData>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'driver',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (field: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } }).response?.data
      setError(data ? Object.values(data).flat().join(' ') : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <form onSubmit={handleSubmit} style={s.card}>
        <h2 style={s.title}>Create Account</h2>
        {error && <p style={s.error}>{error}</p>}
        <label style={s.label}>Email</label>
        <input type="email" value={form.email} onChange={set('email')} style={s.input} required autoFocus />
        <label style={s.label}>First name</label>
        <input type="text" value={form.first_name} onChange={set('first_name')} style={s.input} required />
        <label style={s.label}>Last name</label>
        <input type="text" value={form.last_name} onChange={set('last_name')} style={s.input} required />
        <label style={s.label}>Password</label>
        <input type="password" value={form.password} onChange={set('password')} style={s.input} required minLength={8} />
        <label style={s.label}>Role</label>
        <select value={form.role} onChange={set('role')} style={s.input}>
          {(['driver', 'manager', 'admin'] as Role[]).map(r => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>
        <button type="submit" style={s.btn} disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </button>
        <p style={s.footer}>
          Have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page:   { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 20 },
  card:   { display: 'flex', flexDirection: 'column', gap: 10, width: 340, padding: 32, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,.06)' },
  title:  { marginBottom: 8, fontSize: 22, fontWeight: 700 },
  label:  { fontSize: 13, fontWeight: 600, color: '#374151' },
  input:  { padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, outline: 'none' },
  btn:    { marginTop: 6, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  error:  { color: '#dc2626', fontSize: 13, margin: 0 },
  footer: { textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 4 },
}
