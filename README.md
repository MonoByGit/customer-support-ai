# Verde AI — WhatsApp Boekingsengine

Autonome WhatsApp-afsprakenassistent voor praktijken, salons en installatiebedrijven.
Zet websitebezoekers 24/7 om in bevestigde afspraken in Google Agenda.

Gebouwd met **Next.js 14** (App Router, TypeScript, Tailwind), **DeepSeek Flash V4**
(function calling), **Cheerio** en de **Google Calendar API**.

- Live: https://verde-whatsapp-ai-production.up.railway.app
- Repo: https://github.com/MonoByGit/customer-support-ai

---

## Architectuur

| Route | Wat het is |
|---|---|
| `/` | Marketing- en conversiepagina met ROI-calculator en live QR-test |
| `/admin` | Verde AI Command: pipeline, lead-intelligentie, outreach en bedrijfsscan |
| `/live/[slug]` | Live WhatsApp Simulator voor één bedrijfsprofiel |
| `/portal/[slug]` | Klantonboarding: widget, agendakoppeling, QR-code |
| `/portal/[slug]/poster` | Printklare balieposter met QR-code |
| `/demo/[slug]` | Permanente redirect naar `/live/[slug]` (historische links) |

| API | Wat het doet |
|---|---|
| `POST /api/ingest` | Scrapet een website en destilleert een `BusinessProfile` via DeepSeek |
| `POST /api/chat` | Eén gespreksbeurt inclusief agenda-tools en sessiebewaking |
| `GET/POST /api/sessions` | Sessieoverzicht, verlengen en opnieuw starten |
| `GET/PUT /api/profiles` | Bedrijfsprofielen lezen en bijwerken |
| `GET /api/status` | Eerlijke koppelstatus (nooit sleutels, alleen aan/uit plus instructie) |
| `GET/POST /api/webhook` | Meta WhatsApp Cloud API handshake en berichtafhandeling |

### AI-engine

DeepSeek is de enige LLM-provider. `lib/deepseek.ts` bevat de extractie, de
gespreksbeurt met tool calling (`check_availability`, `confirm_booking`) en een
**deterministische fallback-receptionist** die het overneemt zonder API-sleutel of
bij een API-storing — zodat een prospect nooit tegen een dood scherm aanloopt.

### Opslag

Profielen en sessies staan als JSON op schijf. **Op Railway is de container-schijf
vluchtig**: zonder volume verdwijnt elk gegenereerd klantprofiel bij de volgende
deploy. Koppel een Railway Volume en zet `DATA_DIR` op het mountpad (bijv. `/data`);
de meegeleverde voorbeeldprofielen worden dan eenmalig geseed.

---

## Lokaal draaien

Dit project staat onder iCloud-sync. Bouw en draai altijd buiten iCloud:

```bash
mkdir -p ~/dev/customer-support-ai-work && rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' "/Users/idusty/Documents/Cosmo OS/Projects/Customer Support AI/" ~/dev/customer-support-ai-work/ && (cd ~/dev/customer-support-ai-work && npm install && npm run dev)
```

Kopieer `.env.example` naar `.env` en vul in wat je nodig hebt. Zonder sleutels
draait alles in sandbox-modus.

---

## Deployen

Railway bouwt via de `Dockerfile` (Next standalone output) en injecteert `PORT` zelf.

```bash
railway up --service verde-whatsapp-ai --detach
```

### Environment op Railway

| Variabele | Nodig voor |
|---|---|
| `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL` | Vrije conversatie in plaats van de fallback |
| `DATA_DIR` | Klantprofielen die deploys overleven (Railway Volume) |
| `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID` | Echte agendasynchronisatie |
| `META_WHATSAPP_ACCESS_TOKEN`, `META_PHONE_NUMBER_ID`, `META_WEBHOOK_VERIFY_TOKEN` | Koppeling aan een echt WhatsApp-nummer |
| `NEXT_PUBLIC_APP_URL` | Correcte metadata en absolute links |

`/admin` toont deze status live in het blok **Actieve koppelingen**.

---

## Thema

Er is geen handmatige licht/donker-schakelaar. De applicatie volgt de systeemvoorkeur
via `prefers-color-scheme` (Tailwind `darkMode: "media"`).
