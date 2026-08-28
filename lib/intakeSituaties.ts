/**
 * Situatiebibliotheek voor de kennisintake (v1: ~12 kernsituaties per branche).
 *
 * Dit is de "wij weten al wat uw klanten gaan vragen"-lijst: per situatie de
 * vraag die Verdi aan de óndernemer stelt om zijn antwoord op te halen. Het
 * akkoord van de ondernemer op het eindoverzicht vormt de basisset; later
 * altijd aanvulbaar. Groeit richting de veertig per branche.
 */
export interface IntakeSituatie {
  id: string;
  titel: string;
  vraag: string;
}

const ALGEMEEN: IntakeSituatie[] = [
  { id: "alg-pin", titel: "Betalen", vraag: "Kunnen klanten bij u pinnen, en accepteert u ook contant of betaalverzoekjes?" },
  { id: "alg-parkeren", titel: "Parkeren", vraag: "Wat vertelt u klanten over parkeren bij uw zaak?" },
  { id: "alg-afzeggen", titel: "Afzeggen en verzetten", vraag: "Tot wanneer mogen klanten kosteloos afzeggen of verzetten, en wat gebeurt er daarna?" },
  { id: "alg-teLaat", titel: "Te laat komen", vraag: "Wat zegt u als iemand laat is voor zijn afspraak — hoeveel speling geeft u?" },
  { id: "alg-wachttijd", titel: "Wachttijd", vraag: "Hoe snel kunnen nieuwe klanten gemiddeld bij u terecht?" },
  { id: "alg-bereikbaar", titel: "Buiten openingstijden", vraag: "Wat mag Verdi beloven over wanneer u terugbelt of reageert op berichten buiten openingstijden?" },
  { id: "alg-eigen", titel: "Eigen inbreng", vraag: "Tot slot het belangrijkste: is er iets dat uw klanten vaak vragen, of iets dat Verdi écht over uw zaak moet weten, dat nog niet voorbijkwam? Vertel het in uw eigen woorden — alles is welkom." },
];

const PER_BRANCHE: Record<string, IntakeSituatie[]> = {
  garage: [
    { id: "gar-apk", titel: "APK", vraag: "Hoe loopt een APK bij u: moet de klant wachten, kan hij de auto brengen, en zit de afmelding bij de prijs in?" },
    { id: "gar-leenauto", titel: "Vervangend vervoer", vraag: "Heeft u leenauto's of een haal- en brengservice, en wat kost dat?" },
    { id: "gar-diagnose", titel: "Storing en geluid", vraag: "Wat zegt u tegen een klant met een vage storing of een raar geluid — hoe pakt u de diagnose aan en wat kost die?" },
    { id: "gar-banden", titel: "Banden", vraag: "Doet u bandenwissel en -opslag, en wat zijn daarvoor de prijzen?" },
    { id: "gar-merken", titel: "Merken", vraag: "Werkt u aan alle merken, of zijn er uitzonderingen?" },
    { id: "gar-pech", titel: "Pech onderweg", vraag: "Wat moet een klant doen die met pech langs de weg staat — heeft u een noodnummer of verwijst u door?" },
  ],
  dental: [
    { id: "den-vergoeding", titel: "Vergoeding", vraag: "Hoe zit het met vergoeding: declareert u direct bij verzekeraars, en wat vertelt u over de aanvullende verzekering?" },
    { id: "den-verwijzing", titel: "Verwijzing", vraag: "Hebben nieuwe patiënten een verwijzing van de tandarts nodig, of kunnen ze direct terecht?" },
    { id: "den-angst", titel: "Spanning en angst", vraag: "Wat wilt u dat Verdi zegt tegen iemand die opziet tegen de behandeling?" },
    { id: "den-pijn", titel: "Pijnklachten", vraag: "Bij welke klachten wilt u dat iemand met spoed langskomt, en waar verwijst u naartoe buiten uw tijden?" },
    { id: "den-kinderen", titel: "Kinderen", vraag: "Behandelt u ook kinderen, en vanaf welke leeftijd?" },
    { id: "den-eerste", titel: "Eerste bezoek", vraag: "Wat moet een nieuwe patiënt meenemen of weten voor het eerste bezoek?" },
  ],
  beauty: [
    { id: "bea-huid", titel: "Gevoelige huid", vraag: "Wat vraagt of adviseert u bij klanten met een gevoelige huid of allergieën?" },
    { id: "bea-intake", titel: "Eerste keer", vraag: "Hoe verloopt een eerste bezoek — doet u een intake, en kost die iets?" },
    { id: "bea-cadeau", titel: "Cadeaubonnen", vraag: "Verkoopt u cadeaubonnen, en hoe kunnen klanten die bestellen of inwisselen?" },
    { id: "bea-producten", titel: "Producten", vraag: "Met welke merken of productlijnen werkt u, en verkoopt u die ook los?" },
    { id: "bea-zwanger", titel: "Zwangerschap", vraag: "Zijn er behandelingen die u niet doet bij zwangerschap, en wat adviseert u dan?" },
    { id: "bea-mannen", titel: "Voor wie", vraag: "Zijn alle behandelingen voor iedereen — ook voor mannen en tieners?" },
  ],
  salon: [
    { id: "sal-kleur", titel: "Kleuren", vraag: "Wat moet een klant weten voor een kleurbehandeling — plakt u een test, hoe lang duurt het?" },
    { id: "sal-zonder", titel: "Zonder afspraak", vraag: "Kunnen klanten binnenlopen zonder afspraak, of werkt u alleen op afspraak?" },
    { id: "bea-cadeau", titel: "Cadeaubonnen", vraag: "Verkoopt u cadeaubonnen, en hoe kunnen klanten die bestellen of inwisselen?" },
    { id: "sal-kinderen", titel: "Kinderen", vraag: "Knipt u kinderen, en geldt daar een ander tarief voor?" },
  ],
};

export function situatiesVoor(industry?: string): IntakeSituatie[] {
  const branche = PER_BRANCHE[industry || ""] || [];
  return [...branche, ...ALGEMEEN];
}
