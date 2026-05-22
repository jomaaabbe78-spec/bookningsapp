import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', type: 'frisör' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch {
      setError('Kunde inte registrera. Email kanske redan används.');
    }
  };

  return (
    <div style={styles.wrap}>
      <h2>Registrera företag</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={submit} style={styles.form}>
        <input placeholder="Företagsnamn" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="Lösenord" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
          <option value="frisör">Frisör</option>
          <option value="städbolag">Städbolag</option>
          <option value="annat">Annat</option>
        </select>
        <button type="submit">Registrera</button>
      </form>
      <p>Har du konto? <Link to="/login">Logga in</Link></p>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 360, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  error: { color: 'red' },
};
