# Bokningsapp

## Snabbstart

### 1. Databas — Supabase (gratis)
1. Gå till https://supabase.com och skapa ett konto
2. Skapa ett nytt projekt
3. Gå till SQL Editor och kör innehållet i `backend/schema.sql`
4. Kopiera Project URL och Service Role Key

### 2. Betalning — Stripe (gratis att testa)
1. Gå till https://stripe.com och skapa ett konto
2. Hämta Secret Key från Dashboard
3. Skapa ett månadsabonnemang under Products → skapa ett pris → kopiera Price ID

### 3. Backend
```bash
cd backend
# Fyll i .env med dina nycklar
npm start
```

### 4. Webb
```bash
cd web
npm run dev
```

## Struktur
```
backend/
  index.js          - Server
  schema.sql        - Databas-schema (kör i Supabase)
  .env              - Dina nycklar (fyll i!)
  src/
    routes/         - auth, companies, services, bookings, payments
    middleware/     - JWT-autentisering
    db/             - Supabase-klient

web/
  src/
    pages/          - Login, Register, Dashboard, BookingPage
    api.js          - API-klient
```

## Flöde
- Företag registrerar sig → loggar in → lägger till tjänster
- Delar sin bokningslänk: `/book/{företagets-id}`
- Kunder bokar tid och betalar via Stripe
- Du fakturerar företagen månadsvis via Stripe-prenumeration
