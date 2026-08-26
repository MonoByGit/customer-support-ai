# 💬 WhatsApp AI Appointment Booking Engine & Live Demo Platform

An end-to-end autonomous WhatsApp AI receptionist and appointment booking engine built with **Next.js 14 (App Router, TypeScript, Tailwind CSS)**, **Gemini Flash (Function Calling & Structured Outputs)**, **Cheerio Web Scraping**, and **Google Calendar API Integration**.

Designed to instantly convert website visitors into confirmed calendar appointments, with a pixel-perfect clickable WhatsApp Web demo interface and ready-to-ship Railway configuration.

---

## 🚀 Key Features

1. **AI Ingestion & Extraction (`/api/ingest` & `lib/scraper.ts`)**:
   - Paste any business website URL.
   - Strips boilerplate (scripts, nav, footer) with Cheerio.
   - Extracts structured business profile (`businessName`, `industry`, `services`, `prices`, `openingHours`, `faqs`, `toneOfVoice`) via Gemini JSON schema with Zod validation.
   - Instantly generates an interactive WhatsApp demo link (`/demo/[slug]`).

2. **Gemini Agent Kernel & Native Tool Calling (`/api/chat` & `lib/gemini.ts`)**:
   - Persona: Warm, concise, friendly WhatsApp receptionist (2-3 sentences max per bubble).
   - Tool `check_availability({ startDate, serviceDurationMinutes })`: Checks free calendar slots and proposes 2 concrete times.
   - Tool `confirm_booking({ customerName, customerPhone, serviceTitle, slotIsoString })`: Confirms appointment and creates Google Calendar event.
   - Collects Customer Name and Phone Number before booking.

3. **Pixel-Perfect WhatsApp Web UI (`components/whatsapp/*`)**:
   - WhatsApp green `#075E54` / `#128C7E`, bubble `#DCF8C6` (user) / `#FFFFFF` (agent).
   - Auto-welcome greeting on page open.
   - Realistic typing simulation (`Aan het typen...`) with natural delays (1.1s).
   - Web Audio synthesized incoming and outgoing message chimes.
   - Interactive quick-reply service chips and time slot selector buttons.
   - Celebration modal with confetti, Add-to-Google-Calendar link, and `.ics` file download.
   - Reset chat, share demo link, and inspect business profile data.

4. **Google Calendar Engine + Sandbox Fallback (`lib/calendar.ts`)**:
   - Uses `googleapis` with Service Account authentication (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`).
   - Seamless sandbox fallback mode: if environment credentials are not provided, the demo functions 100% out of the box with realistic mock slots.

5. **Production & Railway Ready**:
   - Next.js Standalone build configuration.
   - Multi-stage Dockerfile (`Dockerfile`).
   - Railway manifest (`railway.json`).

---

## 🛠️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── ingest/route.ts         # Scrapes site, outputs BusinessProfile JSON
│   │   ├── chat/route.ts           # Handles WhatsApp loop, Gemini tool calls
│   │   └── calendar/mock/route.ts  # Fallback sandbox calendar router
│   ├── demo/
│   │   └── [slug]/page.tsx         # Clickable WhatsApp interface for client profile
│   ├── admin/
│   │   └── page.tsx                # Onboarding dashboard: Paste URL -> Generate Demo
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx                    # Product showcase & demo directory
├── components/
│   └── whatsapp/
│       ├── ChatWindow.tsx          # Authentic WhatsApp chat frame
│       ├── ChatHeader.tsx          # Header with avatar, status, controls
│       ├── MessageList.tsx         # Message bubbles, checkmarks, slot chips
│       ├── MessageInput.tsx        # WhatsApp input bar, suggestions, mic/send
│       ├── CalendarInviteModal.tsx # Booking confirmation modal + .ics download
│       ├── BusinessInfoModal.tsx   # Scraped profile details viewer
│       └── sound.ts                # Web Audio chime synthesizer
├── lib/
│   ├── scraper.ts                  # Cheerio web scraper
│   ├── schemas.ts                  # Zod schemas for BusinessProfile & Tools
│   ├── gemini.ts                   # Gemini client & tool calling engine
│   ├── calendar.ts                 # Google Calendar connector & sandbox
│   └── storage.ts                  # File-based profile storage (/data/profiles/)
├── data/
│   └── profiles/
│       └── tandarts-demo.json      # Pre-populated demo profile
├── Dockerfile                      # Standalone container build
├── railway.json                    # Railway deployment settings
├── .env.example
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file with the following variables:

```bash
# 1. Google Gemini API (Required for AI extraction & natural WhatsApp receptionist conversation)
# Get a key at https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# 2. Google Calendar API (Optional - If omitted, automated sandbox mock mode is enabled)
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com

# 3. App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🏃 Local Development

Per the `dev-outside-icloud` best practices for macOS environments:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser:
   - **Showcase Hub**: `/`
   - **Live Dental Demo**: `/demo/tandarts-demo`
   - **Admin Generator**: `/admin`

---

## 🚢 Deploying to Railway

### Option A: Via Railway GitHub Integration
1. Push this repository to GitHub.
2. Go to [Railway.app](https://railway.app) and click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select this repository. Railway will automatically detect `railway.json` and build the `Dockerfile`.
4. In Railway dashboard, add your environment variables (`GEMINI_API_KEY`, `GOOGLE_CLIENT_EMAIL`, etc.).

### Option B: Via Railway CLI
```bash
railway login
railway init
railway up
```

---

## 📄 License
MIT License.
