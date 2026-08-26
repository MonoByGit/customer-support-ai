export function formatDutchDateTime(date: Date): string {
  const days = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
  const months = [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december",
  ];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${dayName} ${dayNum} ${monthName} om ${hours}:${minutes} uur`;
}

export function createGoogleCalendarWebUrl(
  title: string,
  location: string,
  startDate: Date,
  endDate: Date
): string {
  const formatUtc = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const dates = `${formatUtc(startDate)}/${formatUtc(endDate)}`;
  const text = encodeURIComponent(title);
  const loc = encodeURIComponent(location);
  const details = encodeURIComponent("Geboekt via WhatsApp AI Boekingsassistent.");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${loc}`;
}
