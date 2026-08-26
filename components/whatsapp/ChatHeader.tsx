"use client";

import React from "react";
import { BusinessProfile } from "@/lib/schemas";
import {
  Phone,
  Video,
  MoreVertical,
  CheckCircle2,
  Volume2,
  VolumeX,
  Info,
  RotateCcw,
  Share2,
} from "lucide-react";

interface ChatHeaderProps {
  profile: BusinessProfile;
  isTyping: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetChat: () => void;
  onShare: () => void;
  onOpenInfo: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  profile,
  isTyping,
  soundEnabled,
  onToggleSound,
  onResetChat,
  onShare,
  onOpenInfo,
}) => {
  return (
    <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md select-none sticky top-0 z-20">
      {/* Left: Avatar & Info */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={onOpenInfo}
        title="Klik voor bedrijfsinformatie"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center border border-white/20 shadow-inner">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg">
                {profile.businessName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#075E54] rounded-full" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="font-semibold text-white text-[15px] leading-tight group-hover:underline">
              {profile.businessName}
            </h2>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366] stroke-white" />
          </div>
          <p className="text-xs text-emerald-100/90 font-normal leading-tight mt-0.5">
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
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-full transition-colors ${
            soundEnabled
              ? "text-emerald-100 hover:bg-white/10"
              : "text-emerald-300/60 hover:bg-white/10"
          }`}
          title={soundEnabled ? "Geluid uitschakelen" : "Geluid inschakelen"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onResetChat}
          className="p-2 rounded-full text-emerald-100 hover:bg-white/10 transition-colors"
          title="Gesprek opnieuw starten"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onShare}
          className="p-2 rounded-full text-emerald-100 hover:bg-white/10 transition-colors"
          title="Deel deze demo link"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenInfo}
          className="p-2 rounded-full text-emerald-100 hover:bg-white/10 transition-colors"
          title="Bedrijfsdetails"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
