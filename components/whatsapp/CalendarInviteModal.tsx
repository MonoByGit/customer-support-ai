"use client";

import React, { useEffect } from "react";
import { BookingConfirmation } from "@/lib/schemas";
import { formatDutchDateTime } from "@/lib/calendar-utils";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  X,
  ExternalLink,
  Download,
} from "lucide-react";
import confetti from "canvas-confetti";

interface CalendarInviteModalProps {
  booking: BookingConfirmation | null;
  onClose: () => void;
}

export const CalendarInviteModal: React.FC<CalendarInviteModalProps> = ({
  booking,
  onClose,
}) => {
  useEffect(() => {
    if (booking) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2196F3", "#1E88E5", "#0D47A1", "#FF9100", "#00E5FF"],
        });
      } catch (err) {
        console.warn("Confetti effect skipped:", err);
      }
    }
  }, [booking]);

  if (!booking) return null;

  const startDate = new Date(booking.startTime);
  const formattedTime = formatDutchDateTime(startDate);

  const downloadIcsFile = () => {
    const startDate = new Date(booking.startTime);
    const endDate = new Date(booking.endTime);

    const formatIcsDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//WhatsApp AI Booking Engine//NL",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${booking.serviceTitle} - ${booking.location || "WhatsApp Boeking"}`,
      `DESCRIPTION:Boeking via WhatsApp AI\\nKlant: ${booking.customerName}\\nTelefoon: ${booking.customerPhone}\\nBoekings-ID: ${booking.bookingId}`,
      `LOCATION:${booking.location || "Praktijk"}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `UID:${booking.bookingId}@whatsapp-ai.engine`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `afspraak-${booking.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transform transition-all animate-scale-up">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#0D47A1] to-[#1565C0] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
              <CheckCircle2 className="w-7 h-7 text-[#2196F3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Afspraak Bevestigd!</h3>
                <span className="text-[10px] bg-blue-400/30 font-mono text-blue-100 px-2 py-0.5 rounded-full border border-blue-300/30">
                  {booking.bookingId}
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-0.5">
                Automatisch ingepland via de WhatsApp AI Engine
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-[#111B21]">
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#2196F3] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-blue-800/80 font-medium">Datum & Tijdstip</div>
                <div className="text-sm font-bold text-[#0D47A1]">{formattedTime}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-blue-200/60">
              <Clock className="w-4 h-4 text-[#2196F3] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-blue-800/80 font-medium">Geboekte Dienst</div>
                <div className="text-sm font-semibold text-[#0D47A1]">
                  {booking.serviceTitle}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200/70">
            <div className="space-y-1">
              <div className="text-gray-500 flex items-center gap-1 font-medium">
                <User className="w-3.5 h-3.5" /> Naam
              </div>
              <div className="font-semibold text-gray-900">{booking.customerName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 flex items-center gap-1 font-medium">
                <Phone className="w-3.5 h-3.5" /> Telefoon
              </div>
              <div className="font-semibold text-gray-900">{booking.customerPhone}</div>
            </div>
          </div>

          {booking.location && (
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50/50 px-3 py-2 rounded-lg">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{booking.location}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {booking.calendarLink && (
              <a
                href={booking.calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#2196F3] hover:bg-[#1E88E5] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Toevoegen aan Google Agenda</span>
              </a>
            )}

            <button
              onClick={downloadIcsFile}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Download iCal / Apple Agenda (.ics)</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>{booking.isMock ? "Sandbox Demo Modus" : "Google Calendar Gesynchroniseerd"}</span>
          <button
            onClick={onClose}
            className="text-[#2196F3] hover:underline font-semibold"
          >
            Sluiten & Verder Chatten
          </button>
        </div>
      </div>
    </div>
  );
};
