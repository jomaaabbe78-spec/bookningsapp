import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function BookingPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [services, setServices] = useState([]);
  const [takenSlots, setTakenSlots] = useState([]);
  const [form, setForm] = useState({ service_id: '', customer_name: '', customer_email: '', customer_phone: '', start_time: '' });
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get('/companies').then(r => setCompany(r.data.find(c => c.id === companyId)));
    api.get(`/services/${companyId}`).then(r => { setServices(r.data); if (r.data[0]) setForm(f => ({...f, service_id: r.data[0].id})); });
    api.get(`/bookings/taken/${companyId}`).then(r => setTakenSlots(r.data));
  }, [companyId]);

  const selectedService = services.find(s => s.id === form.service_id);

  const submit = async e => {
    e.preventDefault();
    const start = new Date(form.start_time);
    const end = new Date(start.getTime() + (selectedService?.duration_minutes || 60) * 60000);
    const { data } = await api.post('/bookings', { ...form, company_id: companyId, start_time: start, end_time: end });
    if (selectedService?.price > 0) {
      const pay = await api.post('/payments/checkout', { booking_id: data.id, amount: selectedService.price, service_name: selectedService.name });
      window.location.href = pay.data.url;
    } else {
      setDone(true);
    }
  };

  if (done) return <div style={styles.wrap}><h2>✅ Bokning bekräftad!</h2></div>;
  if (!company) return <p>Laddar...</p>;

  return (
    <div style={styles.wrap}>
      <h2>Boka tid hos {company.name}</h2>
      <h4>Tagna tider</h4>
      {takenSlots.length === 0 ? <p>Inga bokade tider.</p> : takenSlots.map((t, i) => (
        <div key={i} style={styles.taken}>{new Date(t.start_time).toLocaleString('sv-SE')} – {new Date(t.end_time).toLocaleString('sv-SE')}</div>
      ))}
      <h4>Ny bokning</h4>
      <form onSubmit={submit} style={styles.form}>
        <select value={form.service_id} onChange={e => setForm({...form, service_id: e.target.value})}>
          {services.map(s => <option key={s.id} value={s.id}>{s.name} — {s.duration_minutes} min — {s.price} kr</option>)}
        </select>
        <input placeholder="Ditt namn" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} required />
        <input placeholder="Email" type="email" value={form.customer_email} onChange={e => setForm({...form, customer_email: e.target.value})} required />
        <input placeholder="Telefon" value={form.customer_phone} onChange={e => setForm({...form, customer_phone: e.target.value})} />
        <input type="datetime-local" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} required />
        <button type="submit">Boka{selectedService?.price > 0 ? ` & betala ${selectedService.price} kr` : ''}</button>
      </form>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 500, margin: '40px auto', padding: 24, fontFamily: 'sans-serif' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  taken: { padding: '4px 8px', background: '#fee', borderRadius: 4, marginBottom: 4, fontSize: 14 },
};
