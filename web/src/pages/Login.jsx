import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch {
      setError('Fel email eller lösenord');
    }
  };

  return (
    <div style={styles.wrap}>
      <h2>Logga in</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={submit} style={styles.form}>
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="Lösenord" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit">Logga in</button>
      </form>
      <p>Inget konto? <Link to="/register">Registrera dig</Link></p>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 360, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  error: { color: 'red' },
};
