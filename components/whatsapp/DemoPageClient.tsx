"use client";

import React, { useState } from "react";
import { BusinessProfile } from "@/lib/schemas";
import { ChatWindow } from "./ChatWindow";
import { WhatsAppSidebar } from "./WhatsAppSidebar";
import Link from "next/link";
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  PlusCircle,
  Sparkles,
  Zap,
  RotateCcw,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";

interface DemoPageClientProps {
  profile: BusinessProfile;
  allProfiles: BusinessProfile[];
}

export const DemoPageClient: React.FC<DemoPageClientProps> = ({
  profile,
  allProfiles,
}) => {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [scenarioPrompt, setScenarioPrompt] = useState<string>("");

  const testScenarios = [
    {
      label: `🗓️ Boek ${profile.services[0]?.title || "Afspraak"}`,
      prompt: `Hoi, ik wil graag een afspraak inplannen voor ${profile.services[0]?.title || "een behandeling"}. Welke tijden hebben jullie vrij?`,
    },
    {
      label: "💰 Tarieven & Vergoedingen",
      prompt: "Wat zijn jullie tarieven en worden behandelingen vergoed?",
    },
    {
      label: "⚡ Snelle Bevestiging",
      prompt: "Mijn naam is Emma Jansen, tel: 0612345678. Ik wil graag z.s.m. langskomen.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#111b21] flex flex-col justify-between overflow-x-hidden">
      {/* Top Demo Bar */}
      <header className="w-full bg-[#202c33] border-b border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-gray-300 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overzicht</span>
          </Link>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-xs">
              {profile.businessName}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/30 uppercase">
              {profile.industry}
            </span>
          </div>
        </div>

        {/* Center: View Switcher (Desktop vs Mobile Phone Frame) */}
        <div className="hidden sm:flex items-center bg-[#111b21] p-0.5 rounded-lg border border-gray-700">
          <button
            onClick={() => setViewMode("desktop")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all ${
              viewMode === "desktop"
                ? "bg-[#00A884] text-white shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>WhatsApp Web</span>
          </button>

          <button
            onClick={() => setViewMode("mobile")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all ${
              viewMode === "mobile"
                ? "bg-[#00A884] text-white shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobiel Frame</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="bg-[#00A884] hover:bg-[#069677] text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 text-[11.5px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nieuwe Website Ingesten</span>
            <span className="sm:hidden">Nieuw</span>
          </Link>
        </div>
      </header>

      {/* Test Scenarios Quick Bar */}
      <div className="bg-[#182229] border-b border-white/5 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar shrink-0">
        <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold shrink-0 pl-1">
          <Zap className="w-3 h-3" />
          <span>1-Klik Test Scenarios:</span>
        </div>
        {testScenarios.map((sc, idx) => (
          <button
            key={idx}
            onClick={() => setScenarioPrompt(sc.prompt)}
            className="bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 px-3 py-1 rounded-full text-[11.5px] whitespace-nowrap transition-all shrink-0"
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Main WhatsApp Area */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6">
        {viewMode === "desktop" ? (
          /* Desktop WhatsApp Web Split Frame */
          <div className="w-full h-[calc(100vh-95px)] sm:h-[840px] max-w-6xl flex overflow-hidden sm:rounded-2xl sm:shadow-[0_20px_60px_rgba(0,0,0,0.8)] sm:border sm:border-gray-800 bg-[#FFFFFF]">
            <div className="hidden md:block">
              <WhatsAppSidebar currentProfile={profile} allProfiles={allProfiles} />
            </div>
            <div className="flex-1 h-full min-w-0">
              <ChatWindow
                profile={profile}
                presetScenarioPrompt={scenarioPrompt}
                onClearPresetScenario={() => setScenarioPrompt("")}
              />
            </div>
          </div>
        ) : (
          /* Realistic Smartphone Device Mockup Frame */
          <div className="w-full h-[calc(100vh-95px)] sm:h-[840px] sm:max-w-[420px] flex flex-col relative overflow-hidden sm:rounded-[44px] sm:shadow-[0_25px_70px_rgba(0,0,0,0.9)] sm:border-[10px] sm:border-[#1E293B] bg-black">
            {/* Top Speaker / Dynamic Island on Phone Mockup */}
            <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-2 bg-[#075E54] text-white text-[11px] font-medium select-none">
              <span>09:41</span>
              <div className="w-24 h-4 bg-black rounded-full" />
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Chat Frame */}
            <div className="flex-1 h-full overflow-hidden">
              <ChatWindow
                profile={profile}
                presetScenarioPrompt={scenarioPrompt}
                onClearPresetScenario={() => setScenarioPrompt("")}
              />
            </div>

            {/* Phone Home Indicator Bar */}
            <div className="hidden sm:flex justify-center pb-2 pt-1 bg-[#F0F2F5]">
              <div className="w-32 h-1 bg-gray-400 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
