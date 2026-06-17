# Mēness Sēja — palaišanas ceļvedis (Vercel + menesseja.lv)

Lēmumi: **Vercel** hostings, **menesseja.lv** domēns, kopiena uz **Neon (Postgres)**,
AI foto-diagnostika (`/diagnoze`) pagaidām paslēpta.

---

## 1. Kods GitHub ✅ (jau izdarīts)

Repo ir publicēts: **github.com/Vilmanis99/menesseja**. Vercel auto-izvieto katru `git push` uz `main`.

> `.env.local` NETIEK augšupielādēts (`.gitignore`) — paroles paliek tikai pie tevis.

---

## 2. Savieno ar Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → importē `Vilmanis99/menesseja`.
2. Framework atpazīst automātiski (**Next.js**). Build komandas nemaini.
3. Pirms **Deploy** pievieno vides mainīgos (3. punkts).

---

## 3. Vides mainīgie (Vercel → Settings → Environment Variables)

| Key | Value | Vides |
|---|---|---|
| `DATABASE_URL` | tava Neon connection string (pooled) | Production + Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://menesseja.lv` | visas |

⚠️ **`DATABASE_URL`:**
- Key tieši tā — **lielie burti, apakšsvītra, BEZ atstarpes** (kods lasa `process.env.DATABASE_URL`).
- Tā ir **servera noslēpums** — NEKAD `NEXT_PUBLIC_` prefiksu.
- Neon → projekts → **Connect** → izvēlies `production` / `neondb` / `neondb_owner` + **Pooled connection** → Copy.

> Pēc env mainīgā pievienošanas/maiņas vajag **Redeploy** (Deployments → ⋯ → Redeploy) —
> mainīgais netiek paņemts automātiski.
>
> `ANTHROPIC_API_KEY` pagaidām **nav vajadzīga** — `/diagnoze` paslēpta (skat. 6. punktu).

---

## 4. Domēns menesseja.lv

1. Reģistrē `menesseja.lv` pie LV reģistratora.
2. Vercel → **Settings → Domains** → pievieno `menesseja.lv` + `www.menesseja.lv`.
3. Ievadi parādītos DNS ierakstus pie reģistratora (izplatās līdz 48 h).
4. Vercel automātiski izsniedz bezmaksas SSL.

---

## 5. Kopiena (Neon) — pārbaude pēc deploy

Kopiena ir **pseidonīma** — bez login, lietotājs izvēlas vārdu. Vajag tikai `DATABASE_URL`.
Tabulas (`community_posts`, `community_likes`) jau izveidotas Neon (`db/neon-community.sql`).

- Pēc deploy atver `https://menesseja.lv/kopiena` → ja rāda ieraksta lauku (nevis "drīz būs"),
  datubāze ir pieslēgta. Publicē testa ierakstu un pārbaudi «patīk».
- Spam aizsardzība: 5 ieraksti / 10 min uz ierīci, validācija servera pusē.
- Īsti konti (login + sinhronizācija starp ierīcēm) — pievienojami vēlāk, ja vajag.

**Senču gudrība (`/iesutit`)** — tā pati Neon datubāze (`community_contributions` tabula).
Iesūtījumi ir **moderēti**: nonāk statusā `pending` un parādās krātuvē tikai pēc apstiprināšanas.
- Pievieno **`ADMIN_KEY`** vides mainīgo (servera noslēpums, garš nejaušs teksts, **bez** `NEXT_PUBLIC`).
- Atver `https://menesseja.lv/iesutit?key=TAVS-ADMIN-KEY` → redzēsi rindu «Gaida apstiprināšanu»
  ar pogām Apstiprināt / Noraidīt. Bez `ADMIN_KEY` iesūtījumi joprojām pienāk, bet apstiprināmi tikai caur SQL.

> 🔒 Ja Neon parole kādreiz noplūdusi — Neon → Reset password → atjauno `DATABASE_URL`
> gan Vercel, gan `.env.local`, tad Redeploy.

---

## 6. Vēlāk: ieslēgt AI foto-diagnostiku (`/diagnoze`)

1. Vercel → pievieno `ANTHROPIC_API_KEY`.
2. `components/nav-config.ts` → pievieno atpakaļ `/diagnoze` ierakstu.
3. `app/diagnoze/layout.tsx` + `app/robots.ts` → noņem noindex/disallow.

---

## 7. Pēc palaišanas (indeksēšana + traffic)

- **Google Search Console** → pievieno domēnu → iesniedz `/sitemap.xml`
- **Saite no globalverticalgardening.net** → galvenais SEO sviras punkts
- **Vercel Analytics** → Enable (1 klikšķis)

---

## Ātrā atgādne — kas gatavs

- ✅ Build zaļš · 237 lapas · 0 kļūdu
- ✅ Saturs: augi, **puķes (23)**, **kaitēkļi (18)**, receptes, topi, raksti, vārda dienas
- ✅ Kopiena uz **Neon** (pseidonīma, rate-limited)
- ✅ SEO: sitemap, robots, llms.txt, JSON-LD, OG, drukājams kalendārs
- ✅ `.gitignore` slēdz paroles
