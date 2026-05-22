import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [company, setCompany] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', duration_minutes: 60, price: '' });
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get('/companies/me').then(r => {
      setCompany(r.data);
      api.get(`/services/${r.data.id}`).then(s => setServices(s.data));
    }).catch(() => nav('/login'));
    api.get('/bookings/mine').then(r => setBookings(r.data));

    // Markera som prenumererad om Stripe redirect
    if (new URLSearchParams(location.search).get('subscribed') === 'true') {
      api.put('/companies/me/subscribed').catch(() => {});
    }
  }, []);

  const subscribe = async () => {
    const { data } = await api.post('/payments/subscribe');
    window.location.href = data.url;
  };

  const addService = async e => {
    e.preventDefault();
    const { data } = await api.post('/services', newService);
    setServices([...services, data]);
    setNewService({ name: '', duration_minutes: 60, price: '' });
  };

  const deleteService = async id => {
    await api.delete(`/services/${id}`);
    setServices(services.filter(s => s.id !== id));
  };

  const logout = () => { localStorage.removeItem('token'); nav('/login'); };

  if (!company) return <p style={{ textAlign: 'center', marginTop: 80 }}>Laddar...</p>;

  // Ej prenumererad — visa låst vy
  if (!company.subscribed) return (
    <div style={styles.gate}>
      <h2>Välkommen, {company.name}!</h2>
      <p>Du behöver en aktiv prenumeration för att använda tjänsten.</p>
      <button style={styles.bigBtn} onClick={subscribe}>Starta prenumeration — 499 kr/mån</button>
    </div>
  );

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => nav(-1)}>← Tillbaka</button>
          <button onClick={() => nav(1)}>Fram →</button>
        </div>
        <h2 style={{ margin: 0 }}>{company.name} — {company.type}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => window.open(`/book/${company.id}`)}>Bokningslänk</button>
          <button onClick={logout}>Logga ut</button>
        </div>
      </div>

      <h3>Tjänster</h3>
      <form onSubmit={addService} style={styles.row}>
        <input placeholder="Tjänstnamn" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} required />
        <input placeholder="Minuter" type="number" value={newService.duration_minutes} onChange={e => setNewService({...newService, duration_minutes: +e.target.value})} required />
        <input placeholder="Pris (kr)" type="number" value={newService.price} onChange={e => setNewService({...newService, price: +e.target.value})} required />
        <button type="submit">Lägg till</button>
      </form>
      {services.map(s => (
        <div key={s.id} style={styles.card}>
          <span>{s.name} — {s.duration_minutes} min — {s.price} kr</span>
          <button onClick={() => deleteService(s.id)}>Ta bort</button>
        </div>
      ))}

      <h3>Bokningar</h3>
      {bookings.length === 0 && <p>Inga bokningar ännu.</p>}
      {bookings.map(b => (
        <div key={b.id} style={styles.card}>
          <span>{b.customer_name} — {new Date(b.start_time).toLocaleString('sv-SE')}</span>
          <span>{b.customer_email} | {b.customer_phone}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 800, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  row: { display: 'flex', gap: 8, marginBottom: 16 },
  card: { display: 'flex', justifyContent: 'space-between', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, marginBottom: 8 },
  gate: { maxWidth: 400, margin: '120px auto', textAlign: 'center', fontFamily: 'sans-serif' },
  bigBtn: { marginTop: 16, padding: '12px 24px', background: '#635bff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' },
};
