# Mēness Sēja — palaišanas ceļvedis (Vercel + menessseja.lv)

Šis ir soli-pa-solim ceļvedis projekta palaišanai. Lēmumi: **Vercel** hostings,
**menessseja.lv** domēns, AI foto-diagnostika (`/diagnoze`) pagaidām paslēpta.

---

## 1. Iecel kodu GitHub (vajadzīgs Vercel auto-deploy)

Repo jau ir izveidots lokāli (`git init` + pirmais commit). Atliek nopublicēt:

```bash
# 1) Izveido tukšu privātu repo github.com (piem. "meness-seja"), TAD:
cd "/Users/karlis/Documents/meness fazes"
git remote add origin https://github.com/<tavs-lietotajs>/meness-seja.git
git push -u origin main
```

> `.env.local` NETIEK augšupielādēts (to slēdz `.gitignore`) — atslēgas paliek tikai pie tevis.

---

## 2. Savieno ar Vercel

1. Ej uz [vercel.com](https://vercel.com) → **Add New → Project** → importē GitHub repo.
2. Framework tiek atpazīts automātiski (**Next.js**). Build komandas mainīt nevajag.
3. Pirms **Deploy** pievieno vides mainīgos (skat. 3. punktu).

---

## 3. Vides mainīgie (Vercel → Project → Settings → Environment Variables)

Pievieno visiem trim vidēm (Production, Preview, Development):

| Mainīgais | Vērtība |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yvbndcvlntyjwguinwif.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(anon atslēga no tava `.env.local`)* |
| `NEXT_PUBLIC_SITE_URL` | `https://menessseja.lv` |

> `ANTHROPIC_API_KEY` pagaidām **nav vajadzīga** — `/diagnoze` ir paslēpta no navigācijas.
> Kad gribēsi AI rīku ieslēgt, skat. 7. punktu.

---

## 4. Domēns menessseja.lv

1. Reģistrē `menessseja.lv` pie LV reģistratora (piem. nic.lv pārstāvja).
2. Vercel → Project → **Settings → Domains** → pievieno `menessseja.lv` un `www.menessseja.lv`.
3. Vercel parādīs DNS ierakstus (parasti `A` → `76.76.21.21` un `CNAME www → cname.vercel-dns.com`).
   Ievadi tos pie reģistratora. Izplatās dažās stundās (līdz 48 h).
4. Vercel automātiski izsniedz bezmaksas SSL (https).

---

## 5. Supabase auth produkcijai ⚠️ (bez šī login e-pasts vedīs uz localhost)

Supabase panelis → **Authentication → URL Configuration**:

- **Site URL:** `https://menessseja.lv`
- **Redirect URLs** (pievieno abus):
  - `https://menessseja.lv/auth/callback`
  - `https://menessseja.lv/auth/confirm`

Supabase panelis → **Authentication → Email Templates → Confirm signup / Magic Link**:
- Pārliecinies, ka saite izmanto `token_hash` un norāda uz `/auth/confirm` (ierīču-neatkarīgā plūsma).
  Piemērs saitei veidnē:
  ```
  {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
  ```

> Pēc deploy: pārbaudi login uz īsta telefona — ievadi e-pastu, atver saiti, pārliecinies, ka ielogojas.

---

## 6. Pēc palaišanas (indeksēšana + traffic)

- **Google Search Console** → pievieno `menessseja.lv` → iesniedz `https://menessseja.lv/sitemap.xml`
- **Saite no globalverticalgardening.net** → ievieto saiti uz menessseja.lv (tavs galvenais SEO sviras punkts)
- **Vercel Analytics** → Project → Analytics → Enable (viens klikšķis)
- Pārbaudi `https://menessseja.lv/robots.txt` un `/sitemap.xml` ielādējas

---

## 7. Vēlāk: ieslēgt AI foto-diagnostiku (`/diagnoze`)

Kad būsi gatavs:
1. Vercel → pievieno `ANTHROPIC_API_KEY` (no console.anthropic.com).
2. Atjauno navigāciju: `components/nav-config.ts` → pievieno atpakaļ
   `{ href: "/diagnoze", label: "Diagnostika", icon: "photo_camera", primary: true }`.
3. `app/robots.ts` → noņem `/diagnoze` no `disallow`.
4. (Neobligāti) atjauno foto-CTA kaitēkļu lapās.

---

## Ātrā atgādne — kas jau ir gatavs

- ✅ Build zaļš · visas lapas SSG · 0 kļūdu
- ✅ Supabase backend (3 migrācijas, RLS, auth kods)
- ✅ Saturs: augi, puķes (11), kaitēkļi (8), receptes, topi, raksti
- ✅ SEO: sitemap, robots, JSON-LD, OG bilde
- ✅ `.gitignore` slēdz atslēgas
