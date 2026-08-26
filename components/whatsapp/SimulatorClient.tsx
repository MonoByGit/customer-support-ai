"use client";

import React, { useState } from "react";
import { BusinessProfile } from "@/lib/schemas";
import { ChatWindow } from "./ChatWindow";
import { WhatsAppSidebar } from "./WhatsAppSidebar";
import { EmbedModal } from "./EmbedModal";
import Link from "next/link";
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  PlusCircle,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Share2,
  Code2,
  Check,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";

interface SimulatorClientProps {
  profile: BusinessProfile;
  allProfiles: BusinessProfile[];
}

export const SimulatorClient: React.FC<SimulatorClientProps> = ({
  profile,
  allProfiles,
}) => {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [scenarioPrompt, setScenarioPrompt] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [chatKey, setChatKey] = useState<number>(1);

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
      label: "📍 Locatie & Openingstijden",
      prompt: "Waar zijn jullie gevestigd en tot hoe laat zijn jullie geopend?",
    },
    {
      label: "⚡ Snelle Klantbevestiging",
      prompt: "Mijn naam is Emma Jansen, tel: 0612345678. Ik wil graag z.s.m. langskomen.",
    },
  ];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleResetChat = () => {
    setChatKey((prev) => prev + 1);
  };

  return (
    <main className="h-[100dvh] min-h-[600px] bg-[#F8FAFC] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden">
      {/* Top Professional Navigation Bar */}
      <header className="w-full bg-white/90 dark:bg-[#0C0F17]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.07] px-6 sm:px-10 py-3.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Overzicht</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2196F3] animate-ping" />
            <span className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[150px] sm:max-w-xs">
              {profile.businessName}
            </span>
            <span className="bg-[#2196F3]/10 text-[#2196F3] px-2 py-0.5 rounded-md text-[10px] font-mono border border-[#2196F3]/20 uppercase font-semibold">
              {profile.industry}
            </span>
          </div>
        </div>

        {/* View Switcher: Mobile Phone Mockup vs Desktop Web */}
        <div className="flex items-center gap-2.5">

          <div className="flex items-center bg-slate-100 dark:bg-white/[0.04] p-1 rounded-lg border border-slate-200/80 dark:border-white/[0.08]">
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "mobile"
                  ? "bg-[#2196F3] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone Frame</span>
            </button>

            <button
              onClick={() => setViewMode("desktop")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "desktop"
                  ? "bg-[#2196F3] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Web</span>
              <span className="sm:hidden">Web</span>
            </button>
          </div>

          <Link
            href="/admin"
            className="bg-white hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 text-xs hidden md:flex"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>Nieuwe AI Bedrijfsscan</span>
          </Link>
        </div>
      </header>

      {/* Simulator-bedieningsbalk */}
      <div className="w-full bg-slate-100/90 dark:bg-[#0d141e]/90 border-b border-slate-200/80 dark:border-white/[0.06] px-6 sm:px-10 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-20 transition-colors">
        {/* Left: 1-Click Scenario Triggers */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 text-[#2196F3] font-bold text-[11px] shrink-0 pr-1">
            <Zap className="w-3.5 h-3.5" />
            <span>1-Klik Test:</span>
          </div>
          {testScenarios.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => setScenarioPrompt(sc.prompt)}
              className="bg-white dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-slate-700 dark:text-slate-300 hover:text-[#2196F3] dark:hover:text-[#2196F3] border border-slate-200/80 dark:border-white/[0.08] hover:border-[#2196F3]/40 px-3 py-1 rounded-lg text-[11.5px] whitespace-nowrap transition-all shadow-2xs shrink-0 font-medium"
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Rechts: simulator-acties */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-1.5 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              soundEnabled
                ? "bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-[#2196F3] dark:text-[#2196F3]"
                : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-slate-400"
            }`}
            title={soundEnabled ? "Geluidseffecten ingeschakeld" : "Geluidseffecten gedempt"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? "Geluid Aan" : "Geluid Uit"}</span>
          </button>

          <button
            onClick={() => setIsEmbedOpen(true)}
            className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
            title="Website Embed Code & wa.me link"
          >
            <Code2 className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>Embed Widget</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
            title="Herstart gesprek"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
            title="Kopieer deelbare link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#2196F3]" /> : <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
            <span>{copiedLink ? "Gekopieerd!" : "Deel"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Area */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-2 sm:p-5 md:p-6 relative overflow-hidden">
        {/* Subtle background ambient radial lighting */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-[#2196F3]/5 rounded-full blur-3xl" />
        </div>

        {viewMode === "mobile" ? (
          /* ====================================================================
             FLAWLESS IPHONE SMARTPHONE FRAME
             ==================================================================== */
          <div className="relative w-full max-w-[400px] h-full max-h-[820px] bg-black rounded-[48px] p-2.5 border-[10px] border-slate-800 shadow-[0_25px_90px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_90px_rgba(0,0,0,0.95)] flex flex-col animate-scale-up">
            {/* Screen Inner Glass Container */}
            <div className="relative flex-1 w-full h-full bg-[var(--wa-wallpaper)] rounded-[38px] overflow-hidden flex flex-col">
              {/* iPhone iOS Status Bar & Dynamic Island */}
              <div className="bg-[#0A192F] text-white px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold select-none shrink-0 z-30">
                <span className="font-mono">09:41</span>
                {/* Dynamic Island pill */}
                <div className="w-24 h-4 bg-black rounded-full shadow-inner" />
                <div className="flex items-center gap-1.5 text-white/90">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Edge-to-Edge Chat Component */}
              <div className="flex-1 w-full h-full overflow-hidden">
                <ChatWindow
                  key={chatKey}
                  profile={profile}
                  presetScenarioPrompt={scenarioPrompt}
                  onClearPresetScenario={() => setScenarioPrompt("")}
                  soundEnabled={soundEnabled}
                />
              </div>

              {/* iPhone Home Swipe Bar */}
              <div className="bg-[var(--wa-panel)] py-1.5 flex justify-center shrink-0 select-none">
                <div className="w-32 h-1 bg-gray-400/80 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* ====================================================================
             WHATSAPP WEB DESKTOP FULL SPLIT-SCREEN FRAME
             ==================================================================== */
          <div className="w-full max-w-5xl h-full max-h-[820px] bg-[#FFFFFF] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-[0_20px_80px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.9)] flex overflow-hidden animate-scale-up">
            {/* Left Sidebar */}
            <div className="hidden md:block w-80 shrink-0 border-r border-[var(--wa-divider)]">
              <WhatsAppSidebar currentProfile={profile} allProfiles={allProfiles} />
            </div>

            {/* Right Active Chat Pane */}
            <div className="flex-1 h-full min-w-0">
              <ChatWindow
                key={chatKey}
                profile={profile}
                presetScenarioPrompt={scenarioPrompt}
                onClearPresetScenario={() => setScenarioPrompt("")}
                soundEnabled={soundEnabled}
              />
            </div>
          </div>
        )}
      </div>

      {/* Embed Modal */}
      <EmbedModal
        profile={profile}
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
      />
    </main>
  );
};
