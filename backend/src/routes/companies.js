const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/supabase');

// Hämta alla företag (publik)
router.get('/', async (req, res) => {
  const { data, error } = await db.from('companies').select('id, name, type');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Hämta eget företag
router.get('/me', auth, async (req, res) => {
  const { data, error } = await db.from('companies').select('id, name, email, type').eq('id', req.user.id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

// Markera som prenumererad
router.put('/me/subscribed', auth, async (req, res) => {
  const { data, error } = await db.from('companies').update({ subscribed: true }).eq('id', req.user.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Uppdatera företag
router.put('/me', auth, async (req, res) => {
  const { name, type } = req.body;
  const { data, error } = await db.from('companies').update({ name, type }).eq('id', req.user.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
