"use client";

import React from "react";
import { BusinessProfile } from "@/lib/schemas";
import {
  MoreVertical,
  CheckCircle2,
  Volume2,
  VolumeX,
  Info,
  RotateCcw,
  Share2,
  Code2,
} from "lucide-react";

interface ChatHeaderProps {
  profile: BusinessProfile;
  isTyping: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetChat: () => void;
  onShare: () => void;
  onOpenInfo: () => void;
  onOpenEmbed?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  profile,
  isTyping,
  soundEnabled,
  onToggleSound,
  onResetChat,
  onShare,
  onOpenInfo,
  onOpenEmbed,
}) => {
  return (
    <div className="bg-[#075E54] text-white px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-md select-none sticky top-0 z-20 shrink-0">
      {/* Left: Avatar & Info */}
      <div
        className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0"
        onClick={onOpenInfo}
        title="Klik voor bedrijfsinformatie"
      >
        <div className="relative shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center border border-white/20 shadow-inner">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-base sm:text-lg">
                {profile.businessName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#25D366] border-2 border-[#075E54] rounded-full" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="font-semibold text-white text-[14px] sm:text-[15px] leading-tight group-hover:underline truncate">
              {profile.businessName}
            </h2>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366] stroke-white shrink-0" />
          </div>
          <p className="text-xs text-emerald-100/90 font-normal leading-tight mt-0.5 truncate">
            {isTyping ? (
              <span className="text-emerald-200 font-medium italic animate-pulse">
                aan het typen...
              </span>
            ) : (
              <span>Bedrijfsaccount • Online</span>
            )}
          </p>
        </div>
      </div>

      {/* Right: Quick action toolbar */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <button
          onClick={onToggleSound}
          className={`p-1.5 sm:p-2 rounded-full transition-colors ${
            soundEnabled
              ? "text-emerald-100 hover:bg-white/10"
              : "text-emerald-300/60 hover:bg-white/10"
          }`}
          title={soundEnabled ? "Geluid uitschakelen" : "Geluid inschakelen"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {onOpenEmbed && (
          <button
            onClick={onOpenEmbed}
            className="p-1.5 sm:p-2 rounded-full text-emerald-100 hover:bg-white/10 transition-colors hidden sm:inline-flex"
            title="Embed Code & Widget"
          >
            <Code2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onResetChat}
          className="p-1.5 sm:p-2 rounded-full text-emerald-100 hover:bg-white/10 transition-colors"
          title="Gesprek opnieuw starten"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onShare}
          className="p-1.5 sm:p-2 rounded-full text-emerald-100 hover:bg-white/10 transition-colors"
          title="Deel deze demo link"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenInfo}
          className="p-1.5 sm:p-2 rounded-full text-emerald-100 hover:bg-white/10 transition-colors"
          title="Bedrijfsdetails & Diensten"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
