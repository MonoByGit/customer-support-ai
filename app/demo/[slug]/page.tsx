import React from "react";
import { getProfileBySlug, getAllProfiles } from "@/lib/storage";
import { DemoPageClient } from "@/components/whatsapp/DemoPageClient";
import Link from "next/link";
import { Calendar } from "lucide-react";

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

  return <DemoPageClient profile={profile} allProfiles={allProfiles} />;
}
