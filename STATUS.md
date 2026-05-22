# Bokningsapp - Projektstatus 2026-05-22

## Vad som är klart
- Frontend (React/Vite) live på GitHub Pages
- GitHub repo: https://github.com/jomaaabbe78-spec/bookningsapp (branch: main)
- Autocomplete-bugg på registreringsformuläret fixad och pushad
- render.yaml skapad och pushad för backend-deployment

## Vad som återstår

### 1. Deploya backend på Render.com
- Koppla GitHub repo `bookningsapp` på render.com
- render.yaml finns i root, pekar automatiskt på `backend/`
- Lägg in miljövariabler från `backend/.env` på Render
- När Render ger en URL → gå till steg 2

### 2. Uppdatera frontend api.js
- Fil: web/src/api.js
- Byt ut localhost-URL mot Render-URL
- Pusha → GitHub Pages uppdateras automatiskt

### 3. SEO / Google-indexering
- Inte påbörjat

## Projektstruktur
- `web/` — React frontend (GitHub Pages)
- `backend/` — Node.js/Express (ska till Render)
- Databas: Supabase (konfigurerad)
- Betalningar: Stripe (konfigurerad)
