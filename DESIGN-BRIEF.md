# Verde AI — Ontwerpbrief voor een volledige herbouw van de website

> Plak dit als eerste bericht in een schoon chatvenster. Alles wat nodig is staat hier.

---

## De opdracht

Bouw de volledige website van Verde AI opnieuw. Niet bijschaven — opnieuw.
Alle bestaande landingspagina-componenten mogen weg.

Het moet een **state-of-the-art, volledig scrollbare ervaring** worden die op
mobiel net zo goed is als op desktop. Eén doorlopende, soepele beweging. Weinig
tekst. Hoge UI-kwaliteit.

**Referentie: hoe Apple zijn producten en diensten verkoopt.** Minimalistisch,
rustig, zelfverzekerd. Niet druk, niet bont, geen kaarten met randjes.

---

## Wat Verde AI is

Een WhatsApp-assistent voor praktijken, salons en installatiebedrijven in
Nederland. Hij voert het gesprek met de klant, kijkt in de agenda van de
ondernemer en legt de afspraak vast. Ook buiten kantooruren.

**Wat wij verkopen is niet de boekingsfunctie maar de persoonlijkheid van de
assistent.** Behulpzaam, zorgzaam, empathisch, goed luisterend. Geen
gestandaardiseerde berichtjes — eerst opvangen, dan pas oplossen. Dit is het
meest premium product uit de lijn. Conversie en tijdbesparing voor de klant zijn
het gevolg, niet het uitgangspunt.

Dat moet de site uitstralen. Niet als claim in een kop, maar in hoe de site
zich gedraagt.

---

## Ontwerprichting

### Apple-minimalisme, concreet gemaakt

- **Eén idee per scherm.** Niet drie kolommen met voordelen. Eén gedachte,
  groot, met stilte eromheen.
- **Type draagt de pagina.** Grote koppen, veel witruimte, korte regels.
  Waar één regel volstaat nooit een alinea.
- **Weg met chrome.** Geen kaarten met randen en schaduwen. Scheiding ontstaat
  door ruimte, niet door lijnen.
- **Rustige beweging.** Fade met een kleine verschuiving of schaal. Lange
  duur (600–900ms), `ease-out`. Nooit stuiteren, nooit zelfbedachte
  easing-curves.
- **Kleur komt uit het product.** Neutrale basis, één accent. Geen kleurverlopen,
  geen gloed-effecten.
- **Specificaties komen laat**, in een stil raster, nadat het verhaal verteld is.

### Wat het níét mag worden

De vorige poging faalde op precies deze punten — vermijd ze:

| Signaal | Waarom het fout is |
|---|---|
| Kleurverlopen (radiaal of lineair) | Belangrijkste kenmerk van AI-gegenereerde interfaces |
| `box-shadow: 0 0 20px` als gloed | Idem |
| Zelfbedachte `cubic-bezier` curves | Idem |
| `tracking-*` op elke kop | Idem |
| Kaartjes met randen in een raster | Leest als template |
| Drie kolommen met een icoon erboven | Leest als template |

Er is een skill `baseline-ui` die dit afdwingt. **Roep die aan voordat je begint.**

### Mobiel is niet de kleine variant

De helft van de bezoekers is een praktijkeigenaar die 's avonds op de bank
op zijn telefoon kijkt. Ontwerp daarvoor eerst. Scroll-gestuurde animatie moet
op een telefoon soepel blijven: alleen `transform` en `opacity`, nooit layout-
eigenschappen.

---

## Pagina's die gebouwd moeten worden

| Route | Wat het is | Publiek |
|---|---|---|
| `/` | De verkooppagina | Praktijkeigenaren |
| `/live/[slug]` | Live simulator — je praat echt met de assistent | Prospects |
| `/portal/[slug]` | Onboarding na aankoop | Nieuwe klanten |
| `/portal/[slug]/poster` | Printbare balieposter met QR | Nieuwe klanten |
| `/admin` | Pipeline, lead-intelligentie, bedrijfsscan | Alleen Dusty |

Alle vijf moeten mee in de nieuwe taal. `/admin` is een werktuig, geen
verkooppagina: daar geldt informatiedichtheid boven stilte.

---

## Harde inhoudelijke regels

### Geen enkel cijfer zonder bron

`lib/evidence.ts` is de enige plek waar een cijfer mag ontstaan. Elk cijfer
heeft daar een bron, een betrouwbaarheidsniveau en de nuance waar het níét over
gaat. **Gebruik geen getal op de site dat daar niet in staat.**

Beschikbaar en onderbouwd:

- **42 uur** gemiddelde reactietijd op een online aanvraag — HBR 2011, 2.241 bedrijven
- **23%** reageert nooit — HBR 2011
- **7%** reageert binnen vijf minuten — Drift 2017, 433 bedrijven
- **21×** meer kans op kwalificatie bij 5 in plaats van 30 minuten — MIT/InsideSales 2007
- **60–80%** leespercentage WhatsApp — Searchlab
- **~20%** open rate e-mail
- **ongeveer de helft** van de afspraken geboekt tussen 17:00 en 09:00 — Zocdoc platformdata

Nuance die erbij hoort: de leadonderzoeken zijn op B2B-verkoopleads gedaan, niet
op tandartspraktijken. Het mechanisme is overdraagbaar, de precieze percentages
niet. Formuleer als "onderzoek naar het opvolgen van online aanvragen laat zien".

**Verboden** (staan in `REJECTED_CLAIMS` met reden): de 98% WhatsApp open rate,
"78% koopt bij de eerste die reageert", en twee percentages die eerder verzonnen
op de site stonden.

### Prijsstelling

