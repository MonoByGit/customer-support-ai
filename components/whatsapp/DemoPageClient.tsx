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
  Sparkles,
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
  Calendar,
  Layers,
} from "lucide-react";

interface DemoPageClientProps {
  profile: BusinessProfile;
  allProfiles: BusinessProfile[];
}

export const DemoPageClient: React.FC<DemoPageClientProps> = ({
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
    <main className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-[#00A884]">
      {/* Top Professional Navigation Bar */}
      <header className="w-full bg-[#0b1017]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 py-3 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Showcase Overzicht</span>
          </Link>
          <span className="text-slate-700 hidden sm:inline">/</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span className="font-bold text-white text-sm truncate max-w-[150px] sm:max-w-xs">
              {profile.businessName}
            </span>
            <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/30 uppercase font-semibold">
              {profile.industry}
            </span>
          </div>
        </div>

        {/* View Switcher: Mobile Phone Mockup vs Desktop Web */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#111827] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "mobile"
                  ? "bg-[#00A884] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone Frame</span>
            </button>

            <button
              onClick={() => setViewMode("desktop")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "desktop"
                  ? "bg-[#00A884] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Web</span>
              <span className="sm:hidden">Web</span>
            </button>
          </div>

          <Link
            href="/admin"
            className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-3.5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 text-xs hidden md:flex"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nieuw Bedrijf Scrapen</span>
          </Link>
        </div>
      </header>

      {/* Floating Demo Control & Test Toolbar */}
      <div className="w-full bg-[#0d141e]/90 border-b border-white/[0.06] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-20">
        {/* Left: 1-Click Scenario Triggers */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-[11px] shrink-0 pr-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>1-Klik Test:</span>
          </div>
          {testScenarios.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => setScenarioPrompt(sc.prompt)}
              className="bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/[0.08] hover:border-emerald-500/40 px-3 py-1 rounded-lg text-[11.5px] whitespace-nowrap transition-all shadow-xs shrink-0 font-medium"
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Right: Demo Inspector Actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-1.5 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              soundEnabled
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-slate-800/60 border-white/[0.06] text-slate-400"
            }`}
            title={soundEnabled ? "Geluidseffecten ingeschakeld" : "Geluidseffecten gedempt"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? "Geluid Aan" : "Geluid Uit"}</span>
          </button>

          <button
            onClick={() => setIsEmbedOpen(true)}
            className="p-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Website Embed Code & wa.me link"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Embed Widget</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Herstart gesprek"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Kopieer demo link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedLink ? "Gekopieerd!" : "Deel"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Area */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-6 md:p-8 relative">
        {/* Subtle background ambient radial lighting */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        {viewMode === "mobile" ? (
          /* ====================================================================
             FLAWLESS IPHONE SMARTPHONE FRAME (ZERO NESTED BORDER CLASHING)
             ==================================================================== */
          <div className="relative w-full max-w-[400px] h-[calc(100vh-140px)] max-h-[820px] bg-black rounded-[48px] p-2.5 border-[10px] border-[#1e293b] shadow-[0_25px_90px_rgba(0,0,0,0.95)] flex flex-col animate-scale-up">
            {/* Screen Inner Glass Container */}
            <div className="relative flex-1 w-full h-full bg-[#EFEAE2] rounded-[38px] overflow-hidden flex flex-col">
              {/* iPhone iOS Status Bar & Dynamic Island */}
              <div className="bg-[#075E54] text-white px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold select-none shrink-0 z-30">
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
              <div className="bg-[#F0F2F5] py-1.5 flex justify-center shrink-0 select-none">
                <div className="w-32 h-1 bg-gray-400/80 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* ====================================================================
             WHATSAPP WEB DESKTOP FULL SPLIT-SCREEN FRAME
             ==================================================================== */
          <div className="w-full max-w-5xl h-[calc(100vh-140px)] max-h-[820px] bg-[#FFFFFF] rounded-2xl border border-white/[0.08] shadow-[0_20px_80px_rgba(0,0,0,0.9)] flex overflow-hidden animate-scale-up">
            {/* Left Sidebar */}
            <div className="hidden md:block w-80 shrink-0 border-r border-[#E9EDEF]">
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
