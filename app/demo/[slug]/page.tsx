import React from "react";
import { notFound } from "next/navigation";
import { getProfileBySlug, getAllProfiles } from "@/lib/storage";
import { ChatWindow } from "@/components/whatsapp/ChatWindow";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Smartphone,
  Monitor,
} from "lucide-react";

interface DemoPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DemoPageProps) {
  const profile = getProfileBySlug(params.slug);
  if (!profile) return { title: "Demo Niet Gevonden" };
  return {
    title: `${profile.businessName} • WhatsApp AI Boekingsassistent Demo`,
    description: `Test live de WhatsApp afspraken chatbot voor ${profile.businessName}.`,
  };
}

export default function DemoPage({ params }: DemoPageProps) {
  const profile = getProfileBySlug(params.slug);
  const allProfiles = getAllProfiles();

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0b141a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
          <Calendar className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Profiel '{params.slug}' niet gevonden</h1>
        <p className="text-gray-400 max-w-md mb-6 text-sm">
          Er is nog geen gegenereerd bedrijfsprofiel met deze link. Genereer een nieuwe WhatsApp assistent of open de tandarts demo.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/demo/tandarts-demo"
            className="bg-[#00A884] hover:bg-[#069677] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg"
          >
            Open Tandarts Demo
          </Link>
          <Link
            href="/admin"
            className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            Nieuwe Website Ingesten
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#111b21] flex flex-col items-center justify-between">
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
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/30">
              Live Demo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Switch Profile Dropdown if multiple exist */}
          {allProfiles.length > 1 && (
            <div className="relative group hidden md:block">
              <select
                aria-label="Wissel van bedrijfsprofiel"
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = `/demo/${e.target.value}`;
                  }
                }}
                value={profile.slug}
                className="bg-[#111b21] text-gray-300 border border-gray-700 text-xs rounded-lg px-2.5 py-1 outline-none cursor-pointer hover:border-emerald-500 transition-colors"
              >
                {allProfiles.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.businessName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Link
            href="/admin"
            className="bg-[#00A884] hover:bg-[#069677] text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 text-[11.5px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nieuw Bedrijf</span>
          </Link>
        </div>
      </header>

      {/* Main WhatsApp Frame Area */}
      <div className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6">
        <div className="w-full h-[calc(100vh-45px)] sm:h-[820px] sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col overflow-hidden sm:rounded-2xl sm:shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:border sm:border-gray-800">
          <ChatWindow profile={profile} />
        </div>
      </div>
    </main>
  );
}
