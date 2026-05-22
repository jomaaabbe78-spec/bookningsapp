const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/supabase');

// Hämta bokningar för ett företag (publik - visar bara tagna tider)
router.get('/taken/:companyId', async (req, res) => {
  const { data, error } = await db.from('bookings')
    .select('start_time, end_time, service_id')
    .eq('company_id', req.params.companyId)
    .eq('status', 'confirmed');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Hämta alla bokningar för företaget (kräver inloggning)
router.get('/mine', auth, async (req, res) => {
  const { data, error } = await db.from('bookings').select('*').eq('company_id', req.user.id).order('start_time');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Skapa bokning (kund bokar)
router.post('/', async (req, res) => {
  const { company_id, service_id, customer_name, customer_email, customer_phone, start_time, end_time } = req.body;
  const { data, error } = await db.from('bookings')
    .insert({ company_id, service_id, customer_name, customer_email, customer_phone, start_time, end_time, status: 'confirmed' })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Avboka
router.delete('/:id', auth, async (req, res) => {
  const { error } = await db.from('bookings').delete().eq('id', req.params.id).eq('company_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
