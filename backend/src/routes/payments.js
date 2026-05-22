const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const db = require('../db/supabase');

// Kund betalar för en bokning
router.post('/checkout', async (req, res) => {
  const { booking_id, amount, service_name } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'sek', product_data: { name: service_name }, unit_amount: amount * 100 }, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/booking/success?id=${booking_id}`,
    cancel_url: `${process.env.CLIENT_URL}/booking/cancel`,
  });
  res.json({ url: session.url });
});

// Företag prenumererar (månadsabonnemang)
router.post('/subscribe', auth, async (req, res) => {
  const { data: company } = await db.from('companies').select('stripe_customer_id, email, name').eq('id', req.user.id).single();

  let customerId = company.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: company.email, name: company.name });
    customerId = customer.id;
    await db.from('companies').update({ stripe_customer_id: customerId }).eq('id', req.user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/dashboard?subscribed=true`,
    cancel_url: `${process.env.CLIENT_URL}/pricing`,
  });
  res.json({ url: session.url });
});

module.exports = router;