€79 Starter / €149 Professional / €299 Multi-locatie per maand. Deze bedragen
zitten goed in de markt en blijven ongewijzigd.

Zet ze **niet** af tegen andere chatbots — dan concurreer je op een lijstje met
aanbieders van €29. Het anker is de receptioniste en de rekensom:

> €149 per maand. Bij een gemiddelde behandelwaarde van €85 gedekt zodra er twee
> afspraken bijkomen die u anders was misgelopen.

### WhatsApp-weergave blijft authentiek

De chatsimulatie toont wat de klant van onze klant écht ziet. Die blijft dus in
de officiële WhatsApp-kleuren, licht én donker — die staan als tokens
(`--wa-*`) in `app/globals.css`. Verde's eigen blauw is voor onze eigen chrome.

### Thema

Licht en donker volgen de systeemvoorkeur (`darkMode: "media"`). Er is bewust
géén handmatige schakelaar. Beide moeten even goed zijn.

---

## Merk

| | |
|---|---|
| Primair | Azure `#2196F3`, hover `#1E88E5` |
| Diep | Deep Sapphire `#0D47A1`, `#0A192F` |
| Accent | Sunset Amber `#FF9100` |
| Logo | `components/ui/BrandLogo.tsx` — spraakbubbel met drie punten |

Eén accent per scherm. Amber is voor waarschuwing en verlies, niet voor sier.

---

## Techniek

- **Next.js 14** App Router, TypeScript, Tailwind 3.4
- **`motion`** (v13, `motion/react`) is geïnstalleerd voor JS-animatie
- **DeepSeek** is de enige AI-provider (`lib/deepseek.ts`), inclusief het
  gespreksprotocol in de systeemprompt en een fallback zonder sleutel
- **Railway**, Dockerfile met Next standalone output
- Repo: `github.com/MonoByGit/customer-support-ai`, branch `main`
- Live: `https://verde-whatsapp-ai-production.up.railway.app`

### Wat blijft staan — niet weggooien

- `lib/evidence.ts` — de bronnenlijst
- `lib/leads.ts` — leadfases, koopsignalen, outreachteksten
- `lib/deepseek.ts` — het gespreksprotocol; dit is het product
- `lib/session-store.ts` — sessielimieten (10 min / 15 berichten / 40k tokens)
- `lib/env.ts` — placeholder-bewust uitlezen van variabelen
- `app/api/*` — alle routes werken
- `components/ui/BrandLogo.tsx`, `components/ui/QrCode.tsx`
- De WhatsApp-tokens in `app/globals.css`

### Wat weg mag

Alles in `components/landing/`. Dat is de mislukte poging.

### Bouwen en draaien

Het project staat onder iCloud-sync. **Altijd buiten iCloud bouwen**, anders
loopt de dev-server vast:

```bash
mkdir -p ~/dev/customer-support-ai-work && rsync -a --delete --exclude='.git' --exclude='node_modules' --exclude='.next' "/Users/idusty/Documents/Cosmo OS/Projects/Customer Support AI/" ~/dev/customer-support-ai-work/ && (cd ~/dev/customer-support-ai-work && npm install && npm run build)
```

Opruimen aan het einde van de sessie: server stoppen, scratch-map verwijderen,
controleren dat er geen `.env` is achtergebleven.

Deployen:

```bash
railway up --service verde-whatsapp-ai --detach
```

---

## Belangrijk: animatie kan niet in de pane geverifieerd worden

De ingebouwde browser-pane rapporteert `document.hidden: true` en de
animatieklok staat stil. Transities blijven op `running` hangen, `rAF` loopt
niet, scroll-gestuurde animatie doet niets. Screenshots komen zwart terug zodra
er gescrold is.

**Gevolg: beweging is niet zelf te verifiëren.** Structuur, contrast, DOM-toestand
en logica wel. Meld dat eerlijk in plaats van "geverifieerd" te zeggen, en laat
Dusty het tempo beoordelen in zijn eigen browser.

---

## Openstaande punten (niet in deze opdracht, wel om te weten)

1. **`/admin` heeft geen enkele beveiliging.** Pipeline, klantgesprekken en
   prospectlijst zijn leesbaar voor iedereen met de URL, en `PUT /api/profiles`
   laat een willekeurige bezoeker een klantprofiel overschrijven. Moet gefixt,
   maar los van deze ontwerpopdracht.
2. **Agenda-integratie wordt OAuth** voor Google en Microsoft. Apple kan niet:
   geen publieke API, alleen CalDAV met app-specifieke wachtwoorden, en Calendly
   heeft Apple-ondersteuning om die reden laten vallen. De huidige
   serviceaccount-opzet in het portaal verdwijnt daarmee.
3. **Meta WhatsApp Cloud API** staat klaar met placeholders; koppelen vereist
   bedrijfsverificatie bij Meta en gebeurt pas bij de eerste live klant.
4. **Open Brain MCP**: `capture_thought` mist de `decision_domain`-parameter die
   de API sinds 6.8.0 verplicht stelt, waardoor nieuwe beslissingen niet
   vastgelegd kunnen worden.

---

## Werkafspraken met Dusty

- Nederlands, in alles.
- Eerst een plan, dan bouwen — maar geen eindeloze vragenrondes.
- Meerdere opties bij smaakkeuzes: subtiel naast gedurfd.
- Hij werkt in blokken van 1–2 uur, vaak mobiel.
- **Als hij om gedurfd vraagt, lever dan gedurfd.** De vorige sessie leverde
  drie keer achter elkaar een verstandige, ingetogen versie van een expliciet
  gedurfde brief. Dat is de fout die niet herhaald moet worden.
