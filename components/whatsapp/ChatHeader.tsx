"use client";

import React from "react";
import { BusinessProfile } from "@/lib/schemas";
import {
  ChevronLeft,
  CheckCircle2,
  Video,
  Phone,
  Info,
} from "lucide-react";

interface ChatHeaderProps {
  profile: BusinessProfile;
  isTyping: boolean;
  onOpenInfo: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  profile,
  isTyping,
  onOpenInfo,
}) => {
  return (
    <div className="bg-[#0D47A1] text-white px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-xs select-none sticky top-0 z-20 shrink-0 border-b border-[#0A387E]">
      {/* Left: iOS Back Arrow + Avatar + Info */}
      <div className="flex items-center gap-2 min-w-0">
        {/* iOS Back Button */}
        <div
          onClick={onOpenInfo}
          className="flex items-center text-blue-200 hover:text-white cursor-pointer -ml-1 pr-1 group transition-colors"
          title="Terug naar overzicht"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          <span className="text-xs bg-white/20 text-white font-semibold px-1.5 py-0.2 rounded-full -ml-1 text-[11px] hidden xs:inline-block">
            3
          </span>
        </div>

        {/* Avatar */}
        <div
          className="relative shrink-0 cursor-pointer"
          onClick={onOpenInfo}
          title="Klik voor bedrijfsdetails"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center border border-white/20 shadow-inner">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-base">
                {profile.businessName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#2196F3] border-2 border-[#0D47A1] rounded-full" />
        </div>

        {/* Business Name & Status */}
        <div
          className="min-w-0 cursor-pointer group"
          onClick={onOpenInfo}
        >
          <div className="flex items-center gap-1 min-w-0">
            <h2 className="font-semibold text-white text-[14.5px] sm:text-[15px] leading-tight group-hover:underline truncate max-w-[160px] sm:max-w-[210px]">
              {profile.businessName}
            </h2>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2196F3] fill-[#2196F3] stroke-white shrink-0" />
          </div>
          <p className="text-[11.5px] text-blue-100/90 font-normal leading-tight mt-0.5 truncate">
            {isTyping ? (
              <span className="text-blue-200 font-medium italic animate-pulse">
                aan het typen...
              </span>
            ) : (
              <span>Bedrijfsaccount • Online</span>
            )}
          </p>
        </div>
      </div>

      {/* Right: Authentic WhatsApp Video & Audio Call Icons */}
      <div className="flex items-center gap-2 sm:gap-3 text-blue-100 shrink-0">
        <button
          onClick={() => alert(`Simulatie: WhatsApp Videogesprek met ${profile.businessName}`)}
          className="p-1.5 rounded-full hover:bg-white/10 text-blue-100 transition-colors"
          title="Videogesprek starten"
        >
          <Video className="w-5 h-5" />
        </button>

        <button
          onClick={() => alert(`Simulatie: WhatsApp Spraakoproep naar ${profile.phone || profile.businessName}`)}
          className="p-1.5 rounded-full hover:bg-white/10 text-blue-100 transition-colors"
          title="Bellen via WhatsApp"
        >
          <Phone className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenInfo}
          className="p-1.5 rounded-full hover:bg-white/10 text-blue-100 transition-colors"
          title="Bedrijfsinformatie bekijken"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
