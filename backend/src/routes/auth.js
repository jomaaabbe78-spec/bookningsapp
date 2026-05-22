const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/supabase');

// Registrera företag
router.post('/register', async (req, res) => {
  const { name, email, password, type } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const { data, error } = await db.from('companies')
    .insert({ name, email, password: hash, type })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  const token = jwt.sign({ id: data.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, company: { id: data.id, name, email, type } });
});

// Logga in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await db.from('companies').select('*').eq('email', email).single();
  if (error || !data) return res.status(401).json({ error: 'Fel email eller lösenord' });
  const ok = await bcrypt.compare(password, data.password);
  if (!ok) return res.status(401).json({ error: 'Fel email eller lösenord' });
  const token = jwt.sign({ id: data.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, company: { id: data.id, name: data.name, email, type: data.type } });
});

module.exports = router;
