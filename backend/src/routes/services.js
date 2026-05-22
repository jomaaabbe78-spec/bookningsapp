const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db/supabase');

// Hämta tjänster för ett företag (publik)
router.get('/:companyId', async (req, res) => {
  const { data, error } = await db.from('services').select('*').eq('company_id', req.params.companyId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Skapa tjänst
router.post('/', auth, async (req, res) => {
  const { name, duration_minutes, price } = req.body;
  const { data, error } = await db.from('services')
    .insert({ company_id: req.user.id, name, duration_minutes, price })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Ta bort tjänst
router.delete('/:id', auth, async (req, res) => {
  const { error } = await db.from('services').delete().eq('id', req.params.id).eq('company_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
