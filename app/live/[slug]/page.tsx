import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { getProfileBySlug, getAllProfiles } from "@/lib/storage";
import { SimulatorClient } from "@/components/whatsapp/SimulatorClient";

interface SimulatorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SimulatorPageProps) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  if (!profile) return { title: "Simulator niet gevonden" };
  return {
    title: `${profile.businessName} — Live WhatsApp Simulator`,
    description: `Test de WhatsApp AI afsprakenassistent van ${profile.businessName} live, met echte diensten, tarieven en agendabeschikbaarheid.`,
  };
}

export default async function SimulatorPage({ params }: SimulatorPageProps) {
  const { slug } = await params;
  const profile = getProfileBySlug(slug);
  const allProfiles = getAllProfiles();

  if (!profile) {
    return (
      <div className="min-h-dvh bg-[#F8FAFC] dark:bg-[#07090E] text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#2196F3]/10 border border-[#2196F3]/25 flex items-center justify-center mb-5 text-[#2196F3]">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold mb-2 tracking-tight">
          Geen configuratie gevonden voor &lsquo;{slug}&rsquo;
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-7 text-sm leading-relaxed">
          Er staat nog geen bedrijfsprofiel onder deze link. Start een AI Bedrijfsscan om er binnen
          tien seconden één te genereren, of bekijk het referentievoorbeeld.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/admin"
            className="bg-[#2196F3] hover:bg-[#1E88E5] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-xs"
          >
            Start AI Bedrijfsscan
          </Link>
          <Link
            href="/live/tandartspraktijk-amsterdam"
            className="bg-white dark:bg-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.1] text-slate-900 dark:text-white border border-slate-200 dark:border-white/[0.1] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            Bekijk referentievoorbeeld
          </Link>
        </div>
      </div>
    );
  }

  return <SimulatorClient profile={profile} allProfiles={allProfiles} />;
}
